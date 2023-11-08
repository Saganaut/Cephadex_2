import os
import datetime as dt
import tempfile
from bleach import clean
import stripe
import logging
from werkzeug.utils import secure_filename
from google.oauth2 import id_token
from google.auth.transport import requests
from flask import (
    request,
    session,
    Blueprint,
    jsonify,
)
from models.models_ import (
    Card,
    Deck,
    PlayerGame,
    Subscriber,
    UserSettings,
    User,
    Feedback,
    DeletedAccounts,
    Test,
    TestResult,
)
from models.send_email import send_email
from models.tracking.events import event_tracker
from config.settings import AUTH2_CLIENT_ID
from run.extensions import db
from models.storage.s3 import upload_to_s3, delete_s3_object_in_folder
from models.helpers.log_decorators import log_decorator
from models.user.sub_handler import StripeEventHandler
from flask_login import login_user, logout_user, current_user
from flask import make_response
import time

logger = logging.getLogger("flask_app")

user_bp = Blueprint(
    "user_bp", __name__, template_folder="templates/user_bp", static_folder="static"
)


@user_bp.route("/api_0/auth/logout", methods=["DELETE"])
def logout_current_user():
    print("logging out route")    
    try:
        logout_user()
        session.clear()
        response = make_response(jsonify({"status": "success", "message": "Logged out"}))
        response.set_cookie('session', '', expires=0)
        return response
    except Exception as e:
        app.logger.error(f'Error during logout: {e}', exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

@user_bp.route("/api_0/auth/status", methods=["GET"])
def user_status():
    print("checking status")
    print(session)
    print(current_user)
    if current_user.is_authenticated:
        return {"status": "success", "user": current_user.to_dict()}, 200
    else:
        return {"status": "not authenticated"}, 401


@user_bp.route("/api_0/auth/google-sign-in", methods=["OPTIONS"])
def options_accept():
    start_time = time.time()
    print("called options", start_time)
    if request.method == "OPTIONS":
        response = make_response()

        # response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        # response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        # response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        # response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 200

@user_bp.route("/api_0/user", methods=["GET"])
def get_user():
    if current_user.is_authenticated:
        return {"status": "success", "user": current_user.to_dict()}, 200
    else:
        return {"status": "not authenticated"}, 401

@user_bp.route("/api_0/auth/google-sign-in", methods=["POST", "GET", "PATCH", "PUT"])
def google_sign_in():
    start_time = time.time()
    print(start_time)
    print("entered google sign in")
    data = request.get_json()
    credential = data.get("credential")
    print(credential)
    try:
        idinfo = id_token.verify_oauth2_token(
            credential, requests.Request(), AUTH2_CLIENT_ID
        )
        print(idinfo)
    except ValueError as e:
        logger.error(f"Value error in google sign in, invalid token {e}")
        return jsonify({"error": "Invalid token"}), 400
    try:
        user_id = idinfo["sub"]
        if not (user := User.query.filter_by(external_id=user_id).first()):
            return handle_new_user(idinfo)
        login_user(user)
        print(current_user.id)
        session["user_id"] = user.id  # Or another form of identification
        session.modified = True
        response = jsonify({"status": "success", "user": current_user.to_dict()})
        # response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        print(response.data)
        print(response.headers)
        # response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
    except ValueError as e:
        logger.error(f"Value error in google sign in {e}")
        return jsonify({"error": str(e)}), 400



        # if "shared_deck_id" in session:
        #     return found_shared_deck_id_in_session()
        # if "game_id" in session:
        #     return found_game_id_in_session()
        # if "shared_quiz_id" in session:
        #     return found_quiz_id_in_session()
        # if "quiz_result_id" in session:
        #     return found_quiz_result_id_in_session()



def handle_new_user(idinfo):
    session["google_id_token"] = idinfo["sub"]
    session["google_email"] = idinfo.get("email", "n/a")
    session["given_name"] = idinfo.get("given_name", "Anonymous")
    session["family_name"] = idinfo.get("family_name", "Anonymous")
    return (
        jsonify(
            {
                "status": "success",
                "message": "New user",
                "route": {"“type": "register", "id": idinfo["sub"]},
            }
        ),
        200,
    )


def verify_csrf_token():
    csrf_token_cookie = request.cookies.get("g_csrf_token")
    csrf_token_body = request.form.get("g_csrf_token")
    if not csrf_token_cookie:
        return jsonify({"error": "No CSRF token in cookie"}), 400
    if not csrf_token_body:
        return jsonify({"error": "No CSRF token in body"}), 400
    if csrf_token_cookie != csrf_token_body:
        return jsonify({"error": "CSRF token mismatch"}), 400
    return None, None


def found_shared_deck_id_in_session():
    if session.get("shared_deck_id"):
        shared_deck = Deck.query.filter_by(share_id=session["shared_deck_id"]).first()
        new_deck = Deck(
            user_id=current_user.id,
            name=shared_deck.name,
            description=shared_deck.description,
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

        del session["shared_deck_id"]
        db.session.commit()
    else:
        return (
            jsonify({"error": "There was an issue saving your deck, please try again"}),
            400,
        )
    return jsonify({"status": "success", "route": {"deck": str(new_deck.id)}}), 200


def found_game_id_in_session():
    if session.get("game_id"):
        game_id = session.get("game_id")
        if current_user.username:
            username = current_user.username
        else:
            username = current_user.email
        player = PlayerGame(
            player_id=current_user.id, game_id=game_id, username=username
        )
        db.session.add(player)
        db.session.commit()
        del session["game_id"]
        return jsonify({"status": "success", "route": {"game": str(game_id)}}), 200
    else:
        return jsonify({"error": "Could not find game"}), 400


def found_quiz_id_in_session():
    if session.get("shared_quiz_id"):
        quiz = Test.query.filter_by(share_id=session["shared_quiz_id"]).first()
        del session["shared_quiz_id"]
        return jsonify({"status": "success", "route": {"quiz": str(quiz.id)}}), 200

    else:
        return jsonify({"error": "Could not find quiz"}), 400


def found_quiz_result_id_in_session():
    if session.get("quiz_result_id"):
        quiz_result = TestResult.query.filter_by(id=session["quiz_result_id"]).first()
        quiz_result.taker = current_user.id
        db.session.commit()
        del session["quiz_result_id"]
        return (
            jsonify(
                {"route": {"status": "success", "quiz_result": str(quiz_result.id)}}
            ),
            200,
        )
    else:
        return jsonify({"error": "Could not find quiz"}), 400


@user_bp.route("/api_0/feedback", methods=["POST"])
@log_decorator
def feedback():
    data = request.get_json(silent=True)
    errors = []
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")
    type_feedback = data.get("type_feedback")

    if not name or name == "":
        errors.append("Name is required.")
    if not email or email == "":
        errors.append("Email is required.")
    if not message or message == "":
        errors.append("Message is required.")
    if not type_feedback or type_feedback == "":
        errors.append("Feedback type is required.")

    if not errors:
        if name != "RobertEmelo":
            entry = Feedback(
                name=name,
                email=email,
                message=message,
                type_feedback=type_feedback,
            )
            entry.send_feedback()
        return (
            jsonify({"status": "success", "message": "Thank you for your feedback!"}),
            200,
        )
    else:
        return jsonify({"status": "error", "errors": errors}), 400


@user_bp.route("/api_0/account", methods=["GET"])
@log_decorator
def account_settings():
    try:
        user_details = current_user.to_dict()
        return jsonify({"status": "success", "user_details": user_details}), 200
    except AttributeError:
        return jsonify({"error": "Could not find user details"}), 400


@user_bp.route("/api_0/account", methods=["DELETE"])
@log_decorator
def delete_account():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    del_email = data.get("del_email")
    reason = data.get("reason") or "Unspecified"
    other_reason = data.get("other_reason")

    user = User.query.filter_by(id=current_user.id).first()

    if user and user.email == del_email:
        user.account_status = "inactive"
        user.expiration = dt.datetime.now(dt.timezone.utc)
        user.account_expiration_reason = "Deleted"

        final_reason = reason if reason != "other" else other_reason
        details = data.get("more")

        deleted_entry = DeletedAccounts(
            user_id=current_user.id,
            email=current_user.email,
            time_created=current_user.time_created,
            time_deleted=dt.datetime.now(dt.timezone.utc),
            reason=final_reason,
            reason_details=details,
        )

        db.session.add(deleted_entry)
        db.session.commit()
        logout_user()

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "We are sorry to see you go. Your account is now inactive and will be permanently deleted within 48 hours.",
                }
            ),
            200,
        )

    else:
        return (
            jsonify(
                {"error": "Account deletion failed, please check the provided details."}
            ),
            400,
        )


