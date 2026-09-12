import logging

from fastapi import APIRouter, HTTPException, status

from dependencies.db import GetDb
from dependencies.user_dependencies import CurrentUser
from models.decks.deck.deck_manager import DeckManager
from models.group.group_manager import GroupManager
from routes.data_classes.deck_schema import DeckDataResponse, DeckSchema
from routes.data_classes.group_schema import AddDeckToGroupRequest
from routes.data_classes.response import StandardApiResponse

group_decks_router = APIRouter()

logger = logging.getLogger("App")


@group_decks_router.get(
    "/{group_id}/deck",
    response_model=DeckDataResponse,
    tags=["group-decks"],
)
async def get_decks_for_group(group_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    logger.info("entered get decks for group")
    group = await GroupManager.retrieve_group_and_load_decks(db, group_id)
    await GroupManager.check_group_permission(db, user.id, group, "read")
    decks = await GroupManager.get_decks_for_group(db, group_id)
    return {
        "status": "success",
        "message": "Decks retrieved successfully",
        "decks": decks,
    }


@group_decks_router.post(
    "/{group_id}/deck",
    response_model=DeckDataResponse,
    tags=["group-decks"],
)
async def add_deck_to_group(  # noqa: ANN201
    request: AddDeckToGroupRequest,
    group_id: int,
    db: GetDb,
    user: CurrentUser,
):
    group = await GroupManager.retrieve_group_and_load_decks(db, group_id)
    await GroupManager.check_group_permission(db, user.id, group, "write")
    if request.decks is None:
        raise HTTPException(status_code=400, detail="No decks provided")
    deck_data = []
    for deck_id in request.decks:
        existing_deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
        if existing_deck is None:
            continue
        if (
            await DeckManager.check_permissions_with_user_lookup(
                db,
                existing_deck.id,
                user.id,
            )
            is False
        ):
            logger.info("user does not have permission to add deck to group")
            continue
        new_deck = await GroupManager.add_deck_to_group(db, existing_deck.id, group_id)
        await db.flush()
        new_deck = await DeckManager.retrieve_deck_and_load_cards(db, new_deck.id)
        if new_deck is None:
            logger.error("error in adding deck to group, investigate")
            continue
        new_cards = await DeckManager.copy_deck_cards(
            existing_deck,
            new_deck,
        )
        db.add_all(new_cards)  # Efficiently add all new cards to the session

        await db.commit()
        deck_data.append(DeckSchema.model_validate(new_deck.to_dict()))

    return {
        "status": "success",
        "message": "Decks added to group successfully",
        "decks": deck_data,
    }


@group_decks_router.delete(
    "/{group_id}/deck/{deck_id}",
    response_model=StandardApiResponse,
    tags=["group-decks"],
)
async def remove_deck_from_group(  # noqa: ANN201
    group_id: int,
    deck_id: int,
    db: GetDb,
    user: CurrentUser,
):
    group = await GroupManager.retrieve_group_and_load_decks(db, group_id)
    await GroupManager.check_group_permission(db, user.id, group, "write")
    await GroupManager.remove_deck_from_group(db, deck_id)
    await db.commit()
    return {"status": "success", "message": "Deck removed from group successfully"}


@group_decks_router.post(
    "/{group_id}/deck/{deck_id}/import",
    response_model=DeckDataResponse,
    tags=["group-decks"],
)
async def save_deck_from_group(  # noqa: ANN201
    group_id: int,
    deck_id: int,
    db: GetDb,
    user: CurrentUser,
):
    group = await GroupManager.retrieve_group_and_load_decks(db, group_id)
    if await GroupManager.check_group_permission(db, user.id, group, "read") is False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You do not have permission to import decks from this group",
        )
    copied_deck = await DeckManager.check_if_user_already_imported_deck(
        db,
        user.id,
        deck_id,
    )

    if isinstance(copied_deck, DeckSchema):
        deck_data = DeckSchema.model_validate(
            copied_deck.to_dict(),
        )
        return {
            "status": "success",
            "message": "Deck already exists",
            "decks": [deck_data],
        }
    existing_deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
    extra_deck_params = {"copied": True, "copy_source": deck_id, "user_id": user.id}
    new_deck = await DeckManager.copy_deck(db, existing_deck, **extra_deck_params)
    new_deck.user_id = user.id
    await db.flush()
    new_deck = await DeckManager.retrieve_deck_and_load_cards(db, new_deck.id)
    if new_deck is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error in adding deck to group",
        )
    new_cards = await DeckManager.copy_deck_cards(existing_deck, new_deck)
    db.add_all(new_cards)  # Efficiently add all new cards to the session

    await db.commit()
    deck_data = DeckSchema.model_validate(new_deck.to_dict())
    return {
        "status": "success",
        "message": "Deck imported successfully",
        "decks": [deck_data],
    }
