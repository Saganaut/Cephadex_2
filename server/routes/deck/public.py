import hashlib
import logging

from fastapi import (
    APIRouter,
    HTTPException,
)
from fastapi.responses import JSONResponse
from sqlalchemy.future import select

from dependencies.db import GetDb
from dependencies.user_dependencies import CurrentUser, CurrentUserOrGuest
from models.decks.deck.deck_manager import DeckManager
from models.models_ import Deck
from routes.data_classes.deck_schema import (
    DeckDataResponse,
    PublicCardDataResponse,
    PublicCardSchema,
    PublicDeckDataResponse,
    PublicDeckSchema,
)

logger = logging.getLogger("App")
public_router = APIRouter()


@public_router.get(
    "/public-decks/search/",
    response_model=PublicDeckDataResponse,
    tags=["public-deck"],
)
async def search_public_decks(  # noqa: ANN201
    db: GetDb,
    user: CurrentUser,
    search_query: str,
    sort_value: str = "name",
    order: str = "desc",
    page: int = 1,
    items_per_page: int = 12,
):
    ## return decks with search term in name
    deck_list, total_pages = await DeckManager.search_public_decks(
        db,
        user.id,
        search_query,
        sort_value,
        order,
        page,
        items_per_page,
    )
    etag_value = f"public-decks-{search_query}-{sort_value}-{order}-{page}-{items_per_page}"
    deck_data = []

    etag_hash = hashlib.sha256(etag_value.encode()).hexdigest()
    for deck in deck_list:
        public_deck = PublicDeckSchema(**deck)
        public_deck_data = public_deck.model_dump(by_alias=True)
        deck_data.append(public_deck_data)
    response = {
        "status": "success",
        "message": "public decks retrieved",
        "decks": deck_data,
        "totalPages": total_pages,
    }
    headers = {
        "Cache-Control": "public, max-age=300",
        "ETag": etag_hash,
    }
    return JSONResponse(content=response, headers=headers)


@public_router.get("/card-viewer/{deck_id}", tags=["card-viewer"])
async def search_public_cards(  # noqa: ANN201
    user: CurrentUserOrGuest,  # noqa: ARG001
    deck_id: int,
    db: GetDb,
    search_query: str,
    deck_type: str = "public",
    sort_value: str = "name",
    order: str = "desc",
    page: int = 1,
    items_per_page: int = 12,
):
    if deck_type == "public":
        deck = await DeckManager.retrieve_public_deck(db, deck_id)
    else:
        deck = await DeckManager.retrieve_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    cards = await DeckManager.search_public_cards(
        db,
        deck_id,
        search_query,
        sort_value,
        order,
        page,
        items_per_page,
    )
    cards_data = []
    for card in cards[0]:
        card_public = PublicCardSchema(**card)
        cards_data.append(card_public.model_dump(by_alias=True))
    etag_value = f"""public-cards-{deck_id}-{search_query}
    -{sort_value}-{order}-{page}-{items_per_page}"""
    etag_hash = hashlib.sha256(etag_value.encode()).hexdigest()
    response = {
        "status": "success",
        "message": "retrieved cards for public deck",
        "cards": cards_data,
    }
    headers = {
        "Cache-Control": "public, max-age=3600",
        "ETag": etag_hash,
    }
    return JSONResponse(content=response, headers=headers)


@public_router.post("/{deck_id}/like", tags=["public-deck"])
async def toggle_like_deck(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    deck = await DeckManager.retrieve_public_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    liked = await DeckManager.toggle_like_public_deck(db, deck.id, user.id)

    await db.commit()

    return {
        "status": "success",
        "message": "Deck like succesfully toggled",
        "liked": liked,
    }


@public_router.get(
    "/public/{deck_id}/cards",
    response_model=PublicCardDataResponse,
    tags=["public-deck"],
)
async def get_cards_for_public_deck(deck_id: int, db: GetDb):  # noqa: ANN201
    result = await db.execute(select(Deck).where(Deck.id == deck_id))
    deck = result.scalars().first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    if deck.public is False:
        return {"status": "failure", "message": "Deck is not public"}
    cards = await DeckManager.load_cards(db, deck)

    cards_data = []
    for card in cards:
        card_data = card.to_dict_public()
        card_data["deckId"] = deck_id
        cards_data.append(card_data)
    etag_value = f"public-deck-{deck_id}"
    etag_hash = hashlib.sha256(etag_value.encode()).hexdigest()
    response = {
        "status": "success",
        "message": "retrieved cards for public deck",
        "cards": cards_data,
    }
    headers = {
        "Cache-Control": "public, max-age=3600",
        "ETag": etag_hash,
    }
    return JSONResponse(content=response, headers=headers)


@public_router.post("/public/{deck_id}", response_model=DeckDataResponse, tags=["public-deck"])
async def copy_public_deck(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    copied_deck = await DeckManager.check_if_user_already_imported_deck(db, user.id, deck_id)
    if copied_deck and isinstance(copied_deck, Deck):
        return {
            "status": "success",
            "message": "Deck already exists",
            "decks": [copied_deck.to_dict()],
        }

    deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)

    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    if not deck.public:
        raise HTTPException(status_code=404, detail="Deck is not public")

    new_deck = Deck(
        user_id=user.id,
        name=deck.name,
        description=deck.description,
        shared=True,
        sharer=deck.user_id,
        copied=True,
        copy_source=deck.id,
        qty_cards=deck.qty_cards,
        tags=deck.tags,
        img=deck.img,
        subject=deck.subject,
    )
    db.add(new_deck)
    await db.flush()
    new_deck = await DeckManager.retrieve_deck_and_load_cards(db, new_deck.id)
    if new_deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    # Directly pass the db session to the method
    new_cards = await DeckManager.copy_deck_cards(deck, new_deck)
    db.add_all(new_cards)  # Efficiently add all new cards to the session

    await db.commit()

    return {
        "status": "success",
        "message": "Deck copied",
        "decks": [new_deck.to_dict()],
    }
