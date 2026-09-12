import datetime as dt
import logging
from datetime import timezone

from fastapi import APIRouter, HTTPException

from dependencies.db import GetDb
from dependencies.posthog import GetPostHog
from dependencies.user_dependencies import CurrentUser, CurrentUserOrGuest
from models.models_ import QuestionResult, TestResult
from models.quiz.quiz_manager import QuizManager
from models.quiz.quiz_sharing import QuizSharingType
from models.user.user import User
from models.user.user_manager import UserManager
from routes.data_classes.quiz_schema import (
    QuizResultDataRequest,
)

take_quiz_router = APIRouter()
## if user is not logged in create a guest account
## if shared_quiz_type is user and guest account return 403

log = logging.getLogger("App")


##TODO - not sure what I did here.  This doesn't seem to make sense - re-work this
## Here we are getting the user or guest but not logging them in - just using their user row
@take_quiz_router.post(
    "/shared/{shared_quiz_id}/take-quiz",
    tags=["quiz"],
)
async def take_shared_quiz(  # noqa: ANN201, C901, PLR0912
    shared_quiz_id: str,
    request: QuizResultDataRequest,
    db: GetDb,
    posthog: GetPostHog,
    user: CurrentUserOrGuest,
):
    shared_quiz_entry = await QuizManager.retrieve_shared_quiz_entry(
        db,
        shared_quiz_id,
    )
    if shared_quiz_entry.type == QuizSharingType.user and user == "guest":
        raise HTTPException(
            403,
            detail="This quiz can only be taken by regular users, please login to your account",
        )
    if user == "guest":
        user = User(guest=True)  # type: ignore
        db.add(user)
        await db.flush()
    if user is None or user == "guest":
        log.error("Error in take_shared_quiz - no user to associate the result with")
        raise HTTPException(500, detail="Internal server error")
    quiz = await QuizManager.retrieve_shared_quiz_and_load_questions(
        db,
        shared_quiz_id,
    )
    if request.start_time:
        start_time = dt.datetime.strptime(request.start_time, "%Y-%m-%dT%H:%M:%S.%fZ").replace()
    else:
        start_time = dt.datetime.now()
    if request.end_time:
        end_time = dt.datetime.strptime(request.end_time, "%Y-%m-%dT%H:%M:%S.%fZ").replace()
    else:
        end_time = dt.datetime.now()

    ## get username and name from user
    creator_username = await UserManager.get_username_by_id(db, quiz.creator)
    if creator_username is None:
        creator_username = "Unknown"

    user_username = user.username if user.username else "Unknown"
    user_name = f"{user.first_name} {user.last_name}"[:100] if user.first_name else "Unknown"

    quiz_result = TestResult(
        test_id=quiz.id,
        taker=user.id,
        start_time=start_time,
        creator=quiz.creator if quiz else None,
        private=False,
        end_time=end_time,
        taker_username=user_username,
        taker_name=user_name,
        creator_username=creator_username,
    )
    db.add(quiz_result)
    await db.flush()
    if request.question_answers:
        for question in request.question_answers:
            QuizManager.create_question_result_entry(
                db,
                question,
                quiz_result.id,
                quiz.id,
            )
    if request.end_time:
        end_time = dt.datetime.strptime(request.end_time, "%Y-%m-%dT%H:%M:%S.%fZ").replace()
    else:
        end_time = dt.datetime.now()
    quiz_result.end_time = end_time
    ## if this is not a "general" quiz and retake is disabled remove the ability to re-take the quiz
    if shared_quiz_entry.can_retake is False and shared_quiz_entry.type in [
        "guest",
        "user",
    ]:
        await db.delete(shared_quiz_entry)
    await db.commit()
    posthog.capture(user.id, "quiz_taken", {"quiz_id": quiz.id, "guest": user.guest})
    return {
        "status": "success",
        "message": "Quiz taken",
        "quizResultId": quiz_result.id,
        "userType": "guest" if user.guest is True else "user",
        "userId": user.id,
    }


## TODO: CONTINUE FROM HERE
@take_quiz_router.post("/{quiz_id}/take-quiz", tags=["quiz"])
async def take_quiz(  # noqa: ANN201
    request: QuizResultDataRequest,
    db: GetDb,
    posthog: GetPostHog,
    user: CurrentUser,
    quiz_id: int,
):
    # start2_time = time.time()
    quiz = await QuizManager.retrieve_quiz_and_load_questions(db, quiz_id)
    if quiz.creator != user.id:
        raise HTTPException(
            status_code=403,
            detail="This route is only for users to take the quizzes they created",
        )
    if request.start_time:
        start_time = dt.datetime.strptime(request.start_time, "%Y-%m-%dT%H:%M:%S.%fZ").replace()
        start_time = start_time.replace(tzinfo=timezone.utc)
        start_time = start_time.replace(tzinfo=None)
    else:
        start_time = dt.datetime.now()
        start_time = start_time.replace(tzinfo=None)

    if request.end_time:
        end_time = dt.datetime.strptime(request.end_time, "%Y-%m-%dT%H:%M:%S.%fZ").replace()
        end_time = end_time.replace(tzinfo=timezone.utc)
        end_time = end_time.replace(tzinfo=None)
    else:
        end_time = dt.datetime.now()
        end_time = end_time.replace(tzinfo=None)
    creator_username = await UserManager.get_username_by_id(db, quiz.creator)
    if creator_username is None:
        creator_username = "Unknown"

    user_username = user.username if user.username else "Unknown"
    user_name = f"{user.first_name} {user.last_name}"[:100] if user.first_name else "Unknown"
    quiz_result = TestResult(
        test_id=quiz.id,
        taker=user.id,
        start_time=start_time,
        creator=quiz.creator if quiz else None,
        due_date=quiz.due_date if quiz else None,
        end_time=end_time,
        taker_username=user_username,
        taker_name=user_name,
        creator_username=creator_username,
    )
    db.add(quiz_result)
    await db.flush()

    question_results = []
    if request.question_answers:
        for question in request.question_answers:
            question_result = QuestionResult(
                test_id=quiz_id,
                taker=question.taker,
                question_id=question.question_id,
                answer=question.answer,
                quiz_result_id=quiz_result.id,
            )
            question_results.append(question_result)

    db.add_all(question_results)
    if request.end_time:
        end_time = dt.datetime.strptime(request.end_time, "%Y-%m-%dT%H:%M:%S.%fZ").replace()
    else:
        end_time = dt.datetime.now()
    quiz_result.end_time = end_time
    await db.commit()
    posthog.capture(user.id, "quiz_taken", {"quiz_id": quiz.id, "guest": user.guest})

    return {
        "status": "success",
        "message": "Quiz taken",
        "quizResultId": quiz_result.id,
        "userType": "user",
        "userId": user.id,
    }
