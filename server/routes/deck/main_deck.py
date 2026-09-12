import datetime as dt
import json
import logging
import math
import re
from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from pydantic import BaseModel
from sqlalchemy.future import select

from dependencies.db import GetDb
from dependencies.settings import AppSettings
from dependencies.user_dependencies import CurrentUser
from models.decks.deck.deck_manager import DeckManager
from models.helpers.log_decorators import log_decorator
from models.models_ import Card, Deck, cards
from routes.data_classes.deck_schema import (
    CardData,
    CardDataResponse,
    CardDataWithPaginationResponse,
    CardSchema,
    DeckDataResponse,
    DeckSchema,
    UpdateDeckRequest,
)
from routes.data_classes.response import (
    StandardApiResponse,
    ToggleResponseModel,
)

main_deck_router = APIRouter()

log = logging.getLogger("App")


## 170 ms - 179 decks
@main_deck_router.get("/all", response_model=DeckDataResponse, tags=["deck"])
async def get_all_decks(db: GetDb, user: CurrentUser):  # noqa: ANN201
    decks = await DeckManager.get_all_decks_for_user(db, user.id)
    decks = [DeckSchema.model_validate(result.to_dict()) for result in decks]

    return {
        "status": "success",
        "message": "Decks retrieved successfully",
        "decks": decks,
    }


class SearchDataRequest(BaseModel):
    search: str


@main_deck_router.post("/{deck_id}/favorite", response_model=ToggleResponseModel, tags=["deck"])
async def toggle_favorite_deck(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    deck = await DeckManager.retrieve_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck, user)
    if deck.fav:
        deck.fav = False
    else:
        deck.fav = True
    await db.commit()
    return {
        "status": "success",
        "message": "Deck favorite toggled",
        "favorite": deck.fav,
    }


# @main_deck_router.get("/{deck_id}/cards", response_model=CardDataResponse, tags=["card"])
# async def get_cards_for_deck(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
#     """Returns all cards for a deck"""
#     deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)

#     if deck is None:
#         raise HTTPException(status_code=404, detail="Deck not found")
#     DeckManager.check_permission(deck, user)
#     await DeckManager.update_card_quantity_data(deck)
#     await db.commit()
#     cards = deck.cards
#     # cards = await DeckManager.retrieve_cards(db, deck)
#     if cards is None:  ## retrieve methods may return none see docstring
#         raise HTTPException(status_code=404, detail="No cards found")
#     cards_data = []
#     for card in cards:
#         card_data = card.to_dict()
#         card_data["deck_id"] = deck_id
#         cards_data.append(card_data)
#     return {
#         "status": "success",
#         "message": "Cards retrieved succesfully",
#         "cards": cards_data,
#     }


@main_deck_router.get(
    "/{deck_id}/cards",
    response_model=CardDataWithPaginationResponse,
    tags=["card"],
)
async def get_cards_for_deck(
    deck_id: int,
    db: GetDb,
    user: CurrentUser,
    search_query: str | None = None,
    sort_value: str = "date",
    order: str = "desc",
    page: int = 1,
    items_per_page: int = 24,
) -> dict:
    deck = await DeckManager.retrieve_deck(db, deck_id)
    if deck and deck.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to get this deck",
        )
    cards, card_count = await DeckManager.search_cards(
        db,
        deck_id,
        search_query,
        sort_value,
        order,
        page,
        items_per_page,
    )
    cards_data = []
    for card in cards:
        card_data = card.to_dict()
        card_data["deck_id"] = deck_id
        cards_data.append(card_data)
    return {
        "status": "success",
        "message": "Cards retrieved successfully",
        "cards": cards_data,
        "page_number": page,
        "total_pages": math.ceil(card_count / items_per_page),
    }


