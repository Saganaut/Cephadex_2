import logging

from fastapi import (
    APIRouter,
    HTTPException,
    Response,
)
from sqlalchemy.future import select

from dependencies.db import GetDb
from dependencies.redis import GetRedisClient
from dependencies.user_dependencies import CurrentUser
from models.creators.formatters import create_pdf
from models.decks.deck.deck_manager import DeckManager
from models.helpers.log_decorators import log_decorator
from models.models_ import Deck, DeckFiles
from models.redis_manager import RedisManager
from models.storage.s3 import StorageManager
from routes.data_classes.deck_schema import (
    DeckFilesSchema,
    FileDataResponse,
)
from routes.data_classes.response import (
    StandardApiResponse,
)

files_router = APIRouter()

logger = logging.getLogger("App")


# TODO check and possibly modify the way files are handled.  Can we send the whole thing
# back in a dict?
@log_decorator
@files_router.get("/{deck_id}/files", response_model=FileDataResponse, tags=["file"])
async def get_files(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    deck_files = await DeckManager.load_deck_files(db, deck)
    if not deck_files:
        return {"status": "success", "message": "No files found", "files": []}
    files = []
    file_ids = []
    for file in deck_files:
        file_data = DeckFilesSchema.model_validate(file.to_dict())
        if file_data.file_type in ["pdf", "docx", "pptx", ".pdf", ".docx", ".pptx"]:
            if file_data.file_path is None:
                msg = "File path is None"
                raise ValueError(msg)
            pre_signed_url = StorageManager.create_presigned_url(file_data.file_path)
            file_data.file_path = pre_signed_url
        files.append(file_data)
        file_ids.append(file_data.id)

    return {
        "status": "success",
        "message": "Files retrieved",
        "files": files,
        "fileIds": file_ids,
    }


@files_router.get("/file/{file_id}", response_model=FileDataResponse, tags=["file"])
async def get_single_file(file_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    ## find deck to which file belongs
    query = select(Deck).join(Deck.deck_files).where(DeckFiles.id == file_id)
    result = await db.execute(query)
    # Fetch the first result
    deck = result.scalars().first()
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    if user.id != deck.user_id:
        raise HTTPException(status_code=403, detail="User does not have permission")
    result = await db.execute(select(DeckFiles).where(DeckFiles.id == file_id))
    deck_file = result.scalar()
    if not deck_file:
        raise HTTPException(status_code=404, detail="File not found")
    file_data = DeckFilesSchema.model_validate(deck_file.to_dict())
    if file_data.file_type in ["pdf", "docx", "pptx", ".pdf", ".docx", ".pptx"]:
        if file_data.file_path is None:
            msg = "File path is None"
            raise ValueError(msg)
        pre_signed_url = StorageManager.create_presigned_url(file_data.file_path)
        file_data.file_path = pre_signed_url
    return {
        "status": "success",
        "message": "File retrieved succesfully",
        "files": [file_data],
    }


@files_router.get("/{deck_id}/file/{file_id}/pdf", tags=["file"])
async def download_file_as_pdf(  # noqa: ANN201
    deck_id: int,
    file_id: int,
    db: GetDb,
    user: CurrentUser,
):
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    query = await db.execute(select(DeckFiles).where(DeckFiles.id == file_id))
    deck_file = query.scalar()
    if not deck_file:
        raise HTTPException(status_code=404, detail="File not found")
    text_string = deck_file.text_string
    pdf_buffer = create_pdf(text_string)
    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=file.pdf"},
    )


@files_router.get(
    "/{deck_id}/file/{file_id}",
    response_model=FileDataResponse,
    tags=["file"],
)
async def get_file(deck_id: int, file_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    result = await db.execute(select(DeckFiles).where(DeckFiles.id == file_id))
    deck_file = result.scalars().first()
    if not deck_file:
        raise HTTPException(status_code=404, detail="File not found")
    if not deck_file:
        raise HTTPException(status_code=404, detail="File not found")
    file_data = DeckFilesSchema.model_validate(deck_file.to_dict())
    if file_data.file_type in ["pdf", "docx", "pptx", ".pdf", ".docx", ".pptx"]:
        if file_data.file_path is None:
            msg = "File path is None"
            raise ValueError(msg)
        pre_signed_url = StorageManager.create_presigned_url(file_data.file_path)
        file_data.file_path = pre_signed_url
    return {
        "status": "success",
        "message": "File retrieved succesfully",
        "files": [file_data],
    }


# TODO fix this route, wont download as PDF


@files_router.delete(
    "/{deck_id}/file/{file_id}",
    response_model=StandardApiResponse,
    tags=["file"],
)
async def delete_file(  # noqa: ANN201
    deck_id: int,
    file_id: int,
    db: GetDb,
    user: CurrentUser,
    r_client: GetRedisClient,
):
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    result = await db.execute(select(DeckFiles).where(DeckFiles.id == file_id))
    deck_file = result.scalar()
    if not deck_file:
        raise HTTPException(status_code=404, detail="File not found")

    if deck_file.file_type in ["pdf", "docx", "pptx", ".pdf", ".docx", ".pptx"]:
        StorageManager.delete_s3_object_in_folder_from_path(deck_file.file_path)
        # remove embeddings from redis
        if deck_file.slug is not None:
            await RedisManager.delete_keys_by_pattern(
                r_client,
                f"Embedding:{deck_file.slug}",
            )
    await db.delete(deck_file)
    await db.commit()
    return {"status": "success", "message": "File deleted"}


@files_router.patch(
    "/{deck_id}/file/{file_id}",
    response_model=StandardApiResponse,
    tags=["file"],
)
async def rename_file(  # noqa: ANN201
    deck_id: int,
    file_id: int,
    new_name: str,
    db: GetDb,
    user: CurrentUser,
):
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    result = await db.execute(select(DeckFiles).where(DeckFiles.id == file_id))
    deck_file = result.scalar()
    if not deck_file:
        raise HTTPException(status_code=404, detail="File not found in deck")
    deck_file.file_name = new_name
    await db.commit()
    return {"status": "success", "message": "File renamed"}
