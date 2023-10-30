from datetime import datetime
import datetime as dt
from urllib.parse import unquote
import difflib
from io import BytesIO
import requests as req
from urllib.parse import urljoin
import xhtml2pdf.pisa as pisa
import random
import uuid
import logging
from flask import (
    Blueprint,
    render_template,
    url_for,
    make_response,
    flash,
    redirect,
    request,
    jsonify,
    session,
)

####from cardcreator import create_image, creator
from bleach import clean

from models.creators.formatters import check_comma_list
from models.helpers.helpers import remove_punctuation
from models.tracking.events import event_tracker
from models.qr_code import create_qr_code

from models.models_ import (
    QuestionResult,
    Question,
    Test,
    TestResult,
    User,
    questions,
    distribution,
    cards,
    UserSettings,
    Deck,
    Card,
)

from run.extensions import db
from tools.lists import TEST_NAMES
from config.settings import APP_URL
from sqlalchemy import distinct

from models.helpers.log_decorators import log_decorator
from flask_login import login_user, logout_user, current_user

logger = logging.getLogger("flask_app")

quiz_bp = Blueprint(
    "quiz_bp", __name__, template_folder="templates/quiz_bp", static_folder="static"
)


@quiz_bp.route("/api_0/quizzes", methods=["GET"])
@log_decorator
def get_quizzes():
    query = Test.query.filter(Test.taker.contains(current_user)).all()
    quizzes = []
    for quiz in query:
        quizzes.append(quiz.to_dict())
    return jsonify({"status": "success", "quizzes": quizzes}), 200


## make quiz favorite


@quiz_bp.route("/api_0/quiz/<int:quiz_id>/favorite", methods=["POST"])
@log_decorator
def make_quiz_favorite(quiz_id):
    quiz = Test.query.get_or_404(quiz_id)
    if current_user.id != quiz.taker:
        return jsonify({"error": "Quiz not assigned to user"}), 403
    quiz.fav = True
    db.session.commit()
    return jsonify({"status": "success", "message": "Quiz favourited"}), 200


## unfavorite quiz
@quiz_bp.route("/api_0/quiz/<int:quiz_id>/favorite", methods=["DELETE"])
@log_decorator
def make_quiz_unfavorite(quiz_id):
    quiz = Test.query.get_or_404(quiz_id)
    if current_user.id != quiz.taker:
        return jsonify({"error": "Quiz not assigned to user"}), 403
    quiz.fav = False
    db.session.commit()
    return jsonify({"status": "success", "message": "Quiz unfavourited"}), 200


@quiz_bp.route("/update_card", methods=["POST"])
@log_decorator
def update_card():
    data = request.get_json()
    question_id = data["question-id"]
    question = Question.query.filter_by(id=question_id).first_or_404()
    try:
        if data["question"] != "":
            question.question = clean(data["question"])
        if data["answer"] != "":
            question.term = clean(data["answer"])
        if data["answer"] != "":
            question.content = clean(data["answer"])
        if data["points"] != "":
            question.points = data["points"]
        # Handle multiple choice options
        if question.q_type == "mcq":
            if data["boc_2"] != "":
                question.boc_2 = clean(data["boc_2"])
            if data["boc_3"] != "":
                question.boc_3 = clean(data["boc_3"])
            if data["boc_4"] != "":
                question.boc_4 = clean(data["boc_4"])
        db.session.flush()
        db.session.commit()
        return jsonify(success=True)
    except Exception as e:
        logger.error(f"Quiz - Error in updating quiz card {e}")
        raise e
    ## TO DO how to handle htis, was it necessary?
    # finally:
    #     return jsonify(success=False, error=str(e))


