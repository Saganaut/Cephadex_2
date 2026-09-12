import json
import logging
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from redis import Redis

from dependencies.db import GetSyncDb
from dependencies.posthog import GetPostHog
from dependencies.settings import AppSettings
from dependencies.user_dependencies import CurrentUser
from models.exceptions.exceptions import (
    AudioError,
    UnsupportedFileError,
    YoutubeError,
)
from models.exceptions.flask_error_handlers import (
    handle_audio_error,
    handle_file_not_found_error,
    handle_youtube_error,
)
from models.extractors.data_extractor import ExtractData
from models.extractors.job_creator import JobManager
from models.helpers.log_decorators import log_decorator
from models.redis_manager import RedisManager
from models.user.user_manager import UserManager
from routes.data_classes.create_schema import ExtractionRequestData
from startup.setup_redis import setup_sync_redis_client

router = APIRouter(
    prefix="/create",
    tags=["create"],
)

logger = logging.getLogger("App")


class ExtractResponse(BaseModel):
    status: str
    message: str
    slug: str
    deckId: int


MIN_PLAN_TO_SAVE_DOCS = 3


# TODO add in updating user credit
@log_decorator
@router.post("/", response_model=ExtractResponse, tags=["create"])
def extract(  # noqa: ANN201, C901
    db: GetSyncDb,
    user: CurrentUser,
    settings: AppSettings,
    posthog: GetPostHog,
    data: Annotated[str, Form()],
    r_client: Redis = Depends(setup_sync_redis_client),
    file: Optional[UploadFile] = File(None),
):
    """Take the form data from the extraction form and creates an extractor instance
    that will handle the extraction process,
    returns a slug corresponding to the notification that will be sent to the user
    when the extraction is complete.
    Since this route has some CPU bound tasks it is not async, additionally
    the whisper API has no async support
    """
    logger.info("Extract request received")
    data_dict = json.loads(data)
    extraction_data = ExtractionRequestData.model_validate(data_dict)

    extractor_data = ExtractData.prepare_extractor_data(extraction_data, user.id, file)
    extract_obj = ExtractData.get_content(r_client, extractor_data, settings)
    extract_obj = ExtractData.quantity_tokens(extract_obj, settings.token)

    try:
        deck, new_deck_created = ExtractData.get_deck(db, user.id, extract_obj)
        if new_deck_created is True:
            db.add(deck)
            db.flush()
        extract_obj.deck_id = deck.id
        if extract_obj.tokens is None:
            raise HTTPException(  # noqa: TRY301
                status_code=400,
                detail="Unable to proceed, please try again",
            )
        if user.subscription_plan > MIN_PLAN_TO_SAVE_DOCS:
            ExtractData.save_source_text(
                db,
                deck,
                extract_obj,
                settings.aws,
                user,
                r_client,
            )
        new_record, has_credit = UserManager.check_user_has_sufficient_credit(
            db,
            user,
            "extract",
            extract_obj.tokens,
        )
        db.add(new_record)
        user.remaining_credit = ExtractData.tokens_to_credit(
            new_record.remaining_count,
            settings.token,
        )
        if has_credit is False:
            if new_deck_created is True:
                db.rollback()
                db.commit()
            return {"status": "fail", "message": "Insufficient credit"}
        notification, jobs = JobManager.create_jobs(extract_obj)
        JobManager.create_redis_jobs(r_client, jobs)
        db.add(notification)
        ExtractData.job_clean_up(extract_obj)
        user.remaining_credit = ExtractData.tokens_to_credit(
            new_record.remaining_count,
            settings.token,
        )
        db.commit()
        RedisManager.cache_json_data_non_async(
            r_client,
            f"user_{user.id}",
            user.to_dict(),
            180,
        )
        posthog.capture(
            distinct_id=user.id,
            event="create",
            properties={
                "source": extract_obj.source_type,
                "task_type": extract_obj.task_type,
                "tokens": extract_obj.tokens,
            },
        )

    except AudioError as e:
        handle_audio_error(user.id, e)
        raise HTTPException(status_code=400, detail="Audio error") from e
    except YoutubeError as e:
        handle_youtube_error(user.id, e)
        raise HTTPException(status_code=400, detail="Youtube error") from e
    except FileNotFoundError as e:
        handle_file_not_found_error(user.id, e)
        raise HTTPException(status_code=400, detail="File not found error") from e
    except UnsupportedFileError as e:
        logger.exception("Unsupported file error")
        raise HTTPException(status_code=400, detail="Unsupported file error") from e
    except Exception as e:
        logger.exception("Unknown error")
        raise HTTPException(status_code=400, detail="Unknown error") from e
    return {
        "status": "success",
        "message": "Extract started",
        "slug": extract_obj.slug,
        "deckId": deck.id,
    }


class CreditResponse(BaseModel):
    status: str
    message: str
    credit: Optional[float] = None


@log_decorator
@router.post("/credit", response_model=CreditResponse, tags=["credit"])
def call_credit_counter(
    user: CurrentUser,
    data: Annotated[str, Form()],
    settings: AppSettings,
    r_client: Redis = Depends(setup_sync_redis_client),
    file: Optional[UploadFile] = File(None),
) -> dict:
    """Take the same request model as the extract endpoint and returns the credit
    that the extraction
    will cost
    In practice the only fields that are used are file, text, link and link expanded.
    Since this route has some CPU bound tasks it is not async
    """
    try:
        data_dict = json.loads(data)
        extraction_data = ExtractionRequestData.model_validate(data_dict)
        extractor_data = ExtractData.prepare_extractor_data(
            extraction_data,
            user.id,
            file,
        )
        extract_obj = ExtractData.get_content(r_client, extractor_data, settings)
        extract_obj = ExtractData.quantity_tokens(extract_obj, settings.token)
        if extract_obj.tokens is None:
            return {"status": "fail", "message": "Unable to get"}
        credit = extract_obj.tokens / settings.token.tokens_per_page
        credit = round(
            ExtractData.tokens_to_credit(extract_obj.tokens, settings.token),
            1,
        )
        return {
            "status": "success",
            "message": "Call credit counter",
            "credit": credit,
        }
    except Exception:
        logger.exception("Error in credit call, unable to extract content.")
        return {"status": "failure", "message": "Unable to retrieve content"}
