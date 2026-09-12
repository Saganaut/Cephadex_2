import logging

from fastapi import APIRouter, HTTPException
from sqlalchemy.future import select

from dependencies.db import GetDb
from dependencies.posthog import GetPostHog
from dependencies.user_dependencies import CurrentUser
from models.models_ import (
    Question,
    Test,
    questions,
)
from models.quiz.quiz_manager import QuizManager
from routes.data_classes.quiz_schema import (
    NewQuizRequest,
    QuestionRequestSchema,
    QuestionSchema,
    QuizDataResponse,
    QuizRequestSchema,
    QuizSchema,
)
from routes.data_classes.request import IdListRequest
from routes.data_classes.response import (
    StandardApiResponse,
    ToggleResponseModel,
)

main_quiz_router = APIRouter()
logger = logging.getLogger("App")


@main_quiz_router.get("/created", response_model=QuizDataResponse, tags=["quiz"])
async def get_all_created_quizzes(db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Return all quizzes CREATED by a user"""
    query = await db.execute(select(Test).where(Test.creator == user.id))
    results = query.scalars().all()
    if results is None:
        return {
            "status": "success",
            "message": "No quizzes to retrieve",
            "quizzes": None,
        }
    quizzes = []
    for quiz in results:
        quiz_data = QuizSchema.model_validate(quiz.to_dict())
        quizzes.append(quiz_data)

    return {
        "status": "success",
        "message": "Quizzes retrieved",
        "quizzes": quizzes,
        "questions": [],
    }


@main_quiz_router.post(
    "/{quiz_id}/favorite",
    response_model=ToggleResponseModel,
    tags=["quiz"],
)
async def toggle_favorite_quiz(quiz_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Toggles .fav on a quiz"""
    quiz = await QuizManager.retrieve_quiz_and_load_takers(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user, "creator")
    if quiz.fav:
        quiz.fav = False
    else:
        quiz.fav = True
    await db.commit()
    return {"status": "success", "message": "quiz fav toggled", "favorite": quiz.fav}


## TODO Right now this just deletes the link between the quiz
# and the question, but the question remains in the db
# TODO THe issue is htat quiz results might also depend
# on the question so we need to figure out how to handle that
@main_quiz_router.delete(
    "/{quiz_id}/question/{question_id}",
    response_model=StandardApiResponse,
    tags=["quiz"],
)
async def delete_quiz_question(  # noqa: ANN201
    quiz_id: int,
    question_id: int,
    db: GetDb,
    user: CurrentUser,
):
    """Deletes a question from a quiz - this route still has some issues"""
    quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user, "creator")
    if question_id not in [question.id for question in quiz.questions]:
        raise HTTPException(status_code=404, detail="Question not found")
    try:
        result = await db.execute(select(Question).where(Question.id == question_id))
    except Exception:
        logger.exception("An error occurred: when deleting a question from a quiz")
    question = result.scalar()
    if question is not None:
        question = await db.execute(
            questions.delete().where(questions.c.question_id == question.id),
        )
    await db.commit()
    return {"status": "success", "message": "Question deleted"}