@quiz_bp.route("/quiz/<int:quiz_id>/download")
@log_decorator
def download(quiz_id):
    # Get HTML content
    quiz_url = url_for("quiz_print", quiz_id=quiz_id, _external=True)
    response = req.get(quiz_url)
    html_content = response.content

    # Create a pdf buffer
    pdf = BytesIO()

    # Define the link fetcher
    def fetch_resources(uri, rel):
        # Here the base URL should be the URL to the quiz_print page
        return req.get(urljoin(quiz_url, uri)).content

    # Then pass that HTML to CreatePDF
    pisa.CreatePDF(BytesIO(html_content), pdf, link_callback=fetch_resources)

    return make_response(
        pdf.getvalue(),
        200,
        {
            "Content-Type": "quiz_bplication/pdf",
            "Content-Disposition": "attachment; filename=output.pdf",
        },
    )


@quiz_bp.route("/quiz/<int:quiz_id>/question/<int:question_id>", methods=["DELETE"])
@log_decorator
def delete_question(quiz_id, question_id):
    question_to_delete = Question.query.get_or_404(question_id)
    db.session.execute(questions.delete().where(questions.c.question_id == question_id))
    db.session.delete(question_to_delete)
    db.session.commit()
    return redirect(("/quiz_bp/assign_quiz/{quiz_id}".format(quiz_id=quiz_id)))


@quiz_bp.route("/quiz/<int:quiz_id>/", methods=["DELETE"])
@log_decorator
def delete_quiz(quiz_id):
    c_quiz_id = quiz_id
    quiz_to_delete = Test.query.get_or_404(c_quiz_id)
    if current_user.id == quiz_to_delete.creator:
        db.session.delete(quiz_to_delete)
        db.session.commit()
    return redirect("/quiz_bp/quiz_overview/")


### whats this one for?
@quiz_bp.route("/start_new_quiz", methods=["POST"])
def start_new_quiz():
    if "selected_cards" in session:
        del session["selected_cards"]
    return jsonify({"status": "success", "message": "Session cleared"})


### whats this one for?
@quiz_bp.route("/build_quiz_update_session", methods=["POST"])
def update_session():
    card_id = request.args.get("card_id")
    is_checked = request.args.get("is_checked") == "true"

    if "selected_cards" not in session:
        session["selected_cards"] = []

    if is_checked:
        session["selected_cards"].append(card_id)
    else:
        session["selected_cards"].remove(card_id)
    session.modified = True
    return jsonify(success=True)


