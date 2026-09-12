import datetime as dt
from typing import Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

config = ConfigDict(
    populate_by_name=True,
    alias_generator=to_camel,
    from_attributes=True,
)


class QuestionResultSchema(BaseModel):
    model_config = config

    id: int
    test_id: int | None
    taker: int | None
    question_id: int
    answer: str | None
    points: int | None
    time_created: str | None
    quiz_result_id: int
    correct: bool = False


class QuizResultSchema(BaseModel):
    model_config = config

    id: int
    test_id: int
    taker: int | None
    creator: int | None
    due_date: str | dt.datetime | None
    start_time: str | dt.datetime | None
    end_time: str | dt.datetime | None
    points: int = 0
    correct: int = 0
    blank: int = 0
    graded: bool = False
    private: bool = False
    taker_username: Optional[str] = None
    taker_name: Optional[str] = None
    creator_username: Optional[str] = None


class QuizSchema(BaseModel):
    model_config = config

    id: int  ##
    name: str
    points: int = 0
    num_questions: int = 0
    category: str | None
    subject: str | None
    topic: str | None
    time_created: str
    due_date: Optional[str | dt.datetime] = None
    questions: Optional[list] = None
    creator: int | None
    result_reveal: bool = False
    answer_reveal: bool = False
    time_limit: int | None
    instructions: str | None
    description: str | None
    shuffle: bool = False
    img: str | None
    text: str | None
    deck_id: int | None
    # share_id: str | None
    fav: bool = False
    type: str = "Quiz"
    qty_questions: int = 0
    jeopardy: Optional[bool] = False


class QuestionSchema(BaseModel):
    model_config = config

    id: int
    question: str | None
    term: str | None
    content: str | None
    boc_2: str | None
    boc_3: str | None
    boc_4: str | None
    formula: str | None
    prompt_option: str | None
    q_type: str | None
    q_order: int | None
    points: int = 0
    img: Optional[str] = None


class QuizAndQuestionsSchema(BaseModel):
    model_config = config

    quiz: QuizSchema
    questions: list[QuestionSchema]


class QuizDataResponse(BaseModel):
    model_config = config

    status: str
    message: str
    quizzes: list[QuizSchema]
    questions: list[QuestionSchema]
    userType: Optional[str] = None
    userId: Optional[int] = None
    quizShareId: Optional[str] = None


class QuizSharingSchema(BaseModel):
    model_config = config

    id: int
    quiz_id: int
    share_id: str
    hours_until_expire: int
    can_retake: bool
    time_created: dt.datetime | str
    user_email: Optional[str] = None
    user_id: Optional[int] = None
    expire: bool
    type: str
    results_reported: bool = True


class QuizSharingFullSchema(BaseModel):
    model_config = config

    quiz: QuizSchema
    share: QuizSharingSchema
    results: list[QuizResultSchema] | None


class QuizSharedDataResponse(BaseModel):
    model_config = config

    status: str
    message: str
    data: QuizSharingFullSchema | None


class QuizSharingDataResponse(BaseModel):
    model_config = config

    status: str
    message: str
    quizzes: Optional[list[QuizSharingFullSchema]] = None
    # questions: Optional[list[QuestionSchema]] = None


class QuizResultDataResponse(BaseModel):
    model_config = config

    status: str
    message: str
    quiz_results: Optional[list[QuizResultSchema]] = None
    question_results: Optional[list[QuestionResultSchema]] = None


class MyQuizResultsResponse(BaseModel):
    model_config = config

    status: str
    message: str
    my_results: Optional[list[QuizResultSchema]] = None
    my_students_results: Optional[list[QuizResultSchema]] = None


class QuizResultGradeRequest(BaseModel):
    model_config = config

    quiz_result: QuizResultSchema
    question_results: list[QuestionResultSchema]


class QuizRequestSchema(BaseModel):
    model_config = config

    name: str
    num_questions: int = 0
    points: int = 0
    category: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    time_created: Optional[str] = None
    due_date: Optional[str | dt.datetime] = None
    result_reveal: Optional[bool] = False
    answer_reveal: Optional[bool] = False
    time_limit: Optional[int] = None
    instructions: Optional[str] = None
    description: Optional[str] = None
    shuffle: Optional[bool] = False
    img: Optional[str] = None
    text: Optional[str] = None
    deck_id: int
    share_id: Optional[str] = None
    fav: Optional[bool] = False
    questions: Optional[list[QuestionSchema]] = None
    jeopardy: Optional[bool] = False

    # @validator("due_date", pre=True)
    # def convert_dt.datetime_to_str(cls, v):
    #     if isinstance(v, dt.dt.datetime):
    #         return v.isoformat()
    #     return v


## Only used for making new questions thus no ids attached
class QuestionRequestSchema(BaseModel):
    model_config = config

    question: str | None
    term: str | None
    content: str | None
    boc_2: Optional[str] = None
    boc_3: Optional[str] = None
    boc_4: Optional[str] = None
    formula: Optional[str] = None
    prompt_option: Optional[str] = None
    q_type: Optional[str] = None
    q_order: int | None
    points: int = 0


class NewQuizRequest(BaseModel):
    model_config = config

    quiz: QuizRequestSchema
    questions: list[QuestionRequestSchema]


class GradedResultSchema(BaseModel):
    model_config = config

    question: QuestionSchema
    result: QuestionResultSchema | None
    correct: bool = False


class SingleQuizResultResponse(BaseModel):
    model_config = config

    status: str
    message: str
    quiz: QuizSchema | None
    quiz_result: QuizResultSchema | None
    graded_results: Optional[list[GradedResultSchema]] = None
    taker: str | None
    user_type: Optional[str] = None
    user_id: Optional[int] = None


class QuestionResultData(BaseModel):
    model_config = config

    test_id: int
    taker: int | None
    question_id: int
    answer: str | None


class QuizResultDataRequest(BaseModel):
    model_config = config

    quiz_id: int
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    question_answers: Optional[list[QuestionResultData]] = None


class QuizResultAndQuizResponse(BaseModel):
    resultId: int
    quiz: QuizSchema
    result: QuizResultSchema


class QuizAndResults(QuizSchema):
    results: list[QuizResultSchema] | None


class QuizResultsResponseData(BaseModel):
    model_config = config
    status: str
    message: str
    quiz_and_results: list[QuizAndResults] | None
