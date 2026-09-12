import logging
import os

from fastapi import (
    APIRouter,
    HTTPException,
)
from openai import APIConnectionError
from pydantic import BaseModel
from sqlalchemy.future import select

from dependencies.db import GetDb
from dependencies.settings import AppSettings
from dependencies.user_dependencies import CurrentUser
from models.creators.creator import AiCaller
from models.decks.card.card_factory import CardFactory
from models.decks.deck.deck_manager import DeckManager
from models.models_ import Card, Deck
from models.user.user_manager import UserManager
from routes.data_classes.deck_schema import (
    CardData,
    CardDataResponse,
    CardSchema,
)

ai_generation_router = APIRouter()

logger = logging.getLogger("App")


@ai_generation_router.post("/generate-images/{deck_id}", tags=["deck"])
async def generate_images_for_deck(  # noqa: ANN201, C901
    deck_id: int,
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
):
    """Generates images for all cards in a deck"""
    await UserManager.check_user_subscription(user, 3)
    remaining_pic_count = await UserManager.check_image_permission(db, user)
    if remaining_pic_count == 0:
        raise HTTPException(status_code=403, detail="No image credits remaining")
    deck: Deck = await DeckManager.retrieve_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck, user)
    cards = await DeckManager.retrieve_cards(db, deck)
    if cards is None:  ## retrieve methods may return none see docstring
        raise HTTPException(status_code=404, detail="No cards found")

    if not os.path.exists("temp\\card_img"):  # noqa: PTH110
        os.makedirs("temp\\card_img")  # noqa: PTH103
    open_ai_caller = AiCaller(settings.ai, settings.aws)

    generated_pic_count = 0
    for card in cards:
        if generated_pic_count >= remaining_pic_count:
            await db.commit()
            return {
                "status": "success",
                "message": "Images generated - out of credit for this month",
                "generated": generated_pic_count,
                "remaining": remaining_pic_count,
            }
        if card.img is None:
            try:
                url = await open_ai_caller.create_image(
                    card.term,
                    settings.ai.images_model,
                )
                if url is None:
                    continue
                await open_ai_caller.save_image(url, card, user.id, deck.id)
            except APIConnectionError:
                logger.exception(
                    "API connection error generating image for card",
                )
            except Exception:
                logger.exception("Unexpected error generating image for card")
            generated_pic_count += 1
    await UserManager.update_remaining_pic_count(db, user, remaining_pic_count)
    await db.commit()
    return {
        "status": "success",
        "message": "Images generated - you have reached the end of your quota for this month",
        "generated": generated_pic_count,
        "remaining": remaining_pic_count,
    }


class AutoGenerateRequest(BaseModel):
    cardData: list[CardData]


def process_prompt_options_new_auto_generate(card: CardData | CardSchema) -> dict:
    return {
        "term": card.term,
        "category": card.category,
        "subject": card.subject,
        "language": card.language,
        "custom_back": card.custom_back,
    }


@ai_generation_router.post(
    "/{deck_id}/generate-new-cards",
    response_model=CardDataResponse,
    tags=["card"],
)
async def auto_generate_cards(  # noqa: ANN201
    deck_id: int,
    request: AutoGenerateRequest,
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
):
    deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck, user)
    ai_caller = AiCaller(settings.ai, settings.aws)
    cards = []
    for card_data in request.cardData:
        processed_data = process_prompt_options_new_auto_generate(card_data)
        content = await ai_caller.create_new_card(processed_data)
        new_card_data = CardFactory.process_new_card_data(card_data, content)
        new_card_data = new_card_data.dict()
        new_card = Card(**new_card_data)
        db.add(new_card)
        await db.flush()
        deck.cards.append(new_card)
        new_card_data = new_card.to_dict()
        new_card_data["deckId"] = deck_id
        cards.append(new_card_data)
    await db.commit()
    return {"status": "success", "message": "Cards generated", "cards": cards}


@ai_generation_router.post(
    "/{deck_id}/card/{card_id}/regenerate",
    response_model=CardDataResponse,
    tags=["card"],
)
async def regenerate_card(  # noqa: ANN201
    deck_id: int,
    card_id: int,
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
):
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)

    result = await db.execute(select(Card).where(Card.id == card_id))
    card = result.scalars().first()

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    card_data = CardSchema(**card.to_dict())
    processed_data = process_prompt_options_new_auto_generate(card_data)
    ai_caller = AiCaller(settings.ai, settings.aws)
    try:
        content = await ai_caller.create_new_card(processed_data)
        new_card_data = CardFactory.process_new_card_data(card_data, content)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error regenerating card") from e
    card.content = new_card_data.content
    card.boc_2 = new_card_data.boc_2
    card.boc_3 = new_card_data.boc_3
    card.boc_4 = new_card_data.boc_4
    card.formula = new_card_data.formula
    await db.commit()
    card_data = card.to_dict()
    card_data["deckId"] = deck_id
    return {"status": "success", "message": "Card regenerated", "cards": [card_data]}
