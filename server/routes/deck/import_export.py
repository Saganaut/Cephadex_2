import csv
import html
import json
import logging
import re
from io import StringIO

from bleach import clean
from fastapi import (
    APIRouter,
    HTTPException,
    Response,
    UploadFile,
)
from pydantic import BaseModel
from sqlalchemy.future import select

from dependencies.db import GetDb
from dependencies.user_dependencies import CurrentUser
from models.decks.anki import (
    AnkiManager,
    anki_create_card,
    anki_create_deck,
    check_anki_connect,
    find_notes,
    request_anki_permission,
)
from models.decks.deck.deck_manager import DeckManager
from models.group.group_manager import GroupManager
from models.models_ import Card, Deck
from routes.data_classes.deck_schema import CardDataResponse
from routes.data_classes.request import IdListRequest
from routes.data_classes.response import (
    StandardApiResponse,
)

import_export_router = APIRouter()

logger = logging.getLogger("App")


class AnkiImportRequest(BaseModel):
    cards: list[dict]


@import_export_router.post(
    "/{deckId}/import/anki-cards",
    response_model=CardDataResponse,
    tags=["import"],
)
async def import_anki_cards(  # noqa: ANN201
    db: GetDb,
    deck_id: int,
    request: AnkiImportRequest,
    user: CurrentUser,
):
    deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
    DeckManager.check_permission(deck, user)
    new_cards = AnkiManager.import_cards(request.cards)
    if new_cards is None:
        raise HTTPException(status_code=404, detail="no cards found")
    deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    cards = []
    for card in new_cards:
        card.topic = deck.topic
        card.subject = deck.subject
        card.create_method = "Anki"
        db.add(card)
        deck.cards.append(card)
        card = card.to_dict()  # noqa: PLW2901
        card["deckId"] = deck_id
        cards.append(card)
    await db.commit()
    return {
        "status": "success",
        "message": "Cards imported succesfully",
        "cards": cards,
    }


@import_export_router.post(
    "/{deckId}/import/other-decks",
    response_model=CardDataResponse,
    tags=["import"],
)
async def import_cards_from_other_decks(
    deck_id: int,
    request: IdListRequest,
    db: GetDb,
    user: CurrentUser,
) -> dict:
    main_deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
    if main_deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    has_permission = DeckManager.check_permission(main_deck, user)
    if has_permission is False:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this deck",
        )
    new_cards = []
    for d_id in request.ids:
        deck = await DeckManager.retrieve_deck_and_load_cards(db, d_id)
        if deck is None:
            raise HTTPException(status_code=404, detail="Deck not found")
        has_permission = DeckManager.check_permission(deck, user)
        if has_permission is False:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this deck",
            )
        # for card in deck.cards:
        #     new_cards.append(card)
        new_cards = deck.cards.copy()
    new_cards = DeckManager.create_new_cards(new_cards)

    for card in new_cards:
        db.add(card)
        main_deck.cards.append(card)
    await db.flush()

    card_data = []
    for card in new_cards:
        card = card.to_dict()  # noqa: PLW2901
        card["deckId"] = deck_id
        card_data.append(card)
    await db.commit()
    return {
        "status": "success",
        "message": "Cards imported succesfully",
        "cards": card_data,
    }


@import_export_router.get("/{deck_id}/csv", tags=["deck"])
async def get_deck_csv(deck_id: int, db: GetDb, user: CurrentUser) -> Response:
    r"""All CSV have the following columns headers = "front, back 1, back 2, back 3,
    back 4, formula, image, sound, category, subject, topic, srs interval, times asked,
    times correct\n
    """
    deck = await DeckManager.retrieve_deck(db, deck_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    if deck.public is False and DeckManager.check_permission(deck, user, False) is False:  # noqa: FBT003
        group = await GroupManager.retrieve_group_from_deck_id_and_load_members(
            db,
            deck_id,
        )
        if (await GroupManager.check_group_permission(db, user.id, group)) is False:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this deck",
            )
    cards = await DeckManager.retrieve_cards(db, deck)
    if cards is None:
        raise HTTPException(status_code=404, detail="No cards found")
    output = StringIO()
    writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)

    headers = """front, back 1, back 2, back 3, back 4, formula, image, sound,
    category, subject, topic, srs interval, times asked, times correct\n"""
    writer.writerow(headers)
    for card in cards:
        fields = [
            card.term,
            card.content,
            card.boc_2,
            card.boc_3,
            card.boc_4,
            card.formula,
            card.img,
            card.sound,
            card.category,
            card.subject,
            card.topic,
            card.srs_interval,
            card.times_asked,
            card.times_correct,
        ]
        writer.writerow(fields)
    csvstring = output.getvalue()
    output.close()
    headers = {"Content-Disposition": f'attachment; filename="{deck_id}.csv"'}
    return Response(content=csvstring, media_type="text/csv", headers=headers)


# headers = "front, back 1, back 2, back 3, back 4, formula, image, sound,
# category, subject, topic, srs interval, times asked, times correct\n"


