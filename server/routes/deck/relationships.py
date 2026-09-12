import logging

from fastapi import (
    APIRouter,
    HTTPException,
)
from pydantic import BaseModel
from sqlalchemy import delete
from sqlalchemy.future import select

from dependencies.db import GetDb
from dependencies.user_dependencies import CurrentUser
from models.decks.deck.deck_manager import DeckManager
from models.models_ import Card, deck_relationships
from routes.data_classes.response import (
    StandardApiResponse,
)

relationships_router = APIRouter()

logger = logging.getLogger("App")


class DeckIdRequest(BaseModel):
    status: str
    message: str
    deckIds: list[int]


@relationships_router.get(
    "/{deck_id}/children",
    response_model=DeckIdRequest,
    tags=["deck"],
)
async def get_children(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Gets all children of a deck"""
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    deck_children = await DeckManager.load_children(db, deck)
    if not deck_children:
        return {
            "status": "success",
            "message": "This deck has no children, make some!",
            "deckIds": [],
        }

    child_ids = [child.id for child in deck_children]
    return {
        "status": "success",
        "message": "Children retrieved succesfully",
        "deckIds": child_ids,
    }


@relationships_router.get(
    "/{deck_id}/parents",
    response_model=DeckIdRequest,
    tags=["deck"],
)
async def get_parents(deck_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Gets all parents of a deck"""
    deck = await DeckManager.retrieve_deck(db, deck_id)

    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    DeckManager.check_permission(deck, user)
    parents = await DeckManager.load_parents(db, deck)
    if not parents:
        return {
            "status": "success",
            "message": "Oops! looks like this deck is an orphan",
            "deckIds": [],
        }

    parent_ids = [parent.id for parent in parents]

    return {
        "status": "success",
        "message": "Parents retrieved succesfully",
        "deckIds": parent_ids,
    }


## TODO issue with card deletion - somewhere instead of copying each card when copying a
# deck an existing card is appended
@relationships_router.delete(
    "/{deck_id}/card/{card_id}",
    response_model=StandardApiResponse,
    tags=["card"],
)
async def delete_card(deck_id: int, card_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    deck = await DeckManager.retrieve_deck(db, deck_id)
    DeckManager.check_permission(deck, user)
    result = await db.execute(select(Card).where(Card.id == card_id))
    card = result.scalars().first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    await db.delete(card)
    await db.flush()
    await db.commit()

    return {"status": "success", "message": "Card deleted"}


@relationships_router.post(
    "/parent/{parent_deck_id}/child/{child_deck_id}",
    response_model=StandardApiResponse,
    tags=["deck"],
)
async def set_parent_child_relationship(  # noqa: ANN201
    parent_deck_id: int,
    child_deck_id: int,
    db: GetDb,
    user: CurrentUser,
):
    """Sets a parent child relationship between two decks"""
    parent_deck = await DeckManager.retrieve_deck(db, parent_deck_id)
    DeckManager.check_permission(parent_deck, user)
    child_deck = await DeckManager.retrieve_deck(db, child_deck_id)
    DeckManager.check_permission(child_deck, user)
    ## check if relationship is already there
    query = await db.execute(
        deck_relationships.select()
        .where(deck_relationships.c.parent_deck == parent_deck_id)
        .where(deck_relationships.c.child_deck == child_deck_id),
    )
    row = query.scalars().first()
    if row is not None:
        raise HTTPException(status_code=400, detail="Relationship already exists")
    query = await db.execute(
        deck_relationships.insert().values(
            parent_deck=parent_deck_id,
            child_deck=child_deck_id,
        ),
    )
    await db.commit()
    return {"status": "success", "message": "Relationship set"}


@relationships_router.delete(
    "/parent/{parent_deck_id}/child/{child_deck_id}",
    response_model=StandardApiResponse,
    tags=["deck"],
)
async def delete_parent_child_relationship(  # noqa: ANN201
    parent_deck_id: int,
    child_deck_id: int,
    db: GetDb,
    user: CurrentUser,
):
    """Deletes a parent child relationship between two decks"""
    parent_deck = await DeckManager.retrieve_deck(db, parent_deck_id)
    DeckManager.check_permission(parent_deck, user)
    child_deck = await DeckManager.retrieve_deck(db, child_deck_id)
    DeckManager.check_permission(child_deck, user)
    ## check if relationship is already there
    query = await db.execute(
        deck_relationships.select()
        .where(deck_relationships.c.parent_deck == parent_deck_id)
        .where(deck_relationships.c.child_deck == child_deck_id),
    )
    row = query.scalars().first()
    if row is None:
        raise HTTPException(status_code=400, detail="No relationship between decks")
    delete_query = delete(deck_relationships).where(
        deck_relationships.c.parent_deck == parent_deck_id,
        deck_relationships.c.child_deck == child_deck_id,
    )
    await db.execute(delete_query)
    await db.commit()
    return {"status": "success", "message": "Relationship deleted"}
