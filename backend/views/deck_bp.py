import uuid
import datetime as dt
import re
import html
from flask import (
    Blueprint,
    Response,
    send_file,
    jsonify,
    request,
    session,
)
from sqlalchemy.sql import insert
from bleach import clean

from models.models_ import (
    Card,
    Deck,
    DeckFiles,
    SharedDecks,
    User,
    deck_relationships,
    DeckAttributes,
    Game,
    source_files,
)

####from cardcreator import create_image, creator
from models.creators.formatters import create_pdf
from models.creators.creator import AiCaller
from models.anki import (
    request_anki_permission,
    anki_create_deck,
    anki_create_card,
    find_notes,
    check_anki_connect,
)
from models.tracking.events import event_tracker
from models.send_email import send_email
from models.qr_code import create_qr_code
import logging
from config.settings import APP_URL
from run.extensions import db

from models.helpers.log_decorators import log_decorator
from flask_login import login_user, logout_user, current_user

logger = logging.getLogger("flask_app")

deck_bp = Blueprint(
    "deck_bp", __name__, template_folder="templates/deck_bp", static_folder="static"
)

################################## Decks ############################################

## GET DECKS
## GET DECK
## DELETE DECK
## EDIT DECK
## NEW DECK
## DOWNLOAD DECK AS CSV
## CREATE PARENT CHILD RELATIONSHIPS
## CREATE LINK (AND QR CODE)


@deck_bp.route("/api_0/decks", methods=["GET"])
#
# @log_decorator
def get_decks():
    query = Deck.query.filter(Deck.user_id == current_user.id)
    decks = []
    for deck in query:
        decks.append(deck.to_dict())
    return jsonify({"status": "success", "decks": decks}), 200


## update deck.favs to true


@deck_bp.route("/api_0/deck/<int:id>/favourite", methods=["POST"])
def favourite_deck(id):
    deck = Deck.query.filter_by(deck_id=id).first()
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    deck.fav = True
    db.session.commit()
    return jsonify({"status": "success", "message": "Deck favourited"}), 200


## remove deck from favs
@deck_bp.route("/api_0/deck/<int:id>/favourite", methods=["DELETE"])
def unfavourite_deck(id):
    deck = Deck.query.filter_by(deck_id=id).first()
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    deck.fav = False
    db.session.commit()
    return jsonify({"status": "success", "message": "Deck unfavourited"}), 200


