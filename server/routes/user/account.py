import logging
import os

import stripe
from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
)

from dependencies.db import GetDb
from dependencies.redis import GetRedisClient
from dependencies.settings import AppSettings
from dependencies.user_dependencies import CurrentUser, CurrentUserOrGuest
from models.extractors.data_extractor import ExtractData
from models.models_ import (
    Feedback,
)
from models.redis_manager import RedisManager
from models.user.user import User  # noqa: TCH001
from models.user.user_manager import UserManager
from routes.data_classes.response import StandardApiResponse
from routes.data_classes.user_schema import (
    AccountDeletionRequest,
    FeedbackRequest,
    UsageRecordResponse,
    UserDataResponse,
    UserUpdateRequest,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("App")

account_router = APIRouter()


@account_router.post("/feedback", response_model=StandardApiResponse, tags=["feedback"])
async def feedback(  # noqa: ANN201
    request: FeedbackRequest,
    db: GetDb,
    user_or_guest: CurrentUserOrGuest,
):
    if user_or_guest != "guest":
        user_id = user_or_guest.id
    else:
        user_id = None
    entry = Feedback(
        name=request.nameField,
        email=request.emailField,
        message=request.messageField,
        type_feedback=request.feedbackTypeField,
        user_id=user_id,
    )
    db.add(entry)
    await db.commit()
    return {"status": "success", "message": "Thank you for your feedback!"}


@account_router.delete("/account", response_model=StandardApiResponse, tags=["account"])
async def delete_account(db: GetDb, user: CurrentUser, request: AccountDeletionRequest):  # noqa: ANN201
    await db.merge(user)

    if user.email != request.del_email:
        return {
            "status": "failure",
            "message": "Account not found",
        }
    final_reason = str(
        request.reason if request.reason != "other" else request.other_reason,
    )

    await UserManager.delete_user_account(db, user, final_reason, str(request.more))
    await db.commit()
    return {
        "status": "success",
        "message": "Account deleted",
    }


@account_router.delete("/email-notifications", tags=["notifications"])
async def disable_email_notifications(user: CurrentUser, db: GetDb):  # noqa: ANN201
    user.contacted_email = False
    await db.commit()
    return {"status": "success", "message": "Notifications disabled"}


@account_router.post("/email-notifications", tags=["notifications"])
async def enable_email_notifications(user: CurrentUser, db: GetDb):  # noqa: ANN201
    user.contacted_email = True
    await db.commit()
    return {"status": "success", "message": "Notifications enabled"}


@account_router.patch("/account", response_model=UserDataResponse, tags=["account"])
async def update_account(update_data: UserUpdateRequest, user: CurrentUser, db: GetDb):  # noqa: ANN201
    await db.merge(user)
    for field, value in update_data.model_dump().items():
        if value is not None:
            setattr(user, field, value)
    await db.commit()
    subscriber = await UserManager.check_subscriber_exists(db, user.email)
    user_data = user.to_dict()
    if subscriber:
        user_data["subscriber"] = True
    else:
        user_data["subscriber"] = False

    return {
        "status": "success",
        "message": "Account updated",
        "user": user_data,
        "loggedIn": True,
    }


@account_router.post(
    "/profile-picture",
    response_model=UserDataResponse,
    tags=["account"],
)
async def update_profile_picture(  # noqa: ANN201
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
    r_client: GetRedisClient,
    profile_pic: UploadFile = File(),
):
    await db.merge(user)

    user_data = await UserManager.upload_profile_picture(
        user,
        profile_pic,
        settings.aws,
    )

    ## update cache
    user_dict = user_data.to_dict()
    await RedisManager.cache_json_data(r_client, f"user_{user.id}", user_dict, 180)
    await db.commit()
    return {
        "status": "success",
        "message": "Picture updated",
        "user": user_dict,
        "loggedIn": True,  # You must include this field in the response
    }


@account_router.delete(
    "/profile-picture",
    response_model=UserDataResponse,
    tags=["account"],
)
async def delete_profile_picture(user: CurrentUser, db: GetDb):  # noqa: ANN201
    await db.merge(user)
    ## was having issues of user becoming detached here
    if user.pic is not None:
        refreshed_user: User = await UserManager.delete_profile_picture(user)
        await db.commit()
        return {
            "status": "success",
            "message": "Picture deleted",
            "user": refreshed_user.to_dict(),
            "loggedIn": True,  # You must include this field in the response
        }

    raise HTTPException(status_code=404, detail="Profile picture not found")


# class UpdateDataRequest(BaseModel):
#     type: str = "decks" | "cards" | "quizzes" | "groups" | "files" | "public" | "mastered" | "learning" | "credit" | "all" | "cards-all" | "cards-new"
## TODO at some point double check if files are working properly
@account_router.patch("/data/{type}", response_model=UserDataResponse, tags=["user"])
async def update_user_data(  # noqa: ANN201
    update_type: str,
    user: CurrentUser,
    db: GetDb,
    settings: AppSettings,
):
    await db.merge(user)

    """Accepts the following params  "quizzes" | "groups" | "files" |
    "credit" | "all" | "cards" | "cards-all"
    all and cards-all are very DB intensive.  Call very rarely"""
    if update_type not in [
        "quizzes",
        "groups",
        "files",
        "credit",
        "all",
        "cards",
        "cards-all",
        "public-decks",
        "sign-in",
    ]:
        raise HTTPException(status_code=404, detail="Invalid type")
    if update_type in ("cards-all"):
        await UserManager.update_quantity_cards_data(db, user)
    if update_type in ("cards", "all", "sign-in"):
        await UserManager.update_quantity_cards_data_based_on_decks(db, user)
    if update_type in ("quizzes", "all", "sign-in"):
        await UserManager.update_quantity_quizzes(db, user)
    if update_type in ("groups", "all", "sign-in"):
        await UserManager.update_quantity_groups(db, user)
    if update_type in ("files", "all", "sign-in"):
        await UserManager.update_quantity_files(db, user)
    if update_type in ("credit", "all", "sign-in"):
        await UserManager.async_remaining_credit(db, user, settings.token)
    if update_type in ("public-decks", "all", "sign-in"):
        await UserManager.update_quantity_decks_public(db, user)
    user_data = user.to_dict()
    await db.commit()
    # cache_durations = {
    #     "quizzes": 1200,
    #     "groups": 1200,
    #     "files": 1200,
    #     "credit": 10,
    #     "all": 1200,
    #     "cards": 1200,
    #     "cards-all": 1200,
    #     "public-decks": 1200,
    #     "sign-in": 120,
    # }

    return {
        "status": "success",
        "message": "User data updated",
        "user": user_data,
        "loggedIn": True,
    }


@account_router.get(
    "/remaining-credit",
    response_model=UsageRecordResponse,
    tags=["account"],
)
async def remaining_credit(  # noqa: ANN201
    user: CurrentUser,
    settings: AppSettings,
    db: GetDb,
    r_client: GetRedisClient,
):
    res = await UserManager.get_latest_usage_record_for_user(db, user)

    data = res.to_dict()
    remaining_credit = round(
        ExtractData.tokens_to_credit(res.remaining_count, settings.token),
    )
    if remaining_credit != user.remaining_credit:
        user.remaining_credit = remaining_credit
        user_dict = user.to_dict()
        await RedisManager.cache_json_data(r_client, f"user_{user.id}", user_dict, 180)
        await db.commit()
    data["remaining_credit"] = remaining_credit
    return {
        "status": "success",
        "message": "Remaining credit",
        "data": None,
        "usageRecords": [data],
    }


@account_router.get("/customer-session", tags=["account"])
async def create_customer_session(  # noqa: ANN201
    user: CurrentUser,
):
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

    return stripe.CustomerSession.create(
        customer=user.stripe_customer_id,
        components={"pricing_table": {"enabled": True}},
    )
