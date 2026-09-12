from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select

from config import Settings
from dependencies.db import GetDb
from dependencies.settings import get_settings
from dependencies.user_dependencies import CurrentUser, CurrentUserOrGuest
from models.models_ import (
    TestResult,
)
from models.quiz.quiz_manager import QuizManager
from models.user.user_manager import UserManager
from routes.data_classes.quiz_schema import (
    MyQuizResultsResponse,
    QuizResultDataResponse,
    QuizResultGradeRequest,
    QuizResultsResponseData,
    QuizSchema,
    SingleQuizResultResponse,
)
from routes.data_classes.response import StandardApiResponse

results_router = APIRouter()


## TODO some day this should be cleaned up and refactored
@results_router.get(
    "/result/{quiz_result_id}/",
    response_model=SingleQuizResultResponse,
    tags=["result"],
)
async def get_quiz_result(  # noqa: ANN201
    quiz_result_id: int,
    db: GetDb,
    user: CurrentUserOrGuest,
    user_id: Optional[int] = None,
    settings: Settings = Depends(get_settings),
):
    """Both grades a quiz if it is not graded and returns the quiz results
    not taker returns as a string instead of an int even though it corresponds to an id to allow
    for "guest" to take the quiz
    for users other than teh creator of the quiz a user_id should be passed in
    user_id: /quiz/result/182?user_id=123
    """
    if user == "guest":
        if user_id is not None:
            user = await UserManager.get_user_by_id(db, user_id)
            if user.guest is False:
                raise HTTPException(
                    status_code=403,
                    detail="Log in is required to view these results.",
                )
            if not user:
                raise HTTPException(
                    status_code=404,
                    detail="Unable to retrieve results - user ID and quiz result ID do not match.",
                )
        else:
            raise HTTPException(
                status_code=403,
                detail="Log in is required to view these results.",
            )

    result = await db.execute(select(TestResult).where(TestResult.id == quiz_result_id))

    quiz_result = result.scalar()
    if quiz_result is None:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    if user.id not in [quiz_result.taker, quiz_result.creator]:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to view these results.",
        )
    if quiz_result is None:
        raise HTTPException(status_code=404, detail="Quiz result not found")

    quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(
        db,
        quiz_result.test_id,
    )
    quiz_data = QuizSchema.model_validate(quiz.to_dict())

    taker = str(quiz_result.taker)
    (graded_results, result_data) = await QuizManager.process_grade_quiz(
        db,
        quiz,
        quiz_result,
        settings.quiz,
    )
    return {
        "status": "success",
        "message": "Quiz results retrieved",
        "quiz": quiz_data,
        "quiz_result": result_data,
        "taker": taker,
        "graded_results": graded_results,
        "user_type": "guest" if user.guest is True else "user",
        "user_id": user.id,
    }


@results_router.delete(
    "/result/{quiz_result_id}/",
    response_model=StandardApiResponse,
    tags=["result"],
)
async def delete_quiz_result(  # noqa: ANN201
    quiz_result_id: int,
    db: GetDb,
    user: CurrentUser,
):
    """Deletes a quiz result"""
    result = await db.execute(select(TestResult).where(TestResult.id == quiz_result_id))
    quiz_result = result.scalar()
    if quiz_result is None:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    if user.id not in [quiz_result.creator, quiz_result.taker]:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this result.",
        )
    await db.delete(quiz_result)
    await db.commit()
    return {
        "status": "success",
        "message": "Quiz result deleted",
    }


## TODO test this rouite fully once there are assigned results
@results_router.get(
    "/results/assigned-results",
    response_model=QuizResultsResponseData,
    tags=["result"],
)
async def get_assigned_results(db: GetDb, user: CurrentUser):  # noqa: ANN201
    """The results for all quizzes assigned by a user, basically a teachers students results"""
    quiz_results_taken = await QuizManager.get_results_for_quizzes_user_created(
        db,
        user.id,
    )
    return {
        "status": "success",
        "message": "Quiz results retrieved",
        "quiz_and_results": quiz_results_taken,
    }


@results_router.get(
    "/results/my-results",
    response_model=QuizResultsResponseData,
    tags=["result"],
)
async def get_my_results(db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Returns all quizzes taken by a user, results are a list of dicts, each dict has a quiz_name
    , quiz (quiz.to_dict(), and result (result.to_dict())
    """
    quiz_results_taken = await QuizManager.get_results_for_quizzes_user_took(
        db,
        user.id,
    )
    return {
        "status": "success",
        "message": "Quiz results retrieved",
        "quiz_and_results": quiz_results_taken,
    }


# TODO check if this works
# @results_router.get("/{quiz_id}/answer-key", tags=["quiz"])
# async def download_answer_key_as_pdf(
#     quiz_id: int,
#     db: GetDb,
#     user: CurrentUser,
#     settings: Settings = Depends(get_settings),
# ):
#     quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(db, quiz_id)
#     QuizManager.check_permission_quiz(quiz, user, role="creator")
#     quiz_url = f"{settings.app.front_end_url}/quiz/{quiz_id}/printable-answer-key"
#     pdf_content = await Helpers.generate_pdf_from_html(quiz_url)
#     headers = {
#         "Content-Type": "application/pdf",
#         "Content-Disposition": f"attachment; filename=answer_key_{quiz_id}.pdf",
#     }
#     return Response(content=pdf_content, media_type="application/pdf", headers=headers)


@results_router.post(
    "/{quiz_id}/result/{result_id}/grade",
    response_model=QuizResultDataResponse,
    tags=["quiz"],
)
async def grade_quiz_manually(  # noqa: ANN201
    quiz_id: int,
    result_id: int,
    request: QuizResultGradeRequest,
    db: GetDb,
    user: CurrentUser,
):
    quiz = await QuizManager.retrieve_quiz(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user, role="creator")
    quiz_result = await QuizManager.update_quiz_result(db, request.quiz_result)
    question_results = await QuizManager.update_questions_results(
        db,
        result_id,
        request.question_results,
    )
    await db.commit()
    quiz_result_dict = quiz_result.to_dict()
    # quiz_result_list = []
    # for result in question_results:
    #     quiz_result_list.append(result.to_dict())
    quiz_result_list = [result.to_dict() for result in question_results]  # noqa: F841
    return {
        "status": "success",
        "message": "Results updated",
        "quiz_results": [quiz_result_dict],
    }


@results_router.get(
    "/{quiz_id}/results",
    response_model=MyQuizResultsResponse,
    tags=["result"],
)
async def get_user_results_for_quiz(  # noqa: ANN201
    quiz_id: int,
    db: GetDb,
    user: CurrentUser,
):
    quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user)
    quiz_results = await QuizManager.get_results_for_quiz(db, quiz_id)
    my_results_list = []
    my_students_results_list = []
    if quiz_results is not None:
        for result in quiz_results:
            if result.taker == user.id:
                my_results_list.append(result.to_dict())
            else:
                my_students_results_list.append(result.to_dict())

    return {
        "status": "success",
        "message": "Results retrieved",
        "my_results": my_results_list,
        "my_students_results": my_students_results_list,
    }