@main_deck_router.delete(
    "/{deck_id}/card/{card_id}",
    response_model=StandardApiResponse,
    tags=["card"],
)
async def delete_card(deck_id: int, card_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Returns all cards for a deck"""
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    await DeckManager.delete_card(db, card_id)
    return {"status": "success", "message": "Card deleted"}


@main_deck_router.post(
    "/{deck_id}/card/{card_id}/deck/{deckToCopyToId}",
    response_model=CardDataResponse,
    tags=["card"],
)
async def copy_card_to_deck(  # noqa: ANN201
    deck_id: int,
    card_id: int,
    deckToCopyToId: int,  # noqa: N803
    db: GetDb,
    user: CurrentUser,
):
    """Copies a card to another deck"""
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    card = await DeckManager.retrieve_card(db, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    new_card = Card(
        term=card.term,
        content=card.content,
        boc_2=card.boc_2,
        boc_3=card.boc_3,
        boc_4=card.boc_4,
        category=card.category,
        formula=card.formula,
        subject=card.subject,
        topic=card.topic,
    )
    db.add(new_card)
    await db.execute(cards.insert().values(deck_id=deckToCopyToId, card_id=new_card.id))
    await db.commit()
    card_dict = new_card.to_dict()
    card_dict["deckId"] = deckToCopyToId
    card_data = CardSchema.model_validate(card_dict)
    return {"status": "success", "message": "Card copied", "cards": [card_data]}


@main_deck_router.delete("/{deck_id}", response_model=StandardApiResponse, tags=["deck"])
async def delete_deck(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Deletes a deck"""
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    await db.delete(deck)
    await db.commit()
    return {"status": "success", "message": "Deck deleted"}


@main_deck_router.put("/{deck_id}", response_model=DeckDataResponse, tags=["deck"])
async def update_deck(  # noqa: ANN201
    deck_id: int,
    data: Annotated[str, Form()],
    db: GetDb,
    settings: AppSettings,
    user: CurrentUser,
    file: Optional[UploadFile] = File(None),
):
    """Updates deck description, values are optional. Only updates when there is a value in
    the field.
    For public it takes an int, 0 for false 1 for true. Does not update cards or files.
    """
    data_dict = json.loads(data)
    deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck, user)
    await DeckManager.update_card_quantity_data(deck)
    await db.commit()
    for field, value in data_dict.items():
        if value is not None:
            setattr(deck, field, value)
    await db.flush()
    if file:
        deck = await DeckManager.upload_deck_img(deck, file, settings.aws)
        if deck is None:
            raise HTTPException(status_code=500, detail="Error uploading image")
    await db.commit()
    deck_data = deck.to_dict()
    return {"status": "success", "message": "Deck updated", "decks": [deck_data]}


@log_decorator
@main_deck_router.delete("/{deck_id}/picture", response_model=StandardApiResponse, tags=["deck"])
async def delete_deck_picture(deck_id: int, db: GetDb, user: CurrentUser, settings: AppSettings):  # noqa: ANN201, ARG001
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    deck = await DeckManager.delete_deck_img(deck)
    await db.commit()
    return {"status": "success", "message": "Deck picture deleted"}