@quiz_bp.route("/quiz_bp/api_0/quiz/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id):
    quiz = Test.query.get_or_404(quiz_id)
    if current_user.id not in [quiz.taker, quiz.creator]:
        return jsonify({"status": "error", "message": "User not authorized"}), 403
    quiz_questions = []
    for question in quiz.questions:
        quiz_questions.append(question.to_dict())
    return jsonify(
        {
            "status": "success",
            "message": "Quiz retrieved succesfully",
            "quiz": quiz.to_dict(),
            "questions": quiz_questions,
        }
    )


@quiz_bp.route("/quiz_bp/api_0/shared_quiz/<int:quiz_id>", methods=["GET"])
def get_shared_quiz(shared_quiz_id):
    quiz = Test.query.filter_by(share_id=shared_quiz_id)
    quiz_questions = []
    for question in quiz.questions:
        quiz_questions.append(question.to_dict())
    return jsonify(
        {
            "status": "success",
            "message": "Quiz retrieved succesfully",
            "quiz": quiz.to_dict(),
            "questions": quiz_questions,
        }
    )


@quiz_bp.route("/quiz_bp/api_0/quiz", methods=["POST"])
def make_new_quiz():
    try:
        data = request.get_json(silent=True)
        quiz_name = data["quiz_name"]
        if quiz_name == "":
            quiz_name = random.choice(TEST_NAMES)
        quiz_questions = data["quiz_questions"]
        deck_id = data["deck_id"]
        jeopardy_mode = data["jeopardyMode"]
        new_quiz = Test(creator=current_user.id, deck_id=deck_id, name=quiz_name)
        db.session.add(new_quiz)
        for question in quiz_questions:
            add_question_to_quiz(question, new_quiz, jeopardy_mode)
        db.session.commit()
        return jsonify(
            {"status": "success", "message": "Quiz created", "quiz": new_quiz.to_dict()}
        )
    except Exception as e:
        logger.error(f"Quiz - Error in creating quiz {e}")
        return jsonify({"status": "error", "message": str(e)})


def add_question_to_quiz(card, new_quiz, jeopardyMode):
    question = Question()
    db.session.add(question)
    question.points = card["points"]
    question.content = card["content"]
    question.term = card["term"]
    question.prompt_option = card["prompt_option"]
    # Mapping the card categories to question types
    category_to_q_type = {
        "Mcq": "mcq",
        "Cloze": "cloze",
        "Explain": "explain",
        "Formulas": "formulas",
        "Discuss": "discuss",
        "Definitions": "jeopardy" if jeopardyMode == "on" else "definitions",
    }
    question.q_type = category_to_q_type.get(card["category"], "other")
    if card["category "] == "Mcq":
        question.question = card["term"]
        question.boc_2 = card["boc_2"]
        question.boc_3 = card["boc_3"]
        question.boc_4 = card["boc_4"]
    elif card.category == "Cloze":
        question.question = card["term"]
    elif card.category == "Explain":
        question.question = card["term"]
    elif card.category == "Formulas":
        question.question = card["term"]
        question.term = card.formula
    elif card.category == "Discuss":
        question.question = card["term"]
        question.boc_2 = card.boc_2
    elif card.category == "Definitions":
        ## switching them around so that the quiz gives them a definition and they have to write the word
        if jeopardyMode == "on":
            question.question = card["content"]
            question.term = card["term"]
        else:
            question.question = card["term"]
    else:
        question.question = card["term"]
    new_quiz.questions.append(question)


## edit quiz
@quiz_bp.route("/quiz_bp/api_0/quiz/<int:quiz_id>/", methods=["PUT"])
def edit_quiz(quiz_id):
    quiz = Test.query.get_or_404(quiz_id)
    if current_user.id != quiz.creator:
        return jsonify(
            {"status": "error", "message": "You are not the creator of this quiz"}
        )
    try:
        data = request.get_json(silent=True)
        attributes = [
            "quiz_name",
            "category",
            "subject",
            "topic",
            "due_date",
            "time_limit",
            "result_reveal",
            "answer_reveal",
            "instructions",
            "description",
            "shuffle",
        ]
        for attr in attributes:
            value = data.get(attr)
            if value:
                setattr(quiz, attr, value)
        quiz.count_questions()
        quiz.sum_points()
        db.session.commit()
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Quiz updated successfully",
                    "quiz": quiz.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"Quiz - Error in editing quiz {e}")
        return jsonify({"status": "error", "message": str(e)})


## TO DO: rework this so it doesn't throw an exception when it doesn't find a user, bad practice


### Move to front end - create a check to see whats in the session
@quiz_bp.route("/shared_quiz_view/<string:share_id>", methods=["GET"])
@log_decorator
def shared_quiz_view(share_id):
    quiz = Test.query.filter_by(share_id=share_id).first_or_404()
    session["shared_quiz_id"] = share_id
    if not current_user.is_authenticated:
        return render_template("/quiz_bp/shared_quiz_view.html", quiz=quiz)
    else:
        return redirect(f"/quiz_bp/take_quiz/{quiz.id}/{current_user.id}")


@quiz_bp.route("/api_0/quiz/<int:quiz_id>/link", methods=["GET"])
@log_decorator
def generate_link_quiz(quiz_id):
    quiz = Test.query.get(quiz_id)
    if quiz.share_id:
        link = f"{APP_URL}/quiz_bp/shared_quiz_view/{quiz.share_id}"
        img_str = create_qr_code(link)
        return jsonify(
            {
                "share_link": f"{APP_URL}/quiz_bp/shared_quiz_view/{quiz.share_id}",
                "qr_code": img_str,
            }
        )
    else:
        share_id = str(uuid.uuid4())
        quiz.share_id = share_id
        db.session.commit()
        link = f"{APP_URL}/quiz_bp/shared_quiz_view/{quiz.share_id}"

        img_str = create_qr_code(link)

        return jsonify(
            {
                "share_link": f"{APP_URL}/quiz_bp/shared_quiz_view/{share_id}",
                "qr_code": img_str,
            }
        )


