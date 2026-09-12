import logging

from fastapi import (
    APIRouter,
    HTTPException,
)

from dependencies.db import GetDb
from dependencies.redis import GetRedisClient
from dependencies.settings import AppSettings
from dependencies.user_dependencies import CurrentUser, CurrentUserOrGuest
from models.decks.deck.deck_manager import DeckManager
from models.models_ import Deck
from routes.data_classes.deck_schema import (
    DeckDataResponse,
    GetSharedDeckDataResponse,
    SharedDeckDataResponse,
)
from routes.data_classes.request import EmailListRequest
from routes.data_classes.response import (
    LinkAndQrCodeResponse,
    StandardApiResponse,
)

logger = logging.getLogger("App")
shared_router = APIRouter()


@shared_router.get("/shared", response_model=SharedDeckDataResponse, tags=["deck"])
async def get_shared_decks(db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Returns a list of all decks shared with user"""
    decks = await DeckManager.get_shared_decks_for_user(db, user)
    if decks:
        decks = [result.to_dict() for result in decks]
    else:
        decks = []
    return {
        "status": "success",
        "message": "shared decks retrieved",
        "decks": decks,
    }


@shared_router.get(
    "/shared/{deck_sharing_id}",
    response_model=GetSharedDeckDataResponse,
    tags=["deck"],
)
async def get_shared_deck(deck_sharing_id: str, db: GetDb, user: CurrentUserOrGuest):  # noqa: ANN201
    deck_sharing_entry = await DeckManager.get_shared_deck_entry(db, deck_sharing_id)
    if not deck_sharing_entry:
        raise HTTPException(status_code=404, detail="This link is no longer valid")
    if deck_sharing_entry.type.value == "user":
        if user == "guest":
            raise HTTPException(
                status_code=403,
                detail="You need to be logged in to view this deck",
            )
        if deck_sharing_entry.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to view this deck",
            )
    shared_deck = await DeckManager.retrieve_deck_and_load_cards(
        db,
        deck_sharing_entry.deck_id,
    )
    if shared_deck is None:
        return HTTPException(status_code=404, detail="Deck is no longer available")
    cards = await DeckManager.retrieve_cards(db, shared_deck)
    list_cards = []
    if cards is not None:
        for card in cards:
            card_dict = card.to_dict_public()
            card_dict["deckId"] = shared_deck.id
            list_cards.append(card_dict)
    deck_data = shared_deck.to_dict_public()
    deck_data["share_id"] = deck_sharing_id
    return {
        "status": "success",
        "message": "Shared deck retrieved",
        "decks": [deck_data],
        "cards": list_cards,
    }


@shared_router.post(
    "/shared/{deck_id}/share",
    response_model=StandardApiResponse,
    tags=["deck"],
)
async def share_deck(  # noqa: ANN201
    request: EmailListRequest,
    deck_id: int,
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
    r_client: GetRedisClient,
):
    """Shares one or more decks to others.  If the email is associated with a user it
    copies the deck and makes a shared deck entry for that user.  It also sends an email to both
    users and non users with a link
    to the shared deck
    """
    if request.emails is None or len(request.emails) == 0:
        raise HTTPException(status_code=400, detail="No emails provided")
    deck_to_copy = await DeckManager.retrieve_deck(db, deck_id)
    if deck_to_copy is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck_to_copy, user)

    await DeckManager.share_deck_to_users_or_guests(
        r_client,
        db,
        request.emails,
        deck_to_copy,
        user,
        settings,
    )
    await db.commit()
    return {
        "status": "success",
        "message": "Deck shared",
    }


@shared_router.get(
    "/{deck_id}/link",
    response_model=LinkAndQrCodeResponse,
    tags=["deck"],
)
async def get_share_link_for_deck(  # noqa: ANN201
    deck_id: int,
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
):
    """Returns a link and a QR code for a deck - accessible by anyone"""
    deck = await DeckManager.retrieve_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck, user)
    link, img_str = await DeckManager.shared_deck_general(db, deck, settings)
    await db.commit()
    return {
        "status": "success",
        "message": "Link created",
        "shareLink": link,
        "qrCode": img_str,
    }


@shared_router.delete(
    "/shared/{deck_sharing_id}",
    response_model=StandardApiResponse,
    tags=["deck"],
)
async def delete_shared_deck(deck_sharing_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Deletes a deck sharing entry, not the actual deck"""
    await DeckManager.shared_deck_delete(db, deck_sharing_id, user.id)
    return {"status": "success", "message": "Shared deck deleted"}


## TODO ensure copy_deck_cards works with sharedDecks
@shared_router.post(
    "/shared/{deck_sharing_id}",
    response_model=DeckDataResponse,
    tags=["deck"],
)
async def copy_shared_deck(deck_sharing_id: str, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Approves a shared deck, adding it to the users regular decks"""
    deck_sharing_entry = await DeckManager.get_shared_deck_entry(db, deck_sharing_id)
    if not deck_sharing_entry:
        raise HTTPException(status_code=404, detail="Shared deck not found")
    if deck_sharing_entry.type.value == "user" and deck_sharing_entry.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to copy this deck",
        )

    shared_deck = await DeckManager.retrieve_deck_and_load_cards(
        db,
        deck_sharing_entry.deck_id,
    )
    if shared_deck is None:
        return HTTPException(status_code=404, detail="Cannot copy deck, deck not found")
    new_deck = Deck(
        user_id=user.id,
        name=shared_deck.name,
        description=shared_deck.description,
        shared=True,
        topic=shared_deck.topic,
        subject=shared_deck.subject,
        img=shared_deck.img,
        qty_cards=shared_deck.qty_cards,
    )
    db.add(new_deck)
    await db.flush()
    ## loading the deck again so it includes card relationships
    ## otherwise will throw error in copy_deck_cards
    new_deck = await DeckManager.retrieve_deck_and_load_cards(db, new_deck.id)
    new_cards = await DeckManager.copy_deck_cards(shared_deck, new_deck)
    db.add_all(new_cards)  # Efficiently add all new cards to the session
    if new_deck is None:
        raise HTTPException(status_code=501, detail="Unable to create new deck")
    new_deck.user_id = user.id
    if deck_sharing_entry.type == "user":
        await db.delete(deck_sharing_entry)
    await db.commit()
    deck_data = new_deck.to_dict()

    return {
        "status": "success",
        "message": "Deck copied succesfully",
        "decks": [deck_data],
    }
