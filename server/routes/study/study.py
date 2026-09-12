import logging

from fastapi import APIRouter, HTTPException

from config import StudySettings
from dependencies.db import GetDb
from dependencies.posthog import GetPostHog
from dependencies.user_dependencies import CurrentUserAndSettings
from models.decks.deck.deck_manager import DeckManager
from models.models_ import Deck
from models.study.StudyManager import StudyManager
from routes.data_classes.study_schema import GetCardsDueRequest, GetCardsDueResponse

logger = logging.getLogger("App")

router = APIRouter(
    prefix="/study",
    tags=["study"],
)


@router.post("/{deck_id}/cards-due", response_model=GetCardsDueResponse, tags=["study"])
async def get_cards_due(  # noqa: ANN201
    deck_id: int,
    db: GetDb,
    posthog: GetPostHog,
    user_and_settings: CurrentUserAndSettings,
    cards_due_request: GetCardsDueRequest,
):
    """Take an optional param with number of cards due to load, defaults to 20"""
    user = user_and_settings[0]
    user_settings = user_and_settings[1]
    deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
    if Deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")

    DeckManager.check_permission(deck, user)
    cards_due = None
    cards_answered = cards_due_request.cards
    settings_dict = user_settings.to_dict()
    study_settings = StudySettings(**settings_dict)
    if deck is not None:
        if cards_answered is not None:
            StudyManager.update_studied_cards(
                cards_answered,
                deck.cards,
                study_settings,
            )
            await db.flush()
        cards_due = StudyManager.get_due_cards(deck.cards, study_settings)
        await db.commit()
    if cards_due is None:
        return {"status": "success", "message": "No cards due", "cards": []}
    cards_due_data = []
    batch_number = cards_due_request.batch_number

    if batch_number is None:
        batch_number = 0
    else:
        batch_number = batch_number + 1
    cards_due_data = StudyManager.prepare_cards_for_study(
        cards_due,
        deck_id,
        batch_number,
    )
    posthog.capture(
        user.id,
        "study",
        {
            "deck_id": deck_id,
            "cards_due": len(cards_due_data),
            "batch_number": batch_number,
        },
    )
    return {
        "status": "success",
        "message": "Cards due retrieved",
        "cards": cards_due_data,
    }