@quiz_bp.route("/api_0/quiz/<int:quiz_id>/assign", methods=["POST"])
@log_decorator
def assign(quiz_id):
    data = request.get_json(silent=True)
    user_email = data["user_email"]
    c_user_email = clean(user_email)
    quiz = Test.query.filter_by(id=quiz_id).first()
    if current_user.id != quiz.creator:
        return jsonify(
            {"status": "error", "message": "You are not the creator of this quiz"}
        )
    not_users = []
    if check_comma_list(c_user_email):
        users_emails = user_email.split(",")
        for email in users_emails:
            email = unquote(email).strip()
            taker = User.query.filter_by(email=email).first()
            if taker is None:
                not_users.append(email)
            else:
                quiz.taker.append(taker)
    else:
        email = unquote(c_user_email)
        taker = User.query.filter_by(email=email).first()
        if taker is None:
            not_users.append(email)
        else:
            quiz.taker.append(taker)
    db.session.commit()
    if not not_users:
        return (
            jsonify({"status": "success", "message": "Users assigned successfully"}),
            200,
        )
    else:
        return (
            jsonify(
                {"status": "fail", "message": "Users not found", "users": not_users}
            ),
            200,
        )


@quiz_bp.route(
    "/api_0/quiz/<int:quiz_id>/result", methods=["POST"], defaults={"share_id": None}
)
@quiz_bp.route(
    "/api_0/quiz/shared/<share_id>/result", methods=["POST"], defaults={"quiz_id": None}
)
@log_decorator
def take_quiz(quiz_id=None, share_id=None):
    try:
        if share_id:
            quiz = Test.query.filter_by(share_id=share_id).first_or_404()
        else:
            quiz = Test.query.get_or_404(quiz_id)

        data = request.get_json()

        if not current_user:
            user = None
        else:
            user = current_user.id
        start_time = dt.datetime.strptime(data["start_time"], "%Y-%m-%dT%H:%M:%S.%fZ")
        quiz_result = TestResult(
            test_id=quiz.id if quiz else quiz_id,
            taker=user,
            start_time=start_time,
            creator=quiz.creator if quiz else None,
        )
        db.session.add(quiz_result)
        db.session.flush()
        for question in quiz.questions:
            answer = data.get(f"answer{question.id}", "").strip()
            result = QuestionResult(
                test_id=quiz.id,
                taker=user,
                question_id=question.id,
                answer=answer,
                quiz_result_id=quiz_result.id,
            )
            db.session.add(result)

        end_time = dt.datetime.strptime(data["end_time"], "%Y-%m-%dT%H:%M:%S.%fZ")
        quiz_result.end_time = end_time

        db.session.commit()

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Quiz taken successfully",
                    "quiz_result_id": quiz_result.id,
                }
            ),
            200,
        )

    except Exception as e:
        logger.error("There was an error submitting quiz results", e)
        return {"error": "There was an error submitting quiz results"}, 400


@quiz_bp.route("/api_0/quiz/<int:quiz_id>/assigned_quiz", methods=["DELETE"])
@log_decorator
def reject_quiz(quiz_id):
    try:
        user_id = current_user.id
        distribution_entry = distribution.delete().where(
            (distribution.c.test_id == quiz_id) & (distribution.c.taker_id == user_id)
        )
        db.session.execute(distribution_entry)
        db.session.commit()
        return jsonify({"message": "Quiz deleted successfully"}), 200
    except:
        logger.error("There was an error rejecting the quiz")
        return jsonify({"message": "There was an error rejecting the quiz"}), 400


def calculate_points(answer_given, answer_expected):
    answer_given = remove_punctuation(answer_given).lower().strip()
    answer_expected = remove_punctuation(answer_expected).lower().strip()
    matcher = difflib.SequenceMatcher(None, answer_given, answer_expected)
    return matcher.ratio()


