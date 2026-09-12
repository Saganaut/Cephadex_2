import datetime as dt
import difflib
import logging
import random
import uuid
from typing import Sequence, Union

from fastapi import HTTPException
from redis.asyncio import Redis as RedisAsync
from sqlalchemy import and_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload, selectinload

from config import AppSettings, QuizSettings, Settings
from models.helpers.helpers import Helpers, remove_punctuation
from models.models_ import (
    Question,
    QuestionResult,
    QuizSharing,
    QuizSharingType,
    Test,
    TestResult,
    User,
)
from models.relational_tables.association_tables import distribution, questions
from models.send_email import Emailer
from models.user.notification_manager import Notification_Manager
from models.user.notifications import NotificationType, RefTableType
from models.user.user_manager import UserManager
from routes.data_classes.quiz_schema import (
    GradedResultSchema,
    QuestionRequestSchema,
    QuestionResultData,
    QuestionResultSchema,
    QuestionSchema,
    QuizRequestSchema,
    QuizResultSchema,
    QuizSchema,
)
from tools.lists import TEST_NAMES

logger = logging.getLogger("App")

HOW_CLOSE_TO_BE_CONSIDERED_CORRECT = 0.9


class QuizManager:
    @staticmethod
    async def retrieve_quiz(db: AsyncSession, quiz_id: int) -> Test:
        logger.info("retrieving quiz %s", quiz_id)
        result = await db.execute(select(Test).where(Test.id == quiz_id))
        quiz = result.scalars().first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz

    @staticmethod
    async def retrieve_quiz_and_load_takers(db: AsyncSession, quiz_id: int) -> Test:
        logger.info("retrieving quiz %s", quiz_id)
        result = await db.execute(
            select(Test).options(selectinload(Test.taker)).where(Test.id == quiz_id),
        )
        quiz = result.scalars().first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz

    @staticmethod
    async def retrieve_quiz_and_load_questions_and_takers(
        db: AsyncSession,
        quiz_id: int,
    ) -> Test:
        logger.info("retrieving quiz %s", quiz_id)
        result = await db.execute(
            select(Test)
            .options(joinedload(Test.questions), joinedload(Test.taker))
            .where(Test.id == quiz_id),
        )
        quiz = result.scalars().first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz

    @staticmethod
    async def retrieve_quiz_and_load_questions(db: AsyncSession, quiz_id: int) -> Test:
        logger.info("retrieving quiz %s", quiz_id)
        result = await db.execute(
            select(Test).options(selectinload(Test.questions)).where(Test.id == quiz_id),
        )
        quiz = result.scalars().first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz

    @staticmethod
    async def copy_quiz(db: AsyncSession, quiz: Test, user: User) -> Test:
        logger.info("copying quiz %s", quiz.id)
        new_quiz = Test(
            name=quiz.name,
            category=quiz.category,
            subject=quiz.subject,
            topic=quiz.topic,
            due_date=quiz.due_date,
            time_limit=quiz.time_limit,
            result_reveal=quiz.result_reveal,
            answer_reveal=quiz.answer_reveal,
            instructions=quiz.instructions,
            description=quiz.description,
            shuffle=quiz.shuffle,
            jeopardy=quiz.jeopardy,
            creator=user.id,
            qty_questions=quiz.qty_questions,
        )
        db.add(new_quiz)
        return new_quiz

    @staticmethod
    async def copy_quiz_questions(
        db: AsyncSession,
        old_quiz: Test,
        new_quiz: Test,
    ) -> Test:
        for question in old_quiz.questions:
            new_question = Question(
                question=question.question,
                term=question.term,
                content=question.content,
                points=question.points,
                boc_2=question.boc_2,
                boc_3=question.boc_3,
                boc_4=question.boc_4,
                formula=question.formula,
                prompt_option=question.prompt_option,
                q_type=question.q_type,
                q_order=question.q_order,
            )
            db.add(new_question)
            new_quiz.questions.append(new_question)
        return new_quiz

    @staticmethod
    async def retrieve_shared_quiz_and_load_questions_and_takers(
        db: AsyncSession,
        shared_id: int,
    ) -> Test:
        logger.info("retrieving shared quiz %s", shared_id)
        result = await db.execute(
            select(Test)
            .join(
                QuizSharing,
                QuizSharing.quiz_id == Test.id,
            )
            .options(selectinload(Test.questions), selectinload(Test.taker))
            .where(QuizSharing.share_id == shared_id),
        )

        quiz = result.scalars().first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz

    @staticmethod
    async def retrieve_shared_quiz_and_load_questions(
        db: AsyncSession,
        shared_id: str,
    ) -> Test:
        logger.info("retrieving shared quiz %s", shared_id)
        result = await db.execute(
            select(Test)
            .join(
                QuizSharing,
                QuizSharing.quiz_id == Test.id,
            )
            .options(selectinload(Test.questions))
            .where(QuizSharing.share_id == shared_id),
        )

        quiz = result.scalars().first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz

    @staticmethod
    async def retrieve_shared_quiz_entry(
        db: AsyncSession,
        shared_id: str,
    ) -> QuizSharing:
        result = await db.execute(
            select(QuizSharing).where(QuizSharing.share_id == shared_id),
        )
        quiz = result.scalars().first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz

    @staticmethod
    def check_permission_quiz(quiz: Test, user: User, role: str = "taker") -> None:
        """Only allows access to quiz if user is creator or taker"""
        if quiz.creator == user.id:
            return
        if role == "creator":
            if quiz.creator != user.id:
                raise HTTPException(
                    status_code=403,
                    detail="You do not have permission to access this quiz",
                )
            return
        if role == "taker" and quiz.taker != user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this quiz",
            )
        if user.id not in [quiz.taker, quiz.creator]:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this quiz",
            )

    @staticmethod
    async def retrieve_quiz_result(db: AsyncSession, quiz_result_id: int) -> TestResult:
        result = await db.execute(
            select(TestResult).where(TestResult.id == quiz_result_id),
        )
        quiz_result = result.scalars().first()
        if not quiz_result:
            raise HTTPException(status_code=404, detail="Quiz result not found")
        return quiz_result

    @staticmethod
    async def load_questions(db: AsyncSession, quiz: Test) -> Sequence[Question]:
        stmt = select(Question).join(questions).where(questions.c.test_id == quiz.id)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    def sum_points(quiz: Test) -> int:
        points = 0
        for questions_to_sum in quiz.questions:
            points = points + questions_to_sum.points
        quiz.points = points
        return quiz.points

    @staticmethod
    def count_questions(quiz: Test) -> int:
        quiz.qty_questions = len(quiz.questions)
        return quiz.qty_questions

    @staticmethod
    async def create_new_quiz(
        db: AsyncSession,
        user: User,
        request_quiz: QuizRequestSchema,
    ) -> Test:
        logger.info("creating new quiz...")
        quiz_name = request_quiz.name
        if quiz_name == "" or quiz_name is None:
            quiz_name = random.choice(TEST_NAMES)  # noqa: S311
        quiz_data = request_quiz.model_dump(exclude_unset=True)
        quiz_data.pop("id", None)
        quiz_data.pop("name", None)
        quiz_data.pop("questions", None)
        due_date = quiz_data.get("due_date")
        if due_date:
            quiz_data["due_date"] = dt.datetime.fromisoformat(quiz_data["due_date"])
        new_quiz = Test(name=quiz_name, **quiz_data)
        db.add(new_quiz)
        new_quiz.time_created = dt.datetime.now()
        new_quiz.creator = user.id
        return new_quiz

    @staticmethod
    async def add_questions_to_quiz(
        db: AsyncSession,
        quiz: Test,
        questions: list[QuestionRequestSchema],
    ) -> Test:
        logger.info("adding questions to quiz %s", quiz.id)
        question_count = 0
        for card in questions:
            question_count += 1
            try:
                card_data = card.model_dump(exclude_unset=True)
                card_data.pop("id", None)
                max_length = 1000
                for key, value in card_data.items():
                    if isinstance(value, str) and len(value) > max_length:
                        card_data[key] = value[:max_length]
                new_question = Question(**card_data)
                db.add(new_question)
                quiz.questions.append(new_question)
            except Exception:
                logger.exception("Error adding question to quiz")
        quiz.qty_questions = question_count
        return quiz

    @staticmethod
    async def retrieve_share_quiz_entries_for_user(
        db: AsyncSession,
        user_id: int,
    ) -> Sequence[QuizSharing]:
        stmt = select(QuizSharing).where(QuizSharing.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    def update_quiz_data(quiz: Test, quiz_request: QuizRequestSchema) -> None:
        attributes = [
            "name",
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
            "jeopardy",
        ]
        for attr in attributes:
            value = getattr(quiz_request, attr, None)
            if value is not None:
                if attr == "due_date" and isinstance(value, str):
                    try:
                        value = dt.datetime.fromisoformat(value)
                    except ValueError:
                        logger.exception(
                            """Error converting due_date in
                            update_quiz_data: %s is not a valid ISO format""",
                            value,
                        )
                        continue
                if attr == "time_limit" and value == 0:
                    value = None
                setattr(quiz, attr, value)

    @staticmethod
    def update_questions(
        quiz: Test,
        questions: list[QuestionSchema],
    ) -> tuple[list[Question], list[Question]]:
        new_questions = []
        existing_questions = []
        for question in questions:
            if question.id:
                for quiz_question in quiz.questions:
                    if quiz_question.id == question.id:
                        QuizManager.update_question(quiz_question, question)
                        existing_questions.append(quiz_question)
            else:
                new_question = QuizManager.add_question(quiz, question)
                new_questions.append(new_question)
        return new_questions, existing_questions

    @staticmethod
    def add_question(quiz: Test, question: QuestionSchema) -> Question:
        new_question = Question(**question.model_dump(exclude_unset=True))
        quiz.questions.append(new_question)
        return new_question

    @staticmethod
    def update_question(quiz_question: Question, question: QuestionSchema) -> None:
        logger.debug("updating question %s", quiz_question.points)
        attributes = [
            "question",
            "term",
            "content",
            "points",
            "boc_2",
            "boc_3",
            "boc_4",
            "formula",
            "prompt_option",
            "q_type",
            "q_order",
        ]
        for attr in attributes:
            value = getattr(question, attr, None)
            if value is not None:
                setattr(quiz_question, attr, value)

    @staticmethod
    async def retrieve_question_by_id(db: AsyncSession, question_id: int) -> Question:
        result = await db.execute(select(Question).where(Question.id == question_id))
        question = result.scalars().first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        return question

    @staticmethod
    async def create_new_question(
        db: AsyncSession,
        question: QuestionRequestSchema,
    ) -> Question:
        question_data = question.model_dump(exclude_unset=True)
        question_data.pop("id", None)
        new_question = Question(**question_data)
        db.add(new_question)
        return new_question

    @staticmethod
    async def add_question_to_quiz(
        quiz: Test,
        question: Question,
    ) -> Test:
        quiz.questions.append(question)
        return quiz

    ## SHARING QUIZZES
    ## 3 different ways of sharing a quiz - by email, with a user, or general
    ## general is for sharing on social media
    ## user is to share with existing users - auto appended to the quiz as takers
    ## email is to share with non-users - if they create an account
    # should then append their new account as takers to said quiz

    @staticmethod
    async def share_quiz_to_users_or_guests(
        r_client: RedisAsync,
        db: AsyncSession,
        emails: list,
        quiz: Test,
        user: User,
        settings: Settings,
    ) -> None:
        for email in emails:
            taker = await UserManager.get_user_by_email(db, email)
            if taker:
                await QuizManager.shared_quiz_with_user(
                    r_client,
                    db,
                    user.username,
                    quiz,
                    taker,
                    settings,
                )
            else:
                await QuizManager.shared_quiz_by_email(
                    db,
                    user.username,
                    quiz,
                    email,
                    settings,
                )

    @staticmethod
    async def shared_quiz_by_email(
        db: AsyncSession,
        sender_username: str,
        quiz: Test,
        user_email: str,
        settings: Settings,
        expire: bool = False,
        hours_until_expire: int = 168,
    ) -> None:
        shared_quiz = QuizSharing(
            quiz_id=quiz.id,
            user_email=user_email,
            expire=expire,
            hours_until_expire=hours_until_expire,
            type=QuizSharingType.guest,
        )
        db.add(shared_quiz)
        await db.flush()
        link, img_str = QuizManager.get_share_link(shared_quiz.share_id, settings.app)
        Emailer.send_email(
            settings.email,
            user_email,
            None,
            "test_shared",
            f"{sender_username} sent you a quiz",
            link=link,
        )

    @staticmethod
    async def shared_quiz_with_user(
        r_client: RedisAsync,
        db: AsyncSession,
        sender_username: str,
        quiz: Test,
        taker: User,
        settings: Settings,
        expire: bool = False,
        hours_until_expire: int = 168,
    ) -> None:
        shared_quiz = QuizSharing(
            quiz_id=quiz.id,
            user_id=taker.id,
            user_email=taker.email,
            expire=expire,
            hours_until_expire=hours_until_expire,
            type=QuizSharingType.user,
        )
        db.add(shared_quiz)
        await db.flush()
        await Notification_Manager.create_notification(
            r_client,
            db,
            taker,
            NotificationType.quiz_assigned,
            RefTableType.quiz_sharing,
            shared_quiz.id,
            "You have been assigned a quiz",
            shared_quiz.share_id,
        )
        link, img_str = QuizManager.get_share_link(shared_quiz.share_id, settings.app)
        Emailer.send_email(
            settings.email,
            taker.email,
            None,
            "test_shared",
            f"{sender_username} sent you a quiz",
            link=link,
        )
        quiz.taker.append(taker)

    @staticmethod
    async def shared_quiz_general(
        db: AsyncSession,
        quiz: Test,
        settings: Settings,
        expire: bool = False,
        hours_until_expire: int = 168,
    ) -> tuple[str, str]:
        shared_quiz = await QuizManager.check_shared_quiz_general_exists(db, quiz)
        if shared_quiz:
            link, img_str = QuizManager.get_share_link(
                shared_quiz.share_id,
                settings.app,
            )
            return link, img_str
        shared_quiz = QuizSharing(
            quiz_id=quiz.id,
            expire=expire,
            hours_until_expire=hours_until_expire,
            type=QuizSharingType.general,
        )
        db.add(shared_quiz)
        await db.flush()
        link, img_str = QuizManager.get_share_link(shared_quiz.share_id, settings.app)
        return link, img_str

    @staticmethod
    async def check_shared_quiz_general_exists(
        db: AsyncSession,
        quiz: Test,
    ) -> Union[None, QuizSharing]:
        result = await db.execute(
            select(QuizSharing).where(
                and_(
                    QuizSharing.quiz_id == quiz.id,
                    QuizSharing.type == QuizSharingType.general,
                ),
            ),
        )
        quiz = result.scalars().first()
        if quiz:
            return quiz
        return None

    @staticmethod
    async def shared_quiz_delete(db: AsyncSession, quiz_sharing_id: str) -> None:
        logger.info("deleting shared quiz %s", quiz_sharing_id)
        delete_stmt = delete(QuizSharing).where(QuizSharing.id == quiz_sharing_id)
        await db.execute(delete_stmt)

    @staticmethod
    def create_question_result_entry(
        db: AsyncSession,
        question: QuestionResultData,
        quiz_result_id: int,
        quiz_id: int,
    ) -> None:
        result = QuestionResult(
            test_id=quiz_id,
            taker=question.taker,
            question_id=question.question_id,
            answer=question.answer,
            quiz_result_id=quiz_result_id,
        )
        db.add(result)

    @staticmethod
    async def refuse_quiz_assignment(
        db: AsyncSession,
        quiz_id: int,
        user_id: int,
    ) -> None:
        delete_stmt = delete(distribution).where(
            and_(distribution.c.taker_id == user_id, distribution.c.test_id == quiz_id),
        )
        result = await db.execute(delete_stmt)
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Quiz not found")

    @staticmethod
    async def get_assigned_quizzes(db: AsyncSession, user_id: int) -> list[QuizSchema]:
        stmt = select(Test).join(distribution).where(distribution.c.taker_id == user_id)
        result = await db.execute(stmt)
        quizzes_list = []
        quizzes = result.scalars().all()

        for quiz in quizzes:
            quiz_data = QuizSchema.model_validate(quiz.to_dict())
            quizzes_list.append(quiz_data)
        return quizzes_list

    @staticmethod
    async def process_grade_quiz(
        db: AsyncSession,
        quiz: Test,
        quiz_result: TestResult,
        quiz_settings: QuizSettings,
    ) -> tuple[list[GradedResultSchema], TestResult]:
        """Only grades the quiz if it has yet to eb graded, otherwise just retursn the results"""
        graded_results: list = []
        if quiz_result.graded is False:
            (graded_results, result) = await QuizManager.grade_quiz(
                db,
                quiz,
                quiz_result,
                graded_results,
                quiz_settings.how_close_to_be_correct,
            )
        else:
            (graded_results, result) = await QuizManager.return_graded_answers(
                db,
                quiz,
                quiz_result,
                graded_results,
            )

        return graded_results, result

    @staticmethod
    async def grade_quiz(
        db: AsyncSession,
        quiz: Test,
        quiz_result: TestResult,
        graded_results: list,
        diff_value: float = HOW_CLOSE_TO_BE_CONSIDERED_CORRECT,
    ) -> tuple[list[GradedResultSchema], TestResult]:
        point_counter: int = 0
        correct_counter: int = 0
        for question in quiz.questions:
            correct = False
            result = await db.execute(
                select(QuestionResult).where(
                    (QuestionResult.quiz_result_id == quiz_result.id)
                    & (QuestionResult.question_id == question.id),
                ),
            )
            answer = result.scalar()
            if answer:
                answer_given = answer.answer
                answer_expected = (
                    question.term if question.q_type == "jeopardy" else question.content
                )
                if calculate_points(answer_given, answer_expected) > diff_value:
                    point_counter += question.points
                    correct_counter += 1
                    answer.points = int(question.points)
                    answer.correct = True
                    correct = True
                else:
                    answer.points = 0

                graded_results.append(
                    {
                        "question": question.to_dict(),
                        "result": answer.to_dict(),
                        "correct": correct,
                    },
                )
            else:
                ## no answers to append
                graded_results.append(
                    {
                        "question": question.to_dict(),
                        "result": None,
                        "correct": False,
                    },
                )
        quiz_result.points = point_counter
        quiz_result.correct = correct_counter
        quiz_result.graded = True
        await db.commit()
        return graded_results, quiz_result

    @staticmethod
    async def return_graded_answers(
        db: AsyncSession,
        quiz: Test,
        quiz_result: TestResult,
        graded_results: list,
    ) -> tuple[list[GradedResultSchema], TestResult]:
        for question in quiz.questions:
            result = await db.execute(
                select(QuestionResult).where(
                    (QuestionResult.quiz_result_id == quiz_result.id)
                    & (QuestionResult.question_id == question.id),
                ),
            )
            answer = result.scalar()
            if answer:
                dict_answer = answer.to_dict()
                graded_results.append(
                    {
                        "question": question.to_dict(),
                        "result": dict_answer,
                        "correct": dict_answer["correct"],
                    },
                )
            else:
                ## no answers to append
                graded_results.append(
                    {
                        "question": question.to_dict(),
                        "result": None,
                        "correct": False,
                    },
                )
        return graded_results, quiz_result

    @staticmethod
    async def get_results_for_quizzes_user_created(
        db: AsyncSession,
        user_id: int,
    ) -> list | None:
        results = await db.execute(
            select(TestResult).where(TestResult.creator == user_id),
        )
        quizz_results = results.scalars().all()
        if quizz_results is None:
            return None
        quiz_results_taken = set()
        results_list_of_dicts = {}
        for result in quizz_results:
            quiz_results_taken.add(result.test_id)
            if result.test_id not in results_list_of_dicts:
                results_list_of_dicts[result.test_id] = []
            results_list_of_dicts[result.test_id].append(result.to_dict())
        all_quizzes = []
        for quiz_id in quiz_results_taken:
            if quiz_id is None:
                continue
            quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(db, quiz_id)

            if quiz is None:
                continue
            quiz = quiz.to_dict()
            quiz["results"] = results_list_of_dicts[quiz["id"]]
            all_quizzes.append(quiz)

        return all_quizzes

    @staticmethod
    async def get_results_for_quizzes_user_took(db: AsyncSession, user_id: int) -> list | None:
        results = await db.execute(
            select(TestResult).where(TestResult.taker == user_id),
        )
        quizz_results = results.scalars().all()
        if quizz_results is None:
            return None
        quiz_results_taken = set()
        results_list_of_dicts = {}
        for result in quizz_results:
            quiz_results_taken.add(result.test_id)
            if result.test_id not in results_list_of_dicts:
                results_list_of_dicts[result.test_id] = []
            results_list_of_dicts[result.test_id].append(result.to_dict())
        all_quizzes = []

        for quiz_id in quiz_results_taken:
            if quiz_id is None:
                continue
            quiz = await QuizManager.retrieve_quiz_and_load_questions_and_takers(db, quiz_id)
            if quiz is None:
                continue
            quiz = quiz.to_dict()

            quiz["results"] = results_list_of_dicts[quiz["id"]]

            all_quizzes.append(quiz)

        return all_quizzes

    @staticmethod
    async def get_result_for_quiz_by_user_id(
        db: AsyncSession,
        quiz_id: int,
        user_id: int,
    ) -> Sequence[TestResult] | None:
        result = await db.execute(
            select(TestResult).where(
                and_(TestResult.test_id == quiz_id, TestResult.taker == user_id),
            ),
        )
        quiz_result = result.scalars().all()
        if not quiz_result:
            return None
        return quiz_result

    @staticmethod
    def get_share_link_and_qr_code_for_quiz(
        quiz: Test,
        app_settings: AppSettings,
    ) -> tuple[str, str]:
        if not quiz.share_id:
            quiz.share_id = str(uuid.uuid4())
        link = f"{app_settings.front_end_url}/quiz/shared?shareId={quiz.share_id}"
        img_str = Helpers.create_qr_code(link, app_settings.image_folder_path)
        return link, img_str

    ##TODO: WHy is this necessary?  Should it also return an im_str?
    @staticmethod
    def get_share_link(
        quiz_share_id: str,
        app_settings: AppSettings,
    ) -> tuple[str, str]:
        link = f"{app_settings.front_end_url}/quiz/shared?shareId={quiz_share_id}"
        img_str = Helpers.create_qr_code(link, app_settings.image_folder_path)
        return link, img_str

    @staticmethod
    async def update_quiz_result(
        db: AsyncSession,
        new_result_data: QuizResultSchema,
    ) -> TestResult:
        quiz_result = await QuizManager.retrieve_quiz_result(db, new_result_data.id)
        quiz_result.points = new_result_data.points
        quiz_result.correct = new_result_data.correct
        quiz_result.blank = new_result_data.blank
        quiz_result.graded = True
        await db.flush()
        return quiz_result

    ## TODO: investigate this type error
    @staticmethod
    async def update_questions_results(
        db: AsyncSession,
        result_id: int,
        list_question_results: list[QuestionResultSchema],
    ) -> Sequence[QuestionResult]:
        ## retrieve all question results from result id
        result = await db.execute(
            select(QuestionResult).where(QuestionResult.quiz_result_id == result_id),
        )
        question_results = result.scalars().all()
        question_results_dict = {qr.question_id: qr for qr in question_results}
        for question_result in list_question_results:
            qr = question_results_dict.get(question_result.question_id)
            if qr:
                qr.answer = question_result.answer if question_result.answer else qr.answer
                qr.points = question_result.points if question_result.points else qr.points
                qr.correct = question_result.correct
        await db.flush()
        return question_results

    @staticmethod
    async def get_results_for_quiz(
        db: AsyncSession,
        quiz_id: int,
    ) -> Sequence[TestResult] | None:
        result = await db.execute(
            select(TestResult).where(TestResult.test_id == quiz_id),
        )
        quiz_result = result.scalars().all()
        if not quiz_result:
            return None
        return quiz_result


def calculate_points(answer_given: str, answer_expected: str) -> float:
    answer_given = remove_punctuation(answer_given).lower().strip()
    answer_expected = remove_punctuation(answer_expected).lower().strip()
    matcher = difflib.SequenceMatcher(None, answer_given, answer_expected)
    return matcher.ratio()
