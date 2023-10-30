import json
import logging
from bleach import clean
from flask import Blueprint, jsonify

####from cardcreator import create_image, creato
from models.tracking.events import event_tracker
from models.models_ import Card, Deck, UserSettings
from run.extensions import db
from flask_login import login_user, logout_user, current_user

from models.helpers.log_decorators import log_decorator

study_bp = Blueprint(
    "study_bp", __name__, template_folder="templates/study_bp", static_folder="static"
)

logger = logging.getLogger("flask_app")

NUMBER_OF_CARDS_TO_LOAD = 20


################################ STUDY ####################################
## GET CARDS DUE FOR A DECK
## GET STUDY DATA FOR A DECK
## INCREMENT A CARD
## DECREMENT A CARD



@study_bp.route("/api_0/study/cards_due/<int:deck_id>", methods=["GET"])
@log_decorator
def get_cards_due(deck_id):
    n = NUMBER_OF_CARDS_TO_LOAD
    deck = Deck.query.get(deck_id)
    if current_user.id != deck.user_id:
        return jsonify({"status": "error", "message": "Deck not assigned to user"}), 403
    return jsonify({"status": "success", "cards_due": deck.cards_due(n)})


@study_bp.route("/api_0/study/data/<int:deck_id>", methods=["GET"])
@log_decorator
def get_study_data(deck_id):
    deck0 = Deck.query.get(deck_id)
    total_answered = deck0.total_answered()
    correct_answers = deck0.correct_incorrect()[0]
    if total_answered > 0:
        percentage = (correct_answers / total_answered) * 100
    else:
        percentage = 0
    cards_due = deck0.cards_due()

    return jsonify(
        {
            "status": "success",
            "info": {
            "total_answered": total_answered,
            "percentage": f"{percentage:.1f}%",
            "cards_due": cards_due,}
        }
    )

@study_bp.route("/api_0/study/card/increment/<card_id>", methods=["POST"])
@log_decorator
def increment(card_id):
    c_card_id = card_id
    card = Card.query.get(c_card_id)
    deck = Deck.query.filter(Deck.cards.any(id=c_card_id)).first()
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    if card is None:
        return jsonify({"error": "Card not found"}), 404
    card.increment()
    card.update_time()
    return jsonify({"status":"success", "message": "Card incremented"}), 200

@study_bp.route("/api_0/study/card/decrement/<card_id>", methods=["POST"])
@log_decorator
def decrement(card_id):
    c_card_id = card_id
    card = Card.query.get(c_card_id)
    deck = Deck.query.filter(Deck.cards.any(id=c_card_id)).first()
    if current_user.id != deck.user_id:
        return jsonify({"error": "Deck not assigned to user"}), 403
    if card is None:
        return jsonify({"error": "Card not found"}), 404
    card.decrement()
    card.update_time()
    return jsonify({"status":"success", "message": "Card decremented"}), 200