## if quiz is ungraded grades it, otherwise returns a dict with results
def grade_quiz(quiz, quiz_result, n=0.9):
    point_counter = 0
    correct_counter = 0
    graded_results = []
    if not quiz_result.graded:
        for question in quiz.questions:
            correct = False
            answer = QuestionResult.query.filter_by(
                quiz_result_id=quiz_result.id, question_id=question.id
            ).first()
            if answer and answer.answer:
                answer_given = answer.answer
                answer_expected = (
                    question.term if question.q_type == "jeopardy" else question.content
                )
                if calculate_points(answer_given, answer_expected) > n:
                    point_counter += question.points
                    correct_counter += 1
                    answer.points = int(question.points)
                    answer.correct = True
                else:
                    answer.points = 0

            graded_results.append(
                {
                    "question": question.to_dict(),
                    "result": answer.to_dict(),
                    "correct": correct,
                }
            )
        quiz_result.points = point_counter
        quiz_result.correct = correct_counter
        quiz_result.graded = True
        db.session.commit()

    else:
        for question in quiz.questions:
            answer = QuestionResult.query.filter_by(
                quiz_result_id=quiz_result.id, question_id=question.id
            ).first()
            graded_results.append(
                {
                    "question": question.to_dict(),
                    "result": answer.to_dict(),
                    "correct": answer.correct,
                }
            )
        correct_counter = quiz.correct
        point_counter = quiz.points

    return point_counter, correct_counter, graded_results


@quiz_bp.route("/api_0/quiz_result/<int:quiz_result_id>/", methods=["GET"])
@log_decorator
def quiz_result(quiz_result_id):
    try:
        quiz_result = TestResult.query.filter_by(id=quiz_result_id).first()
        quiz = Test.query.get_or_404(quiz_result.test_id)
        if quiz_result.taker == None:
            taker = "guest"
            session["quiz_result_id"] = quiz_result_id
            if session.get("shared_quiz_id"):
                del session["shared_quiz_id"]
        else:
            if current_user.id not in [quiz_result.taker, quiz_result.creator]:
                return (
                    jsonify(
                        {
                            "status": "fail",
                            "message": "You do not have permission to view this quiz result",
                        }
                    ),
                    200,
                )

        point_counter, correct_counter, graded_results = grade_quiz(quiz, quiz_result)
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "quiz results retrieved succesfully",
                    "quiz_result_id": quiz_result_id,
                    "quiz_id": quiz.id,
                    "taker": taker,
                    "points": point_counter,
                    "correct": correct_counter,
                    "results": graded_results,
                }
            ),
            200,
        )
    except Exception as e:
        logger.error("There was an issue retrieving quiz results")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "There was an issue retrieving quiz results",
                }
            ),
            400,
        )


@quiz_bp.route("/quiz_bp/api_0/quiz_result/my_results/", methods=["GET"])
def my_results():
    query = TestResult.query.filter_by(taker=current_user.id).all()
    quiz_results_taken = []
    for result in query:
        quiz = Test.query.filter_by(id=result.test_id).first()
        quiz_results_taken.append(
            {
                "quiz_name": quiz.name,
                "quiz": quiz.to_dict(),
                "results": result.to_dict(),
            }
        )
    return (
        jsonify(
            {
                "status": "success",
                "message": "Your results have been retrieved",
                "results": quiz_results_taken,
            }
        ),
        200,
    )


@quiz_bp.route("/quiz_bp/api_0/quiz_result/my_students_results/", methods=["GET"])
def my_students_results():
    query = TestResult.query.filter_by(creator=current_user.id).all()
    quiz_results_given = []
    for result in query:
        quiz = Test.query.filter_by(id=result.test_id).first()
        ## if the quiz has been deleted and there are no quiz takers, delete the result
        if not quiz and not result.taker:
            db.session.delete(result)
            db.session.commit()
        else:
            quiz_results_given.append(
                {
                    "quiz_name": quiz.name,
                    "quiz": quiz.to_dict(),
                    "results": result.to_dict(),
                }
            )