#
@deck_bp.route("/api_0/deck/<int:id>", methods=["DELETE"])
# @log_decorator
def delete_deck(id):
    try:
        deck_to_delete = Deck.query.get_or_404(id)
        deck_attributes = DeckAttributes.query.filter_by(deck_id=id).all()
        games_to_delete = Game.query.filter_by(deck_id=id).all()
        if current_user.id != deck_to_delete.user_id:
            return jsonify({"error": "Deck not assigned to user"}), 403
        for attribute in deck_attributes:
            db.session.delete(attribute)
        for game in games_to_delete:
            db.session.delete(game)
        db.session.delete(deck_to_delete)
        db.session.commit()
        return (
            jsonify({"status": "success", "message": "Deck deleted successfully"}),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured when attempting to delete a deck {e}")
        return jsonify({"error": "An error occurred during deletion"}), 500


#
@deck_bp.route("/api_0/deck/<int:id>", methods=["GET"])
# @log_decorator
def get_deck(id):
    deck = Deck.query.filter_by(deck_id=id).first()
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    return jsonify({"status": "success", "deck": deck.to_dict()}), 200


#
@deck_bp.route("/api_0/deck/<int:id>", methods=["PATCH"])
# @log_decorator
def edit_deck(id):
    try:
        deck = Deck.query.filter_by(deck_id=id).first()
        if current_user.id != deck.user_id:
            return jsonify({"error": "Deck not assigned to user"}), 403
        data = request.get_json(silent=True)
        deck.name = data.get("name")
        deck.description = data.get("description")
        deck.subject = data.get("subject")
        deck.topic = data.get("topic")
        deck.category = data.get("category")
        deck.public = data.get("public")
        db.session.commit()
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Deck updated succesfully",
                    "deck": deck.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured when attempting to update a deck {e}")
        return jsonify({"error": "An error occurred while updating the deck"}), 500


#
@deck_bp.route("/api_0/deck", methods=["POST"])
# @log_decorator
def create_new_deck():
    try:
        data = request.get_json(silent=True)
        deck = Deck(
            name=data.get("name"),
            description=data.get("description"),
            subject=data.get("subject"),
            topic=data.get("topic"),
            category=data.get("category"),
            public=data.get("public"),
            user_id=current_user.id,
        )
        db.session.add(deck)
        db.session.commit()
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Deck created succesfully",
                    "deck": deck.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured when attempting to create a deck {e}")
        return jsonify({"error": "An error occurred while creating the deck"}), 500


@deck_bp.route("/deck/<int:deck_id>/csv", methods=["GET"])
# @log_decorator
def downloadascsv(deck_id):
    event_tracker(current_user.id, "downloadascsv")
    deck = Deck.query.filter_by(id=deck_id).first()
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    termsstrings = []
    for card in deck.cards:
        if card.boc_2 is None:
            card.boc_2 = "null"
        if card.boc_3 is None:
            card.boc_3 = "null"
        if card.boc_4 is None:
            card.boc_4 = "null"
        ## replace commas with semicolons
        fields = [
            card.term,
            card.content,
            card.boc_2,
            card.boc_3,
            card.boc_4,
            card.category,
        ]
        string = ",".join(field.replace(",", ";") for field in fields) + "\n"
        termsstrings.append(string)
    csvstring = "".join(termsstrings)
    return Response(csvstring, mimetype="text/csv")


#
@deck_bp.route(
    "/api_0/deck/<int:parent_deck_id>/child/<int:child_deck_id>/", methods=["POST"]
)
def set_parent_child_relationship(parent_deck_id, child_deck_id):
    try:
        create_parent_child_relationship(parent_deck_id, child_deck_id)
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Relationship created",
                    "info": {
                        "parent_deck_id": parent_deck_id,
                        "child_deck_id": child_deck_id,
                    },
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured when attempting to create a relationship {e}")
        return (
            jsonify({"error": "An error occurred while creating the relationship"}),
            500,
        )


def create_parent_child_relationship(parent_deck_id, child_deck_id):
    new_relationship = insert(deck_relationships).values(
        parent_deck=parent_deck_id, child_deck=child_deck_id
    )
    session.execute(new_relationship)
    session.commit()


## TO DO MODIFY THE LINK WHEN ROUTE HAS BEEN DECIDED
@deck_bp.route("/api_0/deck/<int:deck_id>/link", methods=["GET"])
# @log_decorator
def generate_link(deck_id):
    deck = Deck.query.get(deck_id)
    if deck.share_id:
        link = f"{APP_URL}/deck_bp/shared_deck_view/{deck.share_id}"
        img_str = create_qr_code(link)
        return (
            jsonify(
                {
                    "share_link": f"{APP_URL}/deck_bp/shared_deck_view/{deck.share_id}",
                    "qr_code": img_str,
                }
            ),
            200,
        )
    else:
        share_id = str(uuid.uuid4())
        deck.share_id = share_id
        db.session.commit()
        link = f"{APP_URL}/deck_bp/shared_deck_view/{share_id}"
        img_str = create_qr_code(link)
        return (
            jsonify(
                {
                    "status": "success",
                    "share_link": f"{APP_URL}/deck_bp/shared_deck_view/{share_id}",
                    "qr_code": img_str,
                }
            ),
            200,
        )


####################### SHARED DECK #######################
## GET SHARED DECK
## DELETE SHARED DECK (only receiver can delete)
## APPROVE SHARED DECK
## SHARE DECK


@deck_bp.route("/api_0/shared_decks", methods=["GET"])
#
# @log_decorator
def get_shared_decks():
    query = SharedDecks.query.filter(SharedDecks.receiver == current_user.id).all()
    shared_decks = []
    for deck in query:
        shared_decks.append(deck.to_dict())
    return jsonify({"status": "success", "shared_decks": shared_decks}), 200


@deck_bp.route("/api_0/shared_deck/<int:id>", methods=["DELETE"])
#
# @log_decorator
def delete_shared_deck(id):
    try:
        deck_to_delete = SharedDecks.query.get_or_404(id)
        if current_user.id != deck_to_delete.receiver:
            return jsonify({"error": "Deck not assigned to user"}), 403
        db.session.delete(deck_to_delete)
        db.session.commit()
        return (
            jsonify({"status": "success", "message": "Deck deleted successfully"}),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured when attempting to delete a deck {e}")
        return jsonify({"error": "An error occurred during deletion"}), 500


@deck_bp.route("/api_0/shared_deck/approve/<int:deck_id>/", methods=["POST"])
# @log_decorator
#
def appprove_shared(deck_id):
    event_tracker(current_user.id, "appprove_shared", deck_id)
    shared_deck = SharedDecks.query.get_or_404(deck_id)
    new_deck = Deck(
        user_id=current_user.id,
        name=shared_deck.name,
        description=shared_deck.description,
        shared=True,
        sharer=shared_deck.sender,
        time_created=dt.datetime.now(dt.timezone.utc),
    )
    db.session.add(new_deck)
    for card in shared_deck.cards:
        new_card = Card(
            term=card.term,
            content=card.content,
            boc_2=card.boc_2,
            boc_3=card.boc_3,
            boc_4=card.boc_4,
            img=card.img,
            sound=card.sound,
            subject=card.subject,
            topic=card.topic,
            category=card.category,
            prompt_option=card.prompt_option,
            prompt_option2=card.prompt_option2,
            trans_option=card.trans_option,
            len_option=card.len_option,
            qmin_option=card.qmin_option,
            qmax_option=card.qmax_option,
            diff_lvl=card.diff_lvl,
        )
        new_deck.cards.append(new_card)
    shared_deck.delete()
    db.session.commit()
    return (
        jsonify(
            {
                "status": "success",
                "message": "Deck approved successfully",
                "deck": new_deck.to_dict(),
            }
        ),
        200,
    )


@deck_bp.route("/api_0/share_deck/<int:deck_id>/", methods=["POST"])
# @log_decorator
def share_deck(deck_id):
    try:
        sender_id = current_user.id
        deck_to_copy = Deck.query.get_or_404(deck_id)
        if not deck_to_copy.share_id:
            share_id = str(uuid.uuid4())
            deck_to_copy.share_id = share_id
            db.session.commit()
        event_tracker(current_user.id, "share_deck", deck_id)
        data = request.get_json(silent=True)
        emails = data.get("emails")
        users_emails = emails.split(",")
        user_list = []
        not_user_list = []
        for email in users_emails:
            user = ({"id": "user_id", "name": "user_name", "email": email},)
            user_list.append(user)
            email = email.strip()
            user = User.query.filter_by(email=email).first()

            if user:
                shared_deck = SharedDecks(
                    name="Copy of " + deck_to_copy.name,
                    description=deck_to_copy.description,
                    sender=sender_id,
                    time_created=dt.datetime.now(dt.timezone.utc),
                    receiver=user.id,
                    share_id=deck_to_copy.share_id,
                )
                db.session.add(shared_deck)

                for card in deck_to_copy.cards:
                    new_card = Card(
                        term=card.term,
                        content=card.content,
                        boc_2=card.boc_2,
                        boc_3=card.boc_3,
                        boc_4=card.boc_4,
                        img=card.img,
                        sound=card.sound,
                        subject=card.subject,
                        topic=card.topic,
                        category=card.category,
                        prompt_option=card.prompt_option,
                        prompt_option2=card.prompt_option2,
                        trans_option=card.trans_option,
                        len_option=card.len_option,
                        qmin_option=card.qmin_option,
                        qmax_option=card.qmax_option,
                        diff_lvl=card.diff_lvl,
                    )
                    shared_deck.cards.append(new_card)
                db.session.commit()
            else:
                share_link = (
                    APP_URL + "/deck_bp/shared_deck_view/" + deck_to_copy.share_id
                )
                send_email(
                    email,
                    None,
                    "deck_shared",
                    "Someone sent you a deck",
                    link=share_link,
                )
                not_user_list.append(email)

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Deck shared successfully",
                    "users": user_list,
                    "not_users": not_user_list,
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured when attempting to share a deck {e}")
        jsonify({"error": "An error occurred during sharing"}), 500


####################### CARDS #######################
## GET CARDS
## EDIT CARD
## DELETE CARD
## CREATE NEW CARD
## REGENERATE CARD (ONLY DEFINITION FOR NOW)


#
@deck_bp.route("/api_0/deck/<int:deck_id>/cards", methods=["GET"])
# @log_decorator
def get_cards(deck_id):
    deck = Deck.query.get_or_404(deck_id)
    if current_user != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    query = Card.query.filter(Card.decks_backref.any(id=deck_id)).all()
    card_list = []
    for card in query:
        card_list.append(card.to_dict())
    return jsonify({"status": "success", "cards": card_list, "deck_id": deck_id}), 200


#
@deck_bp.route("/api_0/deck/<int:deck_id>/card/<int:card_id>", methods=["DELETE"])
# @log_decorator
def delete_card(deck_id, card_id):
    deck = Deck.query.get_or_404(deck_id)
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    card_to_delete = Card.query.filter_by(id=card_id).first()
    if card_to_delete is not None:
        db.session.delete(card_to_delete)
        db.session.commit()
        return jsonify({"status": "success", "message": "Card deleted"})
    else:
        return jsonify({"status": "error", "message": "Card not found"})


#
@deck_bp.route("/api_0/deck/<int:deck_id>/card", methods=["POST"])
# @log_decorator
def create_new_card(deck_id):
    deck = Deck.query.filter_by(id=deck_id).first()
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    try:
        data = request.get_json(silent=True)
        new_card = Card(
            term=data.get("term"),
            content=data.get("content"),
            boc_2=data.get("boc_2"),
            boc_3=data.get("boc_3"),
            boc_4=data.get("boc_4"),
            category=data.get("category"),
            time_created=dt.datetime.now(dt.timezone.utc),
            formula=data.get("formula"),
            subject=data.get("subject"),
            topic=data.get("topic"),
        )
        db.session.add(new_card)
        if deck:
            deck.cards.append(new_card)
        db.session.commit()
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Card created succesfully",
                    "card": new_card.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured when attempting to create a card {e}")
        return jsonify({"error": "An error occurred while creating the card"}), 500


@deck_bp.route("/api_0/deck/<int:deck_id>/card/<int:card_id>", methods=["PUT"])
#
# @log_decorator
def edit_card(deck_id, card_id):
    deck = Deck.query.filter_by(id=deck_id).first()
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    try:
        data = request.get_json(silent=True)
        card = Card.query.filter_by(id=card_id).first()
        card.term = data.get("term")
        card.content = data.get("content")
        card.boc_2 = data.get("boc_2")
        card.boc_3 = data.get("boc_3")
        card.boc_4 = data.get("boc_4")
        card.category = data.get("category")
        card.formula = data.get("formula")
        card.subject = data.get("subject")
        card.topic = data.get("topic")
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Card updated succesfully",
                    "card": card.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured when attempting to edit a card {e}")
        return jsonify({"error": "An error occurred while editing the card"}), 500


@deck_bp.route(
    "/api_0/deck/<int:deck_id>/card/<int:card_id>/regenerate/", methods=["PUT"]
)
# @log_decorator
def regenerate_def():
    event_tracker(current_user.id, "regenerate_def")
    card_id = request.form["id"]
    card = Card.query.filter(id == card_id).first()
    prompt_options = process_prompt_options_regen(card)
    term = card.term
    open_ai_caller = AiCaller()
    content = open_ai_caller.regenerate_definition(term, prompt_options)[0]
    card.content = content
    try:
        db.session.commit()
    except Exception as e:
        raise e
    return jsonify({"content": content})


def process_prompt_options_regen(card):
    if card.prompt_option is None:
        card.prompt_option = "Definitions"
    return {
        "main_opt": card.prompt_option,
        "subject_opt": card.prompt_option2,
        "trans_opt": card.trans_option,
        "lang_opt": card.trans_option,
        "detail_lvl_opt": card.len_option,
    }


####################### DECK FILES ###########################
## GET DECK FILES
## GET DECK FILE
## DOWNLOAD DECK FILE AS PDF
## DELETE DECK FILE


@deck_bp.route("/api_0/deck/<int:deck_id>/files", methods=["GET"])
# @log_decorator
def get_deck_files(deck_id):
    deck = Deck.query.get_or_404(deck_id)
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    event_tracker(current_user.id, "document_viewer", deck_id)
    try:
        query = DeckFiles.query.filter_by(deck_id=deck_id).all()
        documents = []
        for document in query:
            documents.append(document.to_dict())
        return jsonify({"status": "success", "documents": documents}), 200
    except Exception as e:
        logger.error(f"An error occured when attempting to retrieve documents {e}")
        return jsonify({"error": "An error occurred while retrieving documents"}), 500


@deck_bp.route("/api_0/deck/<int:deck_id>/file/<int:file_id>", methods=["GET"])
# @log_decorator
def get_deck_file(deck_id, file_id):
    deck = Deck.query.get_or_404(deck_id)
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    file = DeckFiles.query.get_or_404(file_id)
    return jsonify({"status": "success", "file": file.to_dict()}), 200


## get deck files


@deck_bp.route("/api_0/deck/<int:deck_id>/file/<int:file_id>/download", methods=["GET"])
# @log_decorator
def download_file_as_pdf(deck_id, file_id):
    event_tracker(current_user.id, "download_source", file_id)
    deck = Deck.query.get_or_404(deck_id)
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    file = DeckFiles.query.get_or_404(file_id)
    name = f"{file.file_name}.pdf"
    text = file.text_string
    pdf_buffer = create_pdf(text)
    return send_file(pdf_buffer, download_name=name)


@deck_bp.route("/api_0/deck/<int:deck_id>/file/<int:file_id>/", methods=["DELETE"])
# @log_decorator
def delete_file(deck_id, file_id):
    deck = Deck.query.get_or_404(deck_id)
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    event_tracker(current_user.id, "delete_file", file_id)
    file = DeckFiles.query.get_or_404(file_id)
    db.session.delete(file)
    db.session.commit()
    return jsonify({"status": "success", "message": "File deleted successfully"}), 200


################################ ANKI ##############################################
## IMPORT
## EXPORT


@deck_bp.route("/api_0/deck/import_anki", methods=["POST"])
# @log_decorator
def import_anki():
    data = request.get_json(silent=True)
    cards_imported = 0
    try:
        for card in data:
            deck_name = clean(card["deckName"])
            deck = Deck.query.filter_by(name=deck_name, user_id=current_user.id).first()
            if not deck:
                deck = Deck(name=deck_name, description="anki", user_id=current_user.id)
                db.session.add(deck)
                db.session.commit()

            # Extract the ordered field values and filter out images and sounds
            ordered_fields = [
                html.unescape(clean(remove_media_tags(val)))
                for val in card["fields"].values()
            ]

            # Initialize card with defaults
            card_data = {
                "term": ordered_fields[0] if len(ordered_fields) > 0 else "",
                "content": ordered_fields[1] if len(ordered_fields) > 1 else "",
                "boc_2": ordered_fields[2] if len(ordered_fields) > 2 else "",
                "boc_3": ordered_fields[3] if len(ordered_fields) > 3 else "",
                "boc_4": ordered_fields[4] if len(ordered_fields) > 4 else "",
                "srs_interval": card["interval"] * 1440,
                "category": "anki",
            }
            card_O = Card(**card_data)
            db.session.add(card_O)
            deck.cards.append(card_O)
            cards_imported += 1
        db.session.commit()
        return jsonify(
            {
                "state": "success",
                "details": {"qty-cards": cards_imported, "deck": deck.to_dict()},
            }
        )
    except Exception as e:
        logger.error(f"An error occured while importing deck: {e}")
        db.session.rollback()
        return jsonify({"error": "There was an error importing your deck"}), 500


@deck_bp.route("/api_0/deck/<int:deck_id>/export_anki/", methods=["POST"])
# @log_decorator
def export_deck(deck_id):
    try:
        request_anki_permission()
    except Exception as e:
        logger.error(f"An error occured while exporting deck: {e}")
        return (
            jsonify(
                {
                    "error": "Anki connect refused permission, please ensure you are on a desktop with anki connect installed and open"
                }
            ),
            500,
        )
    if check_anki_connect() is True:
        try:
            deck = Deck.query.get_or_404(deck_id)
            if deck.user != current_user:
                return (
                    jsonify(
                        {"error": "You do not have permission to export this deck"}
                    ),
                    400,
                )
            cards = deck.cards
            anki_create_deck(deck.name)
            for card in cards:
                query = card.term
                notes = find_notes(query)
                if notes is False:
                    srs_interval = str(int(card.srs_interval / 1440))
                    anki_create_card(deck.name, card.term, card.content)
            event_tracker(current_user.id, "export-anki", "success")
            return jsonify(
                {"status": "success", "message": "Deck exported succesfully"}
            )
        except Exception as e:
            logger.error(f"An error occured while exporting deck: {e}")
            return jsonify({"error": "There was an error exporting your deck"}), 500
    else:
        logger.error("An error occured while exporting deck")
        return (
            jsonify(
                {
                    "error": "Anki connect refused permission, please ensure you are on a desktop with anki connect installed and open"
                }
            ),
            500,
        )


####  WHAT IS THIS ROUTE USED FOR?
@deck_bp.route("/get_deck_data/<int:deck_id>", methods=["GET"])
# @log_decorator
def get_deck_data(deck_id):
    c_deck_id = deck_id
    deck_name = Deck.query.get_or_404(c_deck_id).name
    cards = Deck.query.get_or_404(c_deck_id).cards
    card_list = []
    for card in cards:
        card_list.append(
            {
                "id": card.id,
                "front": card.term,
                "back": card.content,
                "interval": card.srs_interval,
            }
        )
    response = jsonify({"name": deck_name, "cards": card_list})
    return response


############################### PUBLIC DECKS #################################
## GET PUBLIC CARDS FOR DECK
## GET PUBLIC DECKS
## IMPORT PUBLIC DECK


@deck_bp.route("/api_0/deck/<int:deck_id>/public/cards/", methods=["GET"])
# @log_decorator
def public_cards(deck_id):
    deck = Deck.query.filter_by(id=deck_id).first()
    if deck.public is False:
        return jsonify({"error": "This deck is not public"}), 400
    cards = Card.query.filter(Card.decks_backref.any(id=deck_id)).all()
    card_list = []
    for card in cards:
        card_list.append(card.to_dict())
    return jsonify({"status": "success", "cards": card_list}), 200


@deck_bp.route("/api_0/decks/public/", methods=["GET"])
# @log_decorator
def public_decks():
    query = Deck.query.filter(Deck.public == True)
    deck_list = []
    for deck in query:
        deck_list.append(deck.to_dict_public())
    return jsonify({"status": "success", "decks": deck_list}), 200


@deck_bp.route("/api_0/deck/<int:deck_id>/public/import/", methods=["POST"])
# @log_decorator
def import_public_deck(deck_id):
    deck = Deck.query.filter_by(id=deck_id, public=True).first()
    if deck is None:
        return jsonify({"error": "This deck is not public"}), 400
    else:
        new_deck = Deck(
            user_id=current_user.id,
            name="Copy of " + deck.name,
            description=deck.description,
            shared=True,
            time_created=dt.datetime.now(dt.timezone.utc),
        )
        db.session.add(new_deck)
        for card in deck.cards:
            new_card = Card(
                term=card.term,
                content=card.content,
                boc_2=card.boc_2,
                boc_3=card.boc_3,
                boc_4=card.boc_4,
                img=card.img,
                sound=card.sound,
                subject=card.subject,
                topic=card.topic,
                category=card.category,
                prompt_option=card.prompt_option,
                prompt_option2=card.prompt_option2,
                trans_option=card.trans_option,
                len_option=card.len_option,
                qmin_option=card.qmin_option,
                qmax_option=card.qmax_option,
                diff_lvl=card.diff_lvl,
            )
            new_deck.cards.append(new_card)
        db.session.commit()
    return jsonify({"state": "success"}), 200


## SEARCH PUBLIC DECKS
@deck_bp.route("/api_0/deck/public/search", methods=["POST"])
@log_decorator
def search_public_decks():
    data = request.json
    search_term = clean(data["search"])
    decks = Deck.query.filter(
        Deck.public == True, Deck.name.contains(search_term)
    ).all()  # noqa: E712
    return jsonify([deck.serialize() for deck in decks])


############################## TUTOR BOT ###############################
## EXPLAIN FURTHER
## WHY WRONG
## SEND QUESTION


@deck_bp.route("/api_0/card/<int:card_id>/tutor_bot/explanation/", methods=["GET"])
# @log_decorator
def explain_further(card_id):
    try:
        card = Card.query.filter_by(id=card_id).first()
        if card is None:
            return jsonify({"error": "Card not found"}), 400
        ai_caller = AiCaller()
        term = card.term
        subject = card.subject
        content = card.content
        response = ai_caller.explain_more(term, subject, content)
        return {"status": "success", "response": response}
    except Exception as e:
        logger.error(f"An error occured while generating why wrong: {e}")
        return jsonify({"error": "There was an error, unable to get a response"}), 500


@deck_bp.route("/api_0/card/<int:card_id>/tutor_bot/wrong_choice", methods=["GET"])
# @log_decorator
def why_wrong(card_id):
    try:
        card = Card.query.filter_by(id=card_id).first()
        open_ai_caller = AiCaller()
        if card is None:
            return jsonify({"error": "Card not found"}), 400
        ww_prompt = why_wrong_builder(card_id)
        response = open_ai_caller.why_wrong_generator(ww_prompt)
        return {"status": "success", "response": response}, 200
    except Exception as e:
        logger.error(f"An error occured while generating why wrong: {e}")
        return jsonify({"error": "There was an error, unable to get a response"}), 500


def why_wrong_builder(card_id):
    card = Card.query.filter_by(id=card_id).first()
    return {
        "term": card.term,
        "subject": card.subject,
        "content": card.content,
        "boc_2": card.boc_2,
        "boc_3": card.boc_3,
        "boc_4": card.boc_4,
        "category": card.category,
        "card_id": card.id,
    }


@deck_bp.route("/api_0/card/<int:card_id>/tutor_bot/question", methods=["GET"])
# @log_decorator


def send_question(card_id):
    try:
        card = Card.query.filter_by(id=card_id).first()
        latest_paragraph = clean(request.form.get("latest_paragraph"))
        question = clean(request.form.get("question"))
        term = clean(card.term)
        content = clean(card.content)
        ai_caller = AiCaller()
        response = ai_caller.send_question_generator(
            term, content, latest_paragraph, question
        )
        return {"status": "success", "response": response}
    except Exception as e:
        logger.error(f"An error occured while generating why wrong: {e}")
        return jsonify({"error": "There was an error, unable to get a response"}), 500


### UTILITY FUNCTIONS
def remove_media_tags(content):
    img_tag_pattern = r"<img[^>]+>"
    content_without_images = re.sub(img_tag_pattern, "", content)
    sound_tag_pattern = r"\[sound:[^\]]+\]"
    content_without_media = re.sub(sound_tag_pattern, "", content_without_images)
    return content_without_media


def remove_html_tags(text):
    clean = re.compile("<.*?>")
    return re.sub(clean, "", text)


def quote_deck_name_if_needed(deck_name):
    if " " in deck_name:
        return '"{}"'.format(deck_name)
    else:
        return deck_name
