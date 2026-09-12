import json
import logging
import re
import urllib.request
from typing import Any, Optional

import requests

from models.helpers.log_decorators import log_decorator
from models.models_ import Card

logger = logging.getLogger("App")
## action deckNamesAndIds --> returns deck IDs use as param for findCards
## action findCards --> returns card IDs use as param for cardsInfo
## action cardsInfo --> returns card info

potential_terms = [
    "Question",
    "Term",
    "Prompt",
    "Word",
    "Phrase",
    "Title",
    "Concept",
    "Date",
    "Name",
    "Problem",
    "Definition",
    "Statement",
    "Clue",
    "Formula",
    "Synonym/Antonym",
]

potential_images = ["img", "picture", "pic", "image", "diagram", "chart"]


def clean(text: str) -> str:
    allowed_tags = ["p", "span", "i", "b"]
    all_tags_pattern = r"</?[^>]+>"

    def replace_tag(match) -> str:  # noqa: ANN001
        tag = match.group(0)
        if any(
            f"<{allowed_tag}" in tag or f"</{allowed_tag}" in tag for allowed_tag in allowed_tags
        ):
            return ""

        return " "

    return re.sub(all_tags_pattern, replace_tag, text)


# Example usage
text_with_html = """obedient or attentive to an excessive or servile degree.
                    <div><br></div>
                    <p>This is a paragraph.</p>
                    <div><img src="quizlet-F75YvOOYykLy5EC25lVtZA.jpg"></div>
                    <span>Some <i>italic</i> and <b>bold</b> text.</span>"""
cleaned_text = clean(text_with_html)


class AnkiManager:
    @staticmethod
    def import_cards(cards: list[dict]) -> list[Card] | None:
        new_cards = []
        for card in cards:
            ## if card has a front and back field
            if "Front" in card["fields"]:
                new_card = AnkiManager.import_standard_card(card)
                new_cards.append(new_card)
            else:
                new_card = AnkiManager.import_exotic_method(card)
                new_cards.append(new_card)

        return new_cards

    @staticmethod
    def import_standard_card(card: dict) -> Card | None:
        card_fields = card.get("fields")
        if card_fields is None:
            return None
        new_card = Card()
        new_card.term = clean(card_fields.get("Front"))
        card_fields.pop("Front")
        new_card.content = clean(card_fields.get("Back"))
        card_fields.pop("Back")
        new_card.interval = card.get("Interval")
        count = 2
        if "formula" in card_fields:
            new_card.formula = card_fields["formula"]
            card_fields.pop("formula")
        for image in potential_images:
            if image in card_fields:
                new_card.img = card_fields[image]
                card_fields.pop(image)
        for key in card_fields:
            if count == 2:  # noqa: PLR2004
                new_card.boc_2 = clean(card_fields.get(key))
            if count == 3:  # noqa: PLR2004
                new_card.boc_3 = clean(card_fields.get(key))
            if count == 4:  # noqa: PLR2004
                new_card.boc_3 = clean(card_fields.get(key))
            count += 1
            if count == 4:  # noqa: PLR2004
                break
        new_card.category = "Other"

        return new_card

    @staticmethod
    def import_exotic_method(card: dict) -> Card | None:  # noqa: C901
        card_fields = card.get("fields")
        if card_fields is None:
            return None
        new_card = Card()
        ## Find something for the front of card
        if "formula" in card_fields:
            new_card.formula = card_fields["formula"]
            card_fields.pop("formula")
        for image in potential_images:
            if image in card_fields:
                new_card.img = card_fields[image]
                card_fields.pop(image)
        for term in potential_terms:
            if term in card_fields:
                new_card.term = clean(card_fields[term])
                card_fields.pop(term)
                break
        count: int = 1
        for key in card_fields:
            if count == 1:
                new_card.content = clean(card_fields.get(key))
            if count == 2:  # noqa: PLR2004
                new_card.boc_2 = clean(card_fields.get(key))
                new_card.boc_3 = clean(card_fields.get(key))
            if count == 4:  # noqa: PLR2004
                new_card.boc_3 = clean(card_fields.get(key))
            count += 1
            if count == 4:  # noqa: PLR2004
                break
        new_card.interval = card.get("Interval")
        new_card.category = "Other"
        return new_card


def request(action: str, **params: dict) -> dict[str, Any]:
    return {"action": action, "params": params, "version": 6}


def request_params(
    deck_name: str,
    term: str,
    content: str,
    interval: Optional[str] = None,
) -> dict[str, Any]:
    params = {
        "deckName": deck_name,
        "modelName": "Basic",
        "fields": {"Front": term, "Back": content},
        "options": {"allowDuplicate": False},
        "tags": [],
    }
    if interval is not None:
        params["fields"]["Interval"] = str(interval)

    return {"action": "addNote", "params": params, "version": 6}


@log_decorator
def invoke(action: str, **params: Any) -> dict[str, Any]:  # noqa: ANN401
    request_json = json.dumps(request(action, **params)).encode("utf-8")
    logger.debug("invoke requestJson: %s", request_json)
    response = request_anki(request_json)
    logger.debug("invoke response:%s", response)
    if response is None:
        msg = "Anki Connect not running"
        raise ValueError(msg)
    if len(response) != 2:  # noqa: PLR2004
        msg = "response has an unexpected number of fields"
        raise Exception(msg)  # noqa: TRY002
    if "error" not in response:
        msg = "response is missing required error field"
        raise Exception(msg)  # noqa: TRY002
    if "result" not in response:
        msg = "response is missing required result field"
        raise Exception(msg)  # noqa: TRY002
    if response["error"] is not None:
        msg = response["error"]
        raise Exception(msg)  # noqa: TRY002
    return response["result"]