@user_bp.route("/api_0/login", methods=["GET", "POST"])
@log_decorator
def login():
    if current_user.is_authenticated:
        return jsonify({"message": "You are already logged in."}), 200
    else:
        return jsonify({"message": "You are not logged in."}), 200


@user_bp.route("api_0/check_username/<username>", methods=["GET"])
@log_decorator
def check_username(username):
    user = User.query.filter_by(username=username).first()
    if user is not None:
        response = jsonify({"username_taken": True})
    else:
        response = jsonify({"username_taken": False})
    response.status_code = 200
    return response


@user_bp.route("/api_0/registration", methods=["POST"])
@log_decorator
def register():
    data = request.get_json(silent=True)
    if "google_email" not in session or "google_id_token" not in session:
        return jsonify({"error": "Unable to register, please try again"}), 400
    try:
        username = data.get("username")
        subscribe = data.get("subscribe")
        role = data.get("role")
        timezone = data.get("timezone")
        email = session["google_email"]
        userid = session["google_id_token"]
        given_name = session["given_name"]
        family_name = session["family_name"]

        if guest_user := User.query.filter_by(email=email, guest=True).first():
            user = turn_guest_into_regular_user(
                guest_user,
                username,
                userid,
                given_name,
                family_name,
                role,
                timezone,
            )
        else:
            user = User(
                email=email,
                first_name=given_name,
                last_name=family_name,
                external_id=userid,
                external_type="google",
                contacted_email=True,
                username=username,
                timezone=timezone,
                subscription_start_date=dt.datetime.now(dt.timezone.utc),
                role=role,
            )
            db.session.add(user)
            send_email(email, given_name, "welcome")
            user_settings = UserSettings(user=user.id)
            db.session.add(user_settings)
        if subscribe == "subscribe":
            sub_exists = Subscriber.query.filter_by(email=email).first()
            if not sub_exists:
                time_created = dt.datetime.now(dt.timezone.utc)
                subscriber = Subscriber(
                    email=email,
                    first_name=given_name,
                    last_name=family_name,
                    time_created=time_created,
                )
                db.session.add(subscriber)
        event_tracker(user.id, "register", "google")
        db.session.commit()
        login_user(user)
        if "shared_test_id" in session:
            return found_quiz_id_in_session()
        if "shared_deck_id" in session:
            return found_shared_deck_id_in_session()
        if "game_id" in session:
            return found_game_id_in_session()
        if "quiz_result_id" in session:
            return found_quiz_result_id_in_session()
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Registration successful!",
                    "route": {"type": "new_user", "id": user.id},
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured during registration {e}")
        return jsonify({"error": "Unable to register, please try again"}), 400


