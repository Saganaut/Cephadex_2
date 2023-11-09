import eventlet

# eventlet.monkey_patch(socket=True)

from flask_cors import CORS

import logging
import datetime as dt
import random
from flask import g, redirect, render_template, request, session
from flask import url_for, send_file, jsonify, make_response
from models.models_ import Job, JobNotification, UsageRecord, User
from models.send_email import send_email
from factory import create_app
from run.extensions import db, socketio
from config.settings import DEBUG
from run.bp_register import register_blueprints
from config.settings import TOKENS_PER_PAGE
from google.cloud import recaptchaenterprise_v1
from google.cloud.recaptchaenterprise_v1 import Assessment
from flask_wtf.csrf import generate_csrf
from flask_login import login_user, logout_user, current_user, LoginManager
from run.extensions import db, migrate, socketio, login_manager

app = create_app()
cors = CORS(
    app,
    resources={
        r"/*": {"origins": "*", "supports_credentials": True}
    },
)
logging.getLogger("flask_cors").level = logging.DEBUG



@login_manager.user_loader
def load_user(user_id):
    print("loading user", user_id)
    return User.query.get(int(user_id))


@app.context_processor
def inject_csrf_token():
    """Inject CSRF token into templates"""
    return dict(csrf_token=generate_csrf())


@app.route("/api_0/csrf-token")
def get_csrf_token():
    token = generate_csrf()  # generate a CSRF token
    response = make_response(jsonify({"detail": "CSRF cookie set"}))
    response.set_cookie(
        "csrf_token", token, secure=True, httponly=True, samesite="Strict"
    )  # set the CSRF token as a cookie
    return response


@app.after_request
def after_request(response):
    # """Ensure responses aren't cached"""
    # response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    # response.headers["Expires"] = 0
    # response.headers["Pragma"] = "no-cache"

    # response.headers[
    #     "Referrer-Policy"
    # ] = "no-referrer-when-downgrade"  ## ONLY FOR http AND LOCALHOST, FOR GOOGLE AUTH
    # return response
    print("Response headers:")
    for header, value in response.headers.items():
        print(f"{header}: {value}")
    
    return response

@app.before_request
def before_request():
    """Addressing bug with import anki and feedback form"""
    print("before request")
    print(request)

###  REGISTERING BLUEPRINTS AFTER REQUESTS
register_blueprints(app)


@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Page not found"}), 404


@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({"error": "Internal server error"}), 500


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 500


@app.errorhandler(403)
def forbidden(e):
    return jsonify({"error": "Forbidden"}), 500


@app.errorhandler(401)
def unauthorized(e):
    return jsonify({"error": "Unauthorized access"}), 500


@app.route("/robots.txt")
def robots():
    """For indexing"""
    return send_file("static/robots.txt")


@app.route("/sitemap.xml")
def sitemap():
    """For indexing"""
    return send_file("static/sitemap.xml")


@app.route("/", methods=["GET", "POST"])
def index():
    """Home page"""
    if not current_user.is_authenticated or current_user.guest is True:  # type: ignore
        return render_template("index.html")
    cache_buster = random.randint(1, 999999)
    return redirect(url_for("deck_bp.view_decks") + "?v=" + str(cache_buster))


@app.route("/testing1", methods=["GET", "POST"])
def testing1():
    """test page"""
    return render_template("testing1.html")


@app.route("/update_sidebar_state", methods=["POST"])
def update_sidebar_state():
    """Toggle side bar state"""
    is_collapsed = request.form.get("sidebar-collapsed") == "true"
    session["sidebar-collapsed"] = is_collapsed
    return "", 204  # return 204 No Content response


@app.route("/landingpage", methods=["GET", "POST"])
def landingpage():
    """landing page, deprecated"""
    return render_template("landingpage.html", title="Landing Page")


def notify(user_id):
    ## find unnotified jobs
    if jobs := find_unnotified_jobs(user_id):
        ## send notification
        for job in jobs:
            if current_user.contacted_email is True:  # type: ignore
                send_email(current_user.email, current_user.first_name, "deck_ready")
            ## mark job as notified
            job.notified = True
            db.session.commit()
    return True


def find_unnotified_jobs(user_id: int) -> list[JobNotification]:
    return JobNotification.query.filter_by(
        user_id=user_id, complete=True, notified=False
    ).all()


## Look through Job Notification, find items that are not completed for each user
def find_non_complete_job_notifs(user_id: int) -> list[JobNotification]:
    return JobNotification.query.filter_by(user_id=user_id, complete=False).all()


## If not complete


## Look through jobs for that notification and check if jobs are completed
def find_jobs_by_slug(slug: str):
    return Job.query.filter_by(slug=slug).order_by(Job.id.asc()).all()


def check_jobs_complete(jobs: list[Job]) -> bool:
    counter = 0
    for job in jobs:
        if job.state == "completed":
            counter = counter + 1
    return counter == len(jobs)