@log_decorator
def anki_create_deck(deck_name: str) -> None:
    invoke("createDeck", deck=deck_name)


@log_decorator
def anki_create_card(deck_name: str, term: str, content: str) -> None:
    payload = {
        "action": "addNote",
        "params": {
            "note": {
                "deckName": deck_name,
                "modelName": "Basic",
                "fields": {"Front": term, "Back": content},
                "options": {"allowDuplicate": False},
                "tags": [],
            },
        },
        "version": 6,
    }
    logger.debug("anki_create_card payload: %s", payload)
    request_json = json.dumps(payload).encode("utf-8")

    # Send the API request and handle errors
    response = request_anki(request_json)
    logger.debug("anki_create_card response: %s", response)


@log_decorator
def check_anki_connect() -> bool:
    """Check if the Anki Connect server is running and if the required API version is available."""
    success_status = 200
    lowest_api_version = 6
    try:
        request_data = {"action": "version", "version": 6}
        request_json = json.dumps(request_data).encode("utf-8")
        request = urllib.request.Request(
            "http://localhost:8765",
            data=request_json,
            headers={"Content-Type": "application/json"},
        )
        response = urllib.request.urlopen(request, timeout=1)  # noqa: S310

        if response.status == success_status:
            response_data = response.read()
            result = json.loads(response_data.decode("utf-8"))

            if result["error"] is not None:
                msg = result["error"]
                raise ValueError(msg)  # noqa: TRY301

            api_version = result["result"]
            if api_version < lowest_api_version:
                msg = f"Anki Connect API version is too low: {api_version}"
                raise ValueError(msg)  # noqa: TRY301

            return True

        msg = f"Anki Connect server returned non-200 status: {response.status}"
        raise ValueError(msg)  # noqa: TRY301
    except Exception:
        ## TO DO implement better error handling here
        logger.exception("Failed to connect to Anki Connect")
        return False


@log_decorator
def anki_import_all() -> str:
    response = []
    decks = invoke("deckNamesAndIds")
    for key in decks.items():
        key1 = quote_deck_name_if_needed(key[0])
        card_ids = invoke("findCards", query=f"deck:{key1}")
        cards = []
        for card_id in card_ids:
            card_deets = invoke("cardsInfo", cards=[card_id])
            cards.append(card_deets)
        entry = {key[0]: cards}
        response.append(entry)
    return pretty_json(json.dumps(response))


@log_decorator
def anki_import_deck(deck_name: str) -> str:
    response = []
    name = quote_deck_name_if_needed(deck_name)
    card_ids = invoke("findCards", query=f"deck:{name}")
    cards = []
    for card_id in card_ids:
        card_deets = invoke("cardsInfo", cards=[card_id])
        cards.append(card_deets)
    entry = {deck_name: cards}
    response.append(entry)
    response = pretty_json(json.dumps(response))
    logger.debug("anki_import_deck response: %s", response)
    return response


@log_decorator
def quote_deck_name_if_needed(deck_name: str) -> str:
    return f'"{deck_name}"' if " " in deck_name else deck_name


@log_decorator
def pretty_json(json_str: str) -> str:
    parsed = json.loads(json_str)
    return json.dumps(parsed, indent=4)


@log_decorator
def find_notes2(query: str) -> bool:
    success_status = 200

    logger.debug("find_notes2: %s", query)
    # Connect to Anki Connect API
    anki_url = "http://localhost:8765"
    headers = {
        "Content-Type": "application/json",
    }
    payload = {"action": "findNotes", "version": 6, "params": {"query": query}}
    response = requests.post(anki_url, data=json.dumps(payload), headers=headers, timeout=10)

    # Parse the response
    if response.status_code == success_status:
        note_ids = json.loads(response.text)
        if note_ids["result"] != []:
            logger.debug("matches found")
            return True

        logger.debug("no matches found")
        return False

    msg = "Anki Connect error: " + response.text
    raise Exception(msg)  # noqa: TRY002


@log_decorator
def find_notes(query: str) -> bool:
    logger.debug("find_notes %s: {query}")
    payload = {"action": "findNotes", "version": 6, "params": {"query": query}}
    payload = json.dumps(payload).encode("utf-8")
    response = request_anki(payload)
    logger.debug("Find notes %s", response)
    if response is None:
        msg = "Anki Connect not running"
        raise Exception(msg)  # noqa: TRY002
    if response["result"] != []:
        logger.debug("matches found")
        return True

    logger.debug("no matches found")
    return False


@log_decorator
def request_anki(payload: bytes) -> Optional[dict[str, Any]]:
    try:
        return json.load(
            urllib.request.urlopen(
                urllib.request.Request("http://127.0.0.1:8765/", payload),
            ),
        )
    except Exception:
        ## TO DO implement better error handling here
        logger.exception("Failed to connect to Anki Connect")
        return None


@log_decorator
def request_anki_permission() -> bool:
    payload = {"action": "requestPermission", "version": 6}
    payload = json.dumps(payload).encode("utf-8")
    response = request_anki(payload)
    logger.debug("request_anki_permission %s", response)
    if response is None:
        msg = "Anki Connect not running"
        raise Exception(msg)  # noqa: TRY002
    if response["result"]["permission"] != "granted":
        logger.debug("permission not granted")
        return False
    logger.debug("permission granted")
    return True