def turn_guest_into_regular_user(
    guest_user,
    username,
    userid,
    given_name,
    family_name,
    role,
    timezone,
    external_type="google",
    subscription_plan=1,
):
    guest_user.username = username
    guest_user.guest = False
    guest_user.external_id = userid
    guest_user.first_name = given_name
    guest_user.last_name = family_name
    guest_user.external_type = external_type
    guest_user.subscription_plan = subscription_plan
    guest_user.subscription_start_date = dt.datetime.now(dt.timezone.utc)
    guest_user.role = role
    guest_user.timezone = timezone
    return guest_user


## This is solely for the newsletter subscription
@user_bp.route("/api_0/subscription", methods=["POST"])
@log_decorator
def subscribe202():
    print("entered subscribe API")
    data = request.get_json(silent=True)
    email = data["email"]
    existing_subscriber = Subscriber.query.filter_by(email=email).first()
    if existing_subscriber and existing_subscriber is not None:
        return (
            jsonify({"status": "failure", "message": "You are already subscribed!"}),
            200,
        )
    else:
        subscriber = Subscriber(
            email=email, time_created=dt.datetime.now(dt.timezone.utc)
        )
        db.session.add(subscriber)
        db.session.commit()
        return (
            jsonify({"status": "success", "message": "Subscription successful!"}),
            200,
        )


