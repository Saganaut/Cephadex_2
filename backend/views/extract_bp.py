import logging
import random
from models.exceptions.exceptions import (
    YoutubeError,
    UnsupportedFileError,
    AudioError,
    ExtractionError,
    ExtractionWikiError,
)
from typing import Optional
from flask import Blueprint, render_template, flash, redirect, session, url_for, jsonify
from models.user.user_settings import UserSettings
from models.extractors.extractor import Extractor, tokens_general
from models.exceptions.flask_error_handlers import (
    handle_audio_error,
    handle_youtube_error,
    handle_file_not_found_error,
    handle_unknown_error,
    
)
from werkzeug.datastructures import ImmutableMultiDict
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
def prepare_extractor_data(form_data: ImmutableMultiDict, file: Optional[object] = None) -> dict:
    
    file_path = save_file(file) if file else None
    data = {
        "main_opt": form_data.get("cardTypeField"),
        "subject": form_data.get("subjectField"),
        "lang_opt": form_data.get("languageField"),
        "detail_lvl_opt": form_data.get("detailField"),
        "trans_opt": form_data.get("translationField"),
        "min_opt": form_data.get("minField"),
        "max_opt": form_data.get("maxField"),
        "images_opt": "Generate images" in form_data.get("multiOptionsField", ""),
        "save_text_opt": "Save text" in form_data.get("multiOptionsField", ""),
        "custom_term": form_data.get("customTermField"),
        "custom_content": form_data.get("customContentField"),
        "create_summary": "Create summary" in form_data.get("multiOptionsField", ""),
        "create_notes": "Create study notes" in form_data.get("multiOptionsField", ""),
        "existing_deck": form_data.get("nameField"),
        "deck_description": form_data.get("descriptionField"),
        "existing_deck": form_data.get("existingDeckField"),
        "new_deck_name": form_data.get("nameField"),
        "file_path": file_path,
        "text_input": form_data.get("textField"),
        "link_input": form_data.get("linkField"),
        "user_id": current_user.id,  
    }
    
    return data

def save_file(file) -> str:
    file_basename, file_extension = os.path.splitext(file.filename)
    random_int = random.randint(1, 99999)
    new_filename = f"{secure_filename(file_basename)}_{random_int}{file_extension}"
    file_path = os.path.join("uploaded_files", new_filename)
    if not os.path.exists("uploaded_files"):
        os.makedirs("uploaded_files")
    file.save(file_path)
    return file_path


@extract_bp.route("/api_0/extraction/", methods=["POST"])
@log_decorator
def extract():
    data = request.form
    print(data)
    file = request.files.get('fileField')
    extractor_data = prepare_extractor_data(data, file)

    print(extractor_data)

  
    extract_obj = Extractor(db.session, extractor_data)
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
        extract_obj.job_clean_up()
    except AudioError as e:
        handle_audio_error(e)
    except YoutubeError as e:
        handle_youtube_error(e)
    except FileNotFoundError as e:
        handle_file_not_found_error(e)
    except UnsupportedFileError as e:
        pass 
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
