import logging
from flask import Blueprint, render_template, flash, redirect, session, url_for, jsonify
from models.user.user_settings import UserSettings
from models.extractors.extractor import Extractor, tokens_general
from models.exceptions.flask_error_handlers import (
    handle_audio_error,
    handle_youtube_error,
    handle_file_not_found_error,
    handle_unknown_error,
)
from models.tracking.events import event_tracker
from models.exceptions.exceptions import YoutubeError, AudioError
from run.extensions import db
from models.helpers.log_decorators import log_decorator
from config.settings import TOKENS_PER_PAGE
from flask import request
from werkzeug.utils import secure_filename
import os
import json
from flask_login import login_user, logout_user, current_user


logger = logging.getLogger("flask_app")

extract_bp = Blueprint(
    "extract_bp",
    __name__,
    template_folder="templates/extract_bp",
    static_folder="static",
)


@extract_bp.route("/api_0/extraction/", methods=["POST"])
@log_decorator
def extract():
    file = request.files[
        "file"
    ]  # 'file_field_name' is the name attribute of the input field on the client side
    if file:
        filename = secure_filename(file.filename)
        ## if upload_files doesnt' exist create it
        if not os.path.exists("uploaded_files"):
            os.makedirs("uploaded_files")
        file.save(os.path.join("uploaded_files", filename))
        data = json.loads(request.form["extract_data"])
        data["file_path"] = os.path.join("uploaded_files", filename)
        data["user_id"] = current_user.id
        data["user_subscription_plan"] = current_user.subscription_plan
        data["existing_deck"] = data.get("existing_deck_id")
        data["new_deck_name"] = data.get("new_deck_name")
        extract_obj = Extractor(db.session, data)
        session["slug"] = extract_obj.slug
        try:
            extract_obj.get_content()
            deck, new_deck_created = extract_obj.get_deck()
            if new_deck_created:
                db.session.add(deck)
                db.session.commit()
            extract_obj.quantity_tokens()
            if current_user.perform_operation("extract", extract_obj.tokens) is False:
                db.session.delete(extract_obj.deck)
                db.session.commit()

                event_tracker(current_user.id, "extract_start", "fail", "limit_reached")
                return (
                    jsonify(
                        {"status": "fail", "message": "You have insufficient tokens"}
                    ),
                    200,
                )
            extract_obj.save_source_text()
            extract_obj.create_jobs()
        except AudioError as e:
            handle_audio_error(e)
        except YoutubeError as e:
            handle_youtube_error(e)
        except FileNotFoundError as e:
            handle_file_not_found_error(e)
        except Exception as e:
            handle_unknown_error(e)
    return (
        jsonify(
            {
                "status": "success",
                "message": "Extract started",
                "slug": extract_obj.slug,
            }
        ),
        200,
    )


@extract_bp.route("/api_0/credit_counter", methods=["POST"])
@log_decorator
def call_credit_counter():
    file = request.files["file"]
    data = request.json_get(silent=True)
    # 'file_field_name' is the name attribute of the input field on the client side
    if file:
        filename = secure_filename(file.filename)
        ## if upload_files doesnt' exist create it
        if not os.path.exists("uploaded_files"):
            os.makedirs("uploaded_files")
        file.save(os.path.join("uploaded_files", filename))
        data = json.loads(request.form["extract_data"])
        data["file_path"] = os.path.join("uploaded_files", filename)

    try:
        credit = round(tokens_to_credit(tokens_general(data)), 1)
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Call credit counter",
                    "credit": credit,
                }
            ),
            200,
        )
    except YoutubeError as e:
        logger.error(f"Youtube error in call credit counter {e}")
        return (
            jsonify(
                {
                    "error": "Unable to process youtube video, only youtube videos with public captions are allowed."
                }
            ),
            200,
        )
    except FileNotFoundError as e:
        logger.error(f"File not found error in call credit counter {e}")
        return jsonify({"error": "File not found"}), 200
    except Exception as e:
        logger.error(f"Unknown error in call credit counter {e}")
        return jsonify({"error": "Unknown error"}), 200


def tokens_to_credit(tokens):
    return tokens / TOKENS_PER_PAGE


def initialize_user_settings():
    user_settings = UserSettings.query.filter_by(user=current_user.id).first()
    if user_settings is None:
        user_settings = UserSettings(user=current_user.id)
        db.session.add(user_settings)
        db.session.commit()
    return user_settings