@user_bp.route("/api_0/subscription", methods=["DELETE"])
@log_decorator
def unsubscribe_from_newsletter():
    data = request.get_json(silent=True)
    email = data["email"]
    existing_subscriber = Subscriber.query.filter_by(email=email).first()
    if existing_subscriber and existing_subscriber is not None:
        db.session.delete(existing_subscriber)
        db.session.commit()
        return jsonify({"status": "success", "message": "Unsubscribed!"}), 200
    else:
        return jsonify({"status": "failure", "message": "You are not subscribed!"}), 200


@user_bp.route("/api_0/logout", methods=["DELETE"])
@log_decorator
def logout():
    logout_user()
    session.clear()
    print("loging user out and clearing session")
    return jsonify({"status": "success", "message": "You have been logged out."}), 200


@user_bp.route("/api_0/notifications", methods=["DELETE"])
@log_decorator
def disable_notifications():
    current_user.contacted_email = False
    db.session.commit()
    return jsonify({"status": "success", "message": "Notifications disabled"}), 200


@user_bp.route("/api_0/notifications", methods=["POST"])
@log_decorator
def enable_notifications():
    current_user.contacted_email = True
    db.session.commit()
    return jsonify({"status": "success", "message": "Notifications enabled"}), 200


@user_bp.route("/api_o/account_info", methods=["PATCH"])
@log_decorator
def update_account_info():
    try:
        data = request.get_json(silent=True)
        current_user.first_name = data.get("first_name")
        current_user.last_name = data.get("last_name")
        current_user.username = data.get("username")
        current_user.gender = data.get("gender")
        current_user.timezone = data.get("timezone")
        current_user.role = data.get("role")
        db.session.commit()
        return (
            jsonify({"status": "success", "message": "Account settings updated"}),
            200,
        )
    except Exception as e:
        logger.error(f"An error occured while updating account settings: {e}")
        return (
            jsonify(
                {
                    "status": "failure",
                    "message": "Account settings could not be updated",
                }
            ),
            200,
        )


@user_bp.route("/api_0/profile_pic", methods=["POST"])
@log_decorator
def update_profile_pic_api():
    if "profile_pic" not in request.files:
        return jsonify({"error": "No file part"}), 400
    profile_picture = request.files["profile_pic"]
    if profile_picture.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if profile_picture and allowed_file(profile_picture.filename):
        try:
            filename = f"{current_user.id}_{secure_filename(profile_picture.filename)}"
            temp_path = os.path.join(tempfile.gettempdir(), filename)
            profile_picture.save(temp_path)
            upload_to_s3("cephadex", "profile_pictures", temp_path, filename)
            os.remove(temp_path)
            if current_user.pic is not None:
                try:
                    delete_s3_object_in_folder(
                        "cephadex", "profile_pictures", current_user.pic
                    )
                except Exception as e:
                    logger.error(f"Error deleting profile pic from s3: {e}")
            current_user.pic = filename
            db.session.commit()
            return (
                jsonify({"status": "success", "message": "Profile picture updated"}),
                200,
            )
        except Exception as e:
            logger.error(f"An error occured while updating profile picture: {e}")
            return (
                jsonify(
                    {
                        "status": "failure",
                        "message": "Profile picture could not be updated",
                    }
                ),
                200,
            )
    else:
        return jsonify({"error": "Invalid file"}), 400


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@user_bp.route("/api_0/user/settings", methods=["GET"])
def get_user_settings():
    user_settings = UserSettings.query.filter_by(user=current_user.id).first()
    if user_settings:
        print(user_settings)
        user_settings = user_settings.to_dict()
        print(user_settings)
        return jsonify({"status": "success", "settings": user_settings}), 200
    else:
        return jsonify({"status": "failure", "message": "no user settings found"}), 200