####  Needed?
@quiz_bp.route("/quiz_result_details/<int:quiz_id>/", methods=["GET", "POST"])
@log_decorator
def quiz_result_details(quiz_id):
    quiz = Test.query.filter_by(id=quiz_id).first()
    if quiz.creator != current_user.id:
        flash("Only the creator of the quiz can access this page", "failure")
        return redirect(url_for("quiz_bp.quiz_overview"))
    page = request.args.get("page", 1, type=int)
    per_page = 10
    results = TestResult.query.filter_by(test_id=quiz_id).all()
    my_students_results = []
    for result in results:
        taker = User.query.filter_by(id=result.taker).first()
        my_students_results.append({"result": result, "taker": taker})
    quiz = Test.query.filter_by(id=quiz_id).first()
    # Get the list of taker ids from the TestResult objects
    taker_ids = [result.taker for result in results]
    # Filter the User objects by the taker ids
    takers = User.query.filter(User.id.in_(taker_ids)).all()
    my_students_results_paginated = Pagination(my_students_results, page, per_page)

    return render_template(
        "quiz_bp/quiz_result_details.html",
        results=my_students_results_paginated,
        quiz=quiz,
        page=page,
        per_page=per_page,
    )


@quiz_bp.route("/quiz_answers/<int:result_id>/", methods=["GET", "POST"])
@log_decorator
def quiz_answers(result_id):  #
    result = TestResult.query.filter_by(id=result_id).first()
    if result.creator != current_user.id:
        flash("you are not allowed to view this page", "danger")
        return redirect("/quiz_bp/quiz_overview/")
    page = request.args.get("page", 1, type=int)
    per_page = 10
    students_results = []
    question_results = QuestionResult.query.filter_by(quiz_result_id=result.id).all()
    for results in question_results:
        question = Question.query.filter_by(id=results.question_id).first()
        students_results.append({"question": question, "result": results})

    paginated_students_results = Pagination(students_results, page, per_page)
    quiz = Test.query.filter_by(id=result.test_id).first()
    taker = User.query.filter_by(id=result.taker).first()
    question_points_map = {question.id: question.points for question in quiz.questions}

    if request.method == "POST":
        for question_result in question_results:
            question_points_id = "points" + str(question_result.id)

            points_entered = request.form.get(question_points_id)
            if points_entered is not None and points_entered != "None":
                question_result.points = int(points_entered)
                correct_points = question_points_map.get(question_result.question_id)
                if points_entered == correct_points:
                    question_result.correct = True
        result.sum_points()
        db.session.commit()
    return render_template(
        "quiz_bp/quiz_answers.html",
        results=paginated_students_results,
        result=result,
        question_results=question_results,
        quiz=quiz,
        taker=taker,
    )


@quiz_bp.route("/answer_key/<int:quiz_id>/", methods=["GET", "POST"])
@log_decorator
def quiz_print(quiz_id):
    c_quiz_id = quiz_id
    quiz = Test.query.filter_by(id=c_quiz_id).first()
    return render_template("quiz_bp/answer_key.html", quiz=quiz)


@quiz_bp.route("/quiz_print/<int:quiz_id>/", methods=["GET", "POST"])
@log_decorator
def answer_key(quiz_id):
    c_quiz_id = quiz_id
    quiz = Test.query.filter_by(id=c_quiz_id).first()
    return render_template("quiz_bp/quiz_print.html", quiz=quiz)


class Pagination:
    def __init__(self, items, page, per_page):
        self.items = items[(page - 1) * per_page : page * per_page]
        self.page = page
        self.per_page = per_page
        self.total = len(items)
        self.pages = self.total // per_page + (1 if self.total % per_page else 0)

    def has_prev(self):
        return self.page > 1

    def has_next(self):
        return self.page < self.pages

    def iter_pages(self, left_edge=2, right_edge=2, left_current=5, right_current=5):
        last_item = 0
        for num in range(1, self.pages + 1):
            if (
                (num <= left_edge)
                or (num > self.pages - right_edge)
                or (
                    (num >= self.page - left_current)
                    and (num <= self.page + right_current)
                )
            ):
                if last_item != num - 1:
                    yield None
                yield num
                last_item = num