def job_error_checker(slug: str) -> bool:
    error_ratio = check_for_errors(slug)
    if error_ratio > 0:
        job_notification = JobNotification.query.filter_by(slug=slug).first()
        credit = (
            current_user.remaining_credit() * TOKENS_PER_PAGE
            + job_notification.cost
            + (TOKENS_PER_PAGE * 10)
        )
        new_usage_record = UsageRecord(
            user_id=job_notification.user_id,
            date=dt.datetime.now(dt.timezone.utc),
            operation_type="credit",
            operation_details="credit for job error",
            operation_count=0,
            remaining_count=credit,
            status="active",
            time_period="month",
            limit_count=credit,
        )
        db.session.add(new_usage_record)
        db.session.commit()
        return True
    else:
        return False


def check_for_errors(slug: str) -> float:
    jobs = find_jobs_by_slug(slug)
    error_count = 0
    for job in jobs:
        if job.error_type == "error":
            error_count = error_count + 1
            job.error_type = "error_returned"
        db.session.commit()
    return error_count / len(jobs)


@app.route("/query", methods=["POST"])
# @auth_required
def query():
    progress = 0
    job_id = request.form["id"]
    data = Job.query.filter_by(slug=job_id).first()
    num_completed = (
        Job.query.filter_by(slug=job_id)
        .filter(Job.state.in_(["completed", "failed"]))
        .count()
    )
    num_total = Job.query.filter_by(slug=job_id).count()
    slug = JobNotification.query.filter_by(slug=job_id).first()
    if num_total != 0:
        progress = int(num_completed / num_total * 95)
    if data is None:
        return jsonify({"state": None, "progress": None, "result": None}), 201
    else:
        return (
            jsonify(
                {
                    "state": data.state,
                    "progress": progress,
                    "result": slug.state,
                }
            ),
            201,
        )


@app.route("/has-session-notification", methods=["GET"])
# @auth_required
def has_session():
    if "slug" in session:
        return jsonify({"hasSession": True})
    else:
        return jsonify({"hasSession": False})


@app.route("/notification_complete", methods=["POST"])
# @auth_required
def notification_complete():
    slug_id = request.form["id"]
    slug = JobNotification.query.filter_by(slug=slug_id).first()
    session.pop("slug", None)

    if job_error_checker(slug.slug):
        slug.state = "error"
        db.session.commit()
        return jsonify("error"), 201
    if slug.state == "ready":
        session.pop("slug", None)
        slug.state = "notified"
        db.session.commit()
        try:
            send_email(current_user.email, current_user.first_name, "deck_ready")
        except Exception as e:
            logger.error("error sending email", e)
        return jsonify("success"), 201


def create_assessment(
    project_id: str, recaptcha_site_key: str, token: str, recaptcha_action: str
) -> Assessment:
    """Create an assessment to analyze the risk of a UI action.
    Args:
        project_id: GCloud Project ID
        recaptcha_site_key: Site key obtained by registering a domain/app to use recaptcha services.
        token: The token obtained from the client on passing the recaptchaSiteKey.
        recaptcha_action: Action name corresponding to the token.
    """

    client = recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient()

    # Set the properties of the event to be tracked.
    event = recaptchaenterprise_v1.Event()
    event.site_key = recaptcha_site_key
    event.token = token

    assessment = recaptchaenterprise_v1.Assessment()
    assessment.event = event

    project_name = f"projects/{project_id}"

    # Build the assessment request.
    request = recaptchaenterprise_v1.CreateAssessmentRequest()
    request.assessment = assessment
    request.parent = project_name

    response = client.create_assessment(request)

    # Check if the token is valid.
    if not response.token_properties.valid:
        print(
            "The CreateAssessment call failed because the token was "
            + "invalid for for the following reasons: "
            + str(response.token_properties.invalid_reason)
        )
        return

    # Check if the expected action was executed.
    if response.token_properties.action != recaptcha_action:
        print(
            "The action attribute in your reCAPTCHA tag does"
            + "not match the action you are expecting to score"
        )
        return
    else:
        # Get the risk score and the reason(s)
        # For more information on interpreting the assessment,
        # see: https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
        for reason in response.risk_analysis.reasons:
            print(reason)
        print(
            "The reCAPTCHA score for this token is: "
            + str(response.risk_analysis.score)
        )
        # Get the assessment name (id). Use this to annotate the assessment.
        assessment_name = client.parse_assessment_path(response.name).get("assessment")
        print(f"Assessment name: {assessment_name}")
    return response


if __name__ == "__main__":
    print("app is main")
    socketio.run(app)

else:
    print("app is being imported")


##objgraph.show_growth()

##@app.after_request
##def analyze_memory(response):
##  objgraph.show_most_common_types(limit=10)
##  objgraph.show_growth()

## return response