@user_bp.route("/user_bp/api_0/user/settings", methods=["PATCH"])
def update_user_settings():
    data = request.get_json(silent=True)
    settings = UserSettings.query.filter_by(user=current_user.id).first()
    if not settings:
        return jsonify({"error": "User settings not found"}), 404
    for key, value in data.items():
        if hasattr(settings, key):
            setattr(settings, key, value)

    db.session.commit()
    return (
        jsonify(
            {
                "status": "success",
                "message": "Settings updated successfully",
                "settings": settings.to_dict(),
            }
        ),
        200,
    )


@user_bp.route("/new_user_settings_tests", methods=["PATCH"])
@log_decorator
def new_user_settings_tests():
    data = request.get_json(silent=True)
    if data.get("checked"):
        user_settings = UserSettings.query.filter_by(user=current_user.id).first()
        user_settings.new_user_tests = False
        db.session.add(user_settings)
        db.session.commit()
    return jsonify({"status": "success"}), 200


@user_bp.route("/new_user_settings_study", methods=["PATCH"])
@log_decorator
def new_user_settings():
    data = request.get_json(silent=True)
    if data.get("checked"):
        user_settings = UserSettings.query.filter_by(user=current_user.id).first()
        user_settings.new_user_study = False
        db.session.add(user_settings)
        db.session.commit()
    return jsonify({"status": "success"}), 200


@user_bp.route("/new_user_settings_create", methods=["PATCH"])
@log_decorator
def new_user_settings_create():
    data = request.get_json(silent=True)
    if data.get("checked"):
        user_settings = UserSettings.query.filter_by(user=current_user.id).first()
        user_settings.new_user = False
        db.session.add(user_settings)
        db.session.commit()
    return jsonify({"status": "success"}), 200


@user_bp.route("/new_user_settings_view_decks", methods=["PATCH"])
@log_decorator
def new_user_settings_viewdecks():
    data = request.get_json(silent=True)
    if data.get("checked"):
        user_settings = UserSettings.query.filter_by(user=current_user.id).first()
        user_settings.new_user_decks = False
        db.session.add(user_settings)
        db.session.commit()
    return jsonify({"status": "success"}), 200


@user_bp.route("/new_user_settings_cards", methods=["PATCH"])
@log_decorator
def new_user_settings_cards():
    data = request.get_json(silent=True)
    if data.get("checked"):
        user_settings = UserSettings.query.filter_by(user=current_user.id).first()
        user_settings.new_user_cards = False
        db.session.add(user_settings)
        db.session.commit()
    return jsonify({"status": "success"}), 200


@user_bp.route("/pricing_table_settings", methods=["GET"])
@log_decorator
def pricing_table_settings():
    try:
        publishable_key = os.environ.get("STRIPE_PUBLISHABLE_KEY")
        pricing_table_id = os.environ.get("STRIPE_PRICING_TABLE_ID")
        return (
            jsonify(
                {
                    "publishable_key": publishable_key,
                    "pricing_table_id": pricing_table_id,
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"Unable to retrieve pricing table settings: {e})")
        return jsonify({"error": "Unable to retrieve pricing table settings"}), 200


@log_decorator
@user_bp.route("/stripe_webhook", methods=["POST"])
def stripe_webhook():
    endpoint_secret = os.environ.get("STRIPE_SIGNING_SECRET")

    valid_events = [
        "checkout.session.completed",
        "customer.subscription.renewing",
        "customer.deleted",
        "customer.updated",
        "customer.subscription.deleted",
        "customer.subscription.updated",
        "customer.subscription.created",
        "customer.subscription.trial_will_end",
        "invoice.created",
        "invoice.payment_failed",
        "invoice.payment_succeeded",
        "invoice.updated",
        "invoice.finalized",
        "invoice_finalization_failed",
        "customer_created",
    ]
    payload = request.data.decode("utf-8")
    sig_header = request.headers.get("stripe-signature")
    event = None
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        logger.error("An exception occurred in stribe_webhook() route): %s", e)
        return "Invalid payload", 401
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Signature verification error: {str(e)}")
        return "Invalid signature", 402
    if event["type"] in valid_events:
        stripe_event_handler = StripeEventHandler()
        stripe_event_handler.handle_event(event)
    else:
        return "Unused event type", 200
    return "Success", 200