@import_export_router.post(
    "/{deckId}/import/CSV",
    response_model=CardDataResponse,
    tags=["import"],
)
async def import_cards_from_csv(  # noqa: ANN201
    db: GetDb,
    deckId: int,  # noqa: N803
    user: CurrentUser,
    files: list[UploadFile],
):
    ##All CSV have the following columns headers = "front, back 1, back 2,
    ##back 3, back 4, formula, image, sound, category,
    # subject, topic, srs interval, times asked, times correct\n"
    deck_id = deckId
    deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)

    if deck is None:
        raise HTTPException(status_code=404, detail="Deck not found")
    permission = DeckManager.check_permission(deck, user)
    if permission is False:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this deck",
        )
    new_cards = []
    for f in files:
        if f.filename is not None and not f.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="Invalid file extension")

        if f.content_type not in ["text/csv", "application/vnd.ms-excel"]:
            raise HTTPException(status_code=400, detail="Invalid file type")
        cards = await DeckManager.import_cards_from_csv(f)
        new_cards.extend(cards)
    card_data = []
    for card in new_cards:
        card.topic = deck.topic
        card.subject = deck.subject
        card.category = "Other"
        card.create_method = "CSV"
        db.add(card)
        deck.cards.append(card)
    await db.commit()
    for card in new_cards:
        card = card.to_dict()  # noqa: PLW2901
        card["deckId"] = deck_id
        card_data.append(card)

    await db.commit()
    return {
        "status": "success",
        "message": "Cards imported succesfully",
        "cards": card_data,
    }


@import_export_router.post(
    "/anki/import",
    response_model=StandardApiResponse,
    tags=["anki"],
)
async def import_anki_deck(db: GetDb, user: CurrentUser, request: AnkiImportRequest) -> dict:
    """Import a deck from anki, looks for a deck of the same name as the anki deck, if none exists
    it creates one data is a dict with to keys, qtyCards and deck
    """
    cards_imported = 0
    try:
        deck_name = clean(request.cards[0]["deckName"])
        result = await db.execute(
            select(Deck).where(Deck.name == deck_name, Deck.user_id == user.id),
        )
        deck = result.scalars().first()
        if not deck:
            deck = Deck(name=deck_name, description="anki", user_id=user.id)
            db.add(deck)
            await db.flush()
        for card in request.cards:
            # Extract the ordered field values and filter out images and sounds
            ordered_fields = [
                html.unescape(clean(remove_media_tags(val))) for val in card["fields"].values()
            ]
            # Initialize card with defaults
            card_data = {
                "term": ordered_fields[0] if len(ordered_fields) > 0 else "",
                "content": ordered_fields[1] if len(ordered_fields) > 1 else "",
                "boc_2": ordered_fields[2] if len(ordered_fields) > 2 else "",  # noqa: PLR2004
                "boc_3": ordered_fields[3] if len(ordered_fields) > 3 else "",  # noqa: PLR2004
                "boc_4": ordered_fields[4] if len(ordered_fields) > 4 else "",  # noqa: PLR2004
                "srs_interval": card["interval"] * 1440,
                "category": "anki",
            }
            new_card = Card(**card_data)
            db.add(new_card)
            deck.cards.append(new_card)
            cards_imported += 1
        await db.commit()
        return {
            "state": "success",
            "message": "Deck imported successfully",
            "data": {"qtyCards": cards_imported, "deck": json.dumps(deck.to_dict())},
        }
    except Exception as e:
        logger.exception("Error importing anki deck")
        raise HTTPException(status_code=500, detail="Error importing anki deck") from e


def remove_media_tags(content: str) -> str:
    img_tag_pattern = r"<img[^>]+>"
    content_without_images = re.sub(img_tag_pattern, "", content)
    sound_tag_pattern = r"\[sound:[^\]]+\]"
    return re.sub(sound_tag_pattern, "", content_without_images)


@import_export_router.post(
    "/{deck_id}/anki/export",
    response_model=StandardApiResponse,
    tags=["anki"],
)
async def export_deck_to_anki(deck_id: int, db: GetDb, user: CurrentUser) -> dict:
    """Export a deck to anki, user must be on a desktop,
    have anki installed with teh anki connect add on
    """
    result = await db.execute(select(Deck).where(Deck.id == deck_id))
    deck = result.scalars().first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    if deck.user_id != user.id:
        return {
            "status": "failure",
            "message": "You do not have permission to access this deck",
        }
    try:
        request_anki_permission()
    except Exception:
        logger.exception("User failed to give anki permission")
        return {"status": "failure", "message": "Error getting anki permission"}
    if check_anki_connect() is False:
        raise HTTPException(
            status_code=400,
            detail="Anki Connect not found, please install the Anki Connect add on",
        )

    cards = await DeckManager.retrieve_cards(db, deck)
    if cards is None:
        raise HTTPException(status_code=404, detail="No cards found")
    try:
        anki_create_deck(deck.name)
        for card in cards:
            query = card.term
            notes = find_notes(query)
            if notes is False:
                ## TODO add in SRS interval
                srs_interval = str(int(card.srs_interval) / 1440)  # noqa: F841
                anki_create_card(deck.name, card.term, card.content)
        return {"status": "success", "message": "Deck exported to anki"}
    except Exception:
        logger.exception("Error exporting deck to anki")
        return {"status": "failure", "message": "Error exporting deck to anki"}