@main_quiz_router.delete(
    "/{quiz_id}",
    response_model=StandardApiResponse,
    tags=["quiz"],
)
async def delete_quiz(quiz_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Deletes a quiz"""
    quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user, "creator")
    await db.delete(quiz)
    await db.commit()
    return {"status": "success", "message": "Quiz deleted"}


@main_quiz_router.post("/new", response_model=QuizDataResponse, tags=["quiz"])
async def create_new_quiz(  # noqa: ANN201
    request: NewQuizRequest,
    db: GetDb,
    user: CurrentUser,
    posthog: GetPostHog,
):
    """Creates a new quiz, jeopardy option now moved to front end.  So if jeopardy option is
    selected
    then the back of card becomes the question and the front of card becomes the answer.
    This is not available
    for MCQ or other types of questions with more than one boc value
    Only include relevant values for quiz, do not include timeCreated, the db will handle that
    Make sure that deckId
    """
    try:
        new_quiz = await QuizManager.create_new_quiz(db, user, request.quiz)
        await db.flush()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid quiz data") from e
    if new_quiz is None:
        raise HTTPException(status_code=400, detail="Invalid quiz data")
    new_quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(
        db,
        new_quiz.id,
    )
    await QuizManager.add_questions_to_quiz(db, new_quiz, request.questions)
    await db.commit()
    # questions_data = []
    # for question in new_quiz.questions:
    #     questions_data.append(QuestionSchema.model_validate(question.to_dict()))
    quiz_data = QuizSchema.model_validate(new_quiz.to_dict())

    questions_data = [
        QuestionSchema.model_validate(question.to_dict()) for question in new_quiz.questions
    ]
    posthog.capture(
        user.id,
        "create_quiz",
        {
            "quiz_id": new_quiz.id,
            "qty_questions": len(new_quiz.questions),
        },
    )
    return {
        "status": "success",
        "message": "Quiz created",
        "quizzes": [quiz_data],
        "questions": questions_data,
    }


@main_quiz_router.patch(
    "/{quiz_id}/question/{question_id}",
    response_model=StandardApiResponse,
    tags=["quiz"],
)
async def update_one_question(  # noqa: ANN201
    quiz_id: int,
    question_id: int,
    request: QuestionSchema,
    db: GetDb,
    user: CurrentUser,
):
    quiz = await QuizManager.retrieve_quiz_and_load_questions(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user, "creator")
    question = await QuizManager.retrieve_question_by_id(db, question_id)
    QuizManager.update_question(question, request)
    await db.commit()
    return {"status": "success", "message": "Question updated"}


@main_quiz_router.post(
    "/{quiz_id}/question/new",
    response_model=StandardApiResponse,
    tags=["quiz"],
)
async def add_question_to_quiz(  # noqa: ANN201
    quiz_id: int,
    request: QuestionRequestSchema,
    db: GetDb,
    user: CurrentUser,
):
    quiz = await QuizManager.retrieve_quiz_and_load_questions(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user, "creator")
    new_question = await QuizManager.create_new_question(db, request)
    await QuizManager.add_question_to_quiz(quiz, new_question)

    await db.commit()
    return {"status": "success", "message": "Question added"}


@main_quiz_router.put("/{quiz_id}", response_model=QuizDataResponse, tags=["quiz"])
async def update_quiz(  # noqa: ANN201
    request: QuizRequestSchema,
    quiz_id: int,
    db: GetDb,
    user: CurrentUser,
):
    quiz = await QuizManager.retrieve_quiz_and_load_questions(db, quiz_id)

    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    if quiz.creator != user.id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to modify this quiz",
        )

    QuizManager.update_quiz_data(quiz, request)
    if request.questions:
        new_questions, _ = QuizManager.update_questions(quiz, request.questions)
        for question in new_questions:
            db.add(question)
    await db.flush()

    QuizManager.count_questions(quiz)

    QuizManager.sum_points(quiz)

    await db.commit()
    quiz_data = quiz.to_dict()
    list_questions = [
        QuestionSchema.model_validate(question.to_dict()) for question in quiz.questions
    ]
    return {
        "status": "success",
        "message": "Quiz updated",
        "quizzes": [quiz_data],
        "questions": list_questions,
    }


@main_quiz_router.delete(
    "/{quiz_id}/questions",
    response_model=StandardApiResponse,
    tags=["quiz"],
)
async def delete_questions_from_quiz(  # noqa: ANN201
    quiz_id: int,
    request: IdListRequest,
    db: GetDb,
    user: CurrentUser,
):
    quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user, "creator")
    for question_id in request.ids:
        result = await db.execute(select(Question).where(Question.id == question_id))
        question = result.scalar()
        if question is not None:
            await db.delete(question)
    await db.commit()
    return {"status": "success", "message": "Questions deleted from quiz"}


## TODO: we need to implement checks so that only the creator of the quiz can take the quiz
@main_quiz_router.get("/{quiz_id}", response_model=QuizDataResponse, tags=["quiz"])
async def get_quiz_and_questions(quiz_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user)
    # quiz_questions = []
    # for question in quiz.questions:
    #     quiz_questions.append(question.to_dict())
    quiz_questions = [question.to_dict() for question in quiz.questions]
    quiz_dict = quiz.to_dict()
    return {
        "status": "success",
        "message": "Quiz retrieved",
        "quizzes": [quiz_dict],
        "questions": quiz_questions,
    }


# @main_quiz_router.get("/{quiz_id}/pdf", tags=["quiz"])
# async def download_quiz_as_pdf(
#     quiz_id: int,
#     db: GetDb,
#     user: CurrentUser,
#     settings: Settings = Depends(get_settings),
# ):
#     quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(db, quiz_id)
#     QuizManager.check_permission_quiz(quiz, user)
#     quiz_url = f"{settings.app.front_end_url}/quiz/{quiz_id}"
#     pdf_content = await Helpers.generate_pdf_from_html(quiz_url)
#     headers = {
#         "Content-Type": "application/pdf",
#         "Content-Disposition": f"attachment; filename=output_{quiz_id}.pdf",
#     }
#     return Response(content=pdf_content, media_type="application/pdf", headers=headers)