@log_decorator
@main_deck_router.get("/{deck_id}", response_model=DeckDataResponse, tags=["deck"])
async def get_deck(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Gets a deck by deck_id"""
    query = await db.execute(select(Deck).where(Deck.id == deck_id))
    deck = query.scalar()
    if deck:
        if deck.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to get this deck",
            )
        deck_data = DeckSchema.model_validate(deck.to_dict())
        return {
            "status": "success",
            "message": "Deck retrieved",
            "decks": [deck_data],
        }
    raise HTTPException(status_code=404, detail="Deck not found")


@main_deck_router.post("/", response_model=DeckDataResponse, tags=["deck"])
async def create_deck(request: UpdateDeckRequest, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Creates an empty deck"""
    deck = Deck(user_id=user.id)
    for field, value in request.model_dump().items():
        if value:
            setattr(deck, field, value)
    deck.user_id = user.id
    deck.time_created = dt.datetime.now()
    db.add(deck)
    await db.commit()
    deck_data = DeckSchema.model_validate(deck.to_dict())
    return {"status": "success", "message": "Deck created", "decks": [deck_data]}


@main_deck_router.post("/{deck_id}/card/", response_model=CardDataResponse, tags=["card"])
async def create_new_card(db: GetDb, user: CurrentUser, deck_id: int, request: CardData):  # noqa: ANN201
    """Creates a new card in a deck"""
    deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck, user)
    new_card = Card(
        term=request.term,
        content=request.content,
        boc_2=request.boc_2,
        boc_3=request.boc_3,
        boc_4=request.boc_4,
        category=request.category,
        formula=request.formula,
        subject=request.subject,
        topic=request.topic,
    )
    db.add(new_card)
    await db.flush()

    deck.cards.append(new_card)
    await db.commit()
    card_dict = new_card.to_dict()
    card_dict["deckId"] = deck_id

    card_data = CardSchema.model_validate(card_dict)

    return {"status": "success", "message": "Card created", "cards": [card_data]}


@main_deck_router.patch("/{card_id}/favorite/", response_model=ToggleResponseModel, tags=["card"])
async def toggle_favorite_card(card_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    deck = await DeckManager.retrieve_deck_from_card_id(db, card_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck, user)
    card = await DeckManager.retrieve_card(db, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    if card.fav:
        card.fav = False
    else:
        card.fav = True
    await db.commit()
    return {
        "status": "success",
        "message": "Deck favorite toggled",
        "favorite": card.fav,
    }


@main_deck_router.put("/{deck_id}/card/{card_id}", response_model=CardDataResponse, tags=["card"])
async def edit_card(deck_id: int, card_id: int, request: CardData, db: GetDb, user: CurrentUser):  # noqa: ANN201
    if deck_id == 0:
        ## retrieve deck from card_id
        deck = await DeckManager.retrieve_deck_id_from_card_id(db, card_id)
    else:
        deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    card = await DeckManager.retrieve_card(db, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    for field, value in request.model_dump().items():
        if value:
            setattr(card, field, value)
    await db.commit()
    card_dict = card.to_dict()
    card_dict["deckId"] = deck_id
    # card_data = CardSchema.model_validate(card.to_dict())
    return {"status": "success", "message": "Card updated", "cards": [card_dict]}


def process_prompt_options_regen(card: Card) -> dict:
    if card.prompt_option is None:
        card.prompt_option = "Definitions"
    return {
        "main_opt": card.prompt_option,
        "subject_opt": card.prompt_option2,
        "trans_opt": card.trans_option,
        "lang_opt": card.trans_option,
        "detail_lvl_opt": card.len_option,
    }


## TODO this could be further optimized
@main_deck_router.patch("/data/{deck_id}", response_model=DeckDataResponse, tags=["deck"])
async def refresh_deck_data(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Updates deck data, takes a dict with key value pairs of field and value"""
    deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck, user)
    await DeckManager.update_card_quantity_data(deck)
    await DeckManager.update_qty_children(db, deck)
    await DeckManager.update_qty_files(db, deck)
    await DeckManager.update_qty_quizzes(db, deck)
    await db.commit()
    decks_data = [DeckSchema.model_validate(deck.to_dict())]
    return {"status": "success", "message": "Deck refreshed", "decks": decks_data}


def remove_media_tags(content: str) -> str:
    img_tag_pattern = r"<img[^>]+>"
    content_without_images = re.sub(img_tag_pattern, "", content)
    sound_tag_pattern = r"\[sound:[^\]]+\]"
    return re.sub(sound_tag_pattern, "", content_without_images)


def remove_html_tags(text: str) -> str:
    clean = re.compile("<.*?>")
    return re.sub(clean, "", text)


def quote_deck_name_if_needed(deck_name: str) -> str:
    if " " in deck_name:
        return f'"{deck_name}"'

    return deck_name
