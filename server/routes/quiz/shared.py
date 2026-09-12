from fastapi import APIRouter, HTTPException

from dependencies.db import GetDb
from dependencies.redis import GetRedisClient
from dependencies.settings import AppSettings
from dependencies.user_dependencies import CurrentUser, CurrentUserOrGuest
from models.quiz.quiz_manager import QuizManager
from models.quiz.quiz_sharing import QuizSharingType
from models.user.user_manager import UserManager
from routes.data_classes.quiz_schema import (
    QuestionSchema,
    QuizDataResponse,
    QuizSharedDataResponse,
    QuizSharingDataResponse,
)
from routes.data_classes.request import EmailListRequest
from routes.data_classes.response import (
    LinkAndQrCodeResponse,
    StandardApiResponse,
)

shared_router = APIRouter()


@shared_router.delete(
    "/assigned/{quiz_id}/",
    response_model=StandardApiResponse,
    tags=["quiz"],
)
async def reject_quiz(quiz_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    await QuizManager.refuse_quiz_assignment(db, quiz_id, user.id)
    await db.commit()
    return {"status": "success", "message": "Rejected quiz asisgnment"}


## ! Deprecated
@shared_router.get("/assigned", response_model=QuizDataResponse, tags=["quiz"])
async def get_assigned_quizzes(db: GetDb, user: CurrentUser):  # noqa: ANN201
    """DERECATED TO BE REMOVED returns all quizzes ASSIGNED to a user"""
    results = await QuizManager.get_assigned_quizzes(db, user.id)
    return {
        "status": "success",
        "message": "Quizzes retrieved",
        "quizzes": results,
        "questions": [],
    }


@shared_router.post(
    "/{quiz_id}/assign",
    response_model=StandardApiResponse,
    tags=["quiz"],
)
async def assign_quiz(  # noqa: ANN201
    quiz_id: int,
    request: EmailListRequest,
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
    r_client: GetRedisClient,
):
    quiz = await QuizManager.retrieve_quiz_and_load_takers(db, quiz_id)
    QuizManager.check_permission_quiz(quiz, user, "creator")
    await QuizManager.share_quiz_to_users_or_guests(
        r_client,
        db,
        request.emails,
        quiz,
        user,
        settings,
    )
    await db.commit()
    return {"status": "success", "message": "Quiz assigned"}


@shared_router.get(
    "/{quiz_id}/link",
    response_model=LinkAndQrCodeResponse,
    tags=["quiz"],
)
async def get_share_link_for_quiz(  # noqa: ANN201
    quiz_id: int,
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
):
    """Returns a link and a QR code for a quiz - accessible by anyone"""
    quiz = await QuizManager.retrieve_quiz_and_load_takers(db, quiz_id)

    QuizManager.check_permission_quiz(quiz, user)

    link, img_str = await QuizManager.shared_quiz_general(db, quiz, settings)
    await db.commit()
    return {
        "status": "success",
        "message": "Quiz link retrieved",
        "shareLink": link,
        "qrCode": img_str,
    }


@shared_router.get(
    "/shared-quizzes",
    response_model=QuizSharingDataResponse,
    tags=["quiz"],
)
async def get_shared_quizzes_for_user(db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Returns all quizzes ASSIGNED to a user"""
    shared_entries = await QuizManager.retrieve_share_quiz_entries_for_user(
        db,
        user.id,
    )
    shared_quizzes_list = []
    for shared in shared_entries:
        quiz = await QuizManager.retrieve_quiz(db, shared.quiz_id)
        results = await QuizManager.get_result_for_quiz_by_user_id(
            db,
            shared.quiz_id,
            user.id,
        )
        # results_list = []
        # if results is not None:
        #     for result in results:
        #         results_list.append(result.to_dict())
        results_list = [result.to_dict() for result in results] if results else []
        shared_quizzes_list.append(
            {
                "quiz": quiz.to_dict(),
                "share": shared.to_dict(),
                "results": results_list,
            },
        )
    return {
        "status": "success",
        "message": "Quizzes retrieved",
        "quizzes": shared_quizzes_list,
    }


@shared_router.delete(
    "/shared-quiz/{shared_quiz_id}",
    response_model=StandardApiResponse,
    tags=["quiz"],
)
async def delete_shared_quiz(shared_quiz_id: str, db: GetDb, user: CurrentUser):  # noqa: ANN201
    shared_quiz = await QuizManager.retrieve_shared_quiz_entry(db, shared_quiz_id)
    if shared_quiz is None:
        raise HTTPException(status_code=404, detail="Shared quiz not found")
    if shared_quiz.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to delete this quiz",
        )
    await db.delete(shared_quiz)
    await db.commit()
    return {"status": "success", "message": "Shared quiz deleted"}


@shared_router.get(
    "/shared-quiz/{shared_quiz_id}",
    response_model=QuizSharedDataResponse,
    tags=["quiz"],
)
async def get_shared_quiz(db: GetDb, shared_quiz_id: str, user: CurrentUserOrGuest):  # noqa: ANN201
    shared_quiz = await QuizManager.retrieve_shared_quiz_entry(db, shared_quiz_id)
    if shared_quiz is None:
        raise HTTPException(status_code=404, detail="Shared quiz not found")
    quiz = await QuizManager.retrieve_quiz(db, shared_quiz.quiz_id)
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    results = None
    if shared_quiz.type == QuizSharingType.user and user != "guest" and user.guest is False:
        results = await QuizManager.get_result_for_quiz_by_user_id(
            db,
            quiz.id,
            user.id,
        )
        if results is not None:
            results = [result.to_dict() for result in results]
    return {
        "status": "success",
        "message": "Quiz retrieved",
        "data": {
            "quiz": quiz.to_dict(),
            "share": shared_quiz.to_dict(),
            "results": results,
        },
    }


@shared_router.get(
    "/shared/{shared_quiz_id}",
    response_model=QuizDataResponse,
    tags=["quiz"],
)
async def get_shared_quiz_and_questions(  # noqa: ANN201
    shared_quiz_id: str,
    db: GetDb,
    user: CurrentUserOrGuest,
):
    shared_quiz = await QuizManager.retrieve_shared_quiz_entry(db, shared_quiz_id)
    if shared_quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    if shared_quiz.type == "user":
        if user == "guest":
            return {
                "status": "error",
                "message": "You must log in to take this quiz",
                "data": {
                    "redirect": "login",
                    "redirectType": "quiz",
                    "redirectId": shared_quiz_id,
                },
            }
        if user.id != shared_quiz.user_id:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to take this quiz",
            )

    if shared_quiz.type in [QuizSharingType.guest, QuizSharingType.general] and user == "guest":
        user = await UserManager.create_guest_account(db)
    quiz = await QuizManager.retrieve_shared_quiz_and_load_questions(
        db,
        shared_quiz_id,
    )
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    # quiz_questions = []
    # for question in quiz.questions:
    #     quiz_questions.append(QuestionSchema.model_validate(question.to_dict()))
    quiz_questions = [
        QuestionSchema.model_validate(question.to_dict()) for question in quiz.questions
    ]
    quiz_data = quiz.to_dict()
    user_type = "guest" if user == "guest" else "user"
    user_id = None if user == "guest" else user.id
    return {
        "status": "success",
        "message": "Quiz retrieved",
        "quizzes": [quiz_data],
        "questions": quiz_questions,
        "userType": user_type,
        "userId": user_id,
        "quizShareId": shared_quiz_id,
    }
