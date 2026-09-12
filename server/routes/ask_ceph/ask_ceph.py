import logging
import time
from typing import Any, Generator, Optional

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from redis import Redis

from config import AISettings
from dependencies.db import GetSyncDb
from dependencies.settings import AppSettings
from dependencies.user_dependencies import CurrentUser
from models.creators.creator import AiCaller
from models.creators.prompt_builder import PromptBuilder
from models.embeddings.dependencies import Embedder, Llm, Matcher
from models.embeddings.search import EmbeddingsSearch
from models.jobs.job_schema import ChatQuerySchema, PromptSchema
from models.llm_data import DataCollector
from models.models_ import Card
from models.redis_manager import RedisManager
from models.user.user import User
from startup.setup_redis import setup_sync_redis_client

logger = logging.getLogger("App")

router = APIRouter(
    prefix="/ask-ceph",
    tags=["ask-ceph"],
)
MAX_LENGTH_OF_PREV_RESPONSE_TO_INCLUDE = 200
sys_instruct = """ You are a helpful assistant that uses loaded information to respond to questions.
Based upon that information you come up with your own response."""
SUB_PLAN_FOR_FILES_FEATURE = 1
MAX_CONTEXT_LENGTH = 400


class AskCephResponse(BaseModel):
    status: str
    response: str


class AskCephRequest(BaseModel):
    cardId: int
    question: Optional[str] = None
    latestParagraph: Optional[str] = None
    type: Optional[str] = None


@router.post("/{type_question}", tags=["ask-ceph"])
def ask(  # noqa: ANN201
    type_question: str,
    # user: CurrentUser,
    db: GetSyncDb,
    request: AskCephRequest,
    user: CurrentUser,
    settings: AppSettings,
    r_client: Redis = Depends(setup_sync_redis_client),
):
    """Type question: wrong, explain, question
    request form should include card_id, question, latest_paragraph
    """
    try:
        if request.question is None:
            stream_response = "Please enter a question"
            return StreamingResponse(stream_response, media_type="text/plain")
        if type_question not in ["wrong", "explain", "question", "cephadex", "files"]:
            stream_response = (
                "I'm sorry but I don't recognize this type of question.  Please try again."
            )
            return StreamingResponse(stream_response, media_type="text/plain")
        card = None
        if request.cardId is not None and request.cardId != 0:
            card = db.query(Card).filter_by(id=request.cardId).first()
            if card is None:
                stream_response = (
                    "I had an issue retrieving the card you are asking about, please try again."
                )
                return StreamingResponse(stream_response, media_type="text/plain")
        open_ai_caller = AiCaller(settings.ai, settings.aws)
        chatbot = ChatBot(
            settings.ai,
            open_ai_caller,
            r_client,
            user,
            type_question,
            request.question,
            card,
        )
        chatbot.check_if_cached()

        if chatbot.check_user_plan() is False:
            stream_response = "You need to upgrade to access this feature"
            return StreamingResponse(stream_response, media_type="text/plain")
        stream_response = chatbot.ask_question()

    except ValueError as e:
        return StreamingResponse(str(e), media_type="text/plain")
    except Exception:
        logger.exception("Error in ask-ceph")
        stream_response = "An error occurred. Please try again or contact support for assistance.  "
    return StreamingResponse(stream_response, media_type="text/plain")


def why_wrong_builder(card: Card) -> dict:
    return {
        "term": card.term,
        "subject": card.subject,
        "content": card.content,
        "boc_2": card.boc_2,
        "boc_3": card.boc_3,
        "boc_4": card.boc_4,
        "category": card.category,
        "card_id": card.id,
    }


class SourceResponse(BaseModel):
    context: str
    file_id: int
    pages: list[int]


class ChatResponse(BaseModel):
    source: Optional[SourceResponse] = None
    message: Optional[str] = None


STREAM_RESPONSE_MODEL = ""


class ChatBot:
    def __init__(
        self,
        settings: AISettings,
        ai_caller: AiCaller,
        r_client: Redis,
        user: User,
        type_question: str,
        question: str,
        card: Optional[Card] = None,
    ):
        self.settings: AISettings = settings
        self.ai_caller = ai_caller
        self.r_client = r_client
        self.user: User = user
        self.type_question: str = type_question
        self.question: str = question
        self.query: Optional[ChatQuerySchema] = None
        self.embeddings: Optional[EmbeddingsSearch] = None
        self.card: Optional[Card] = card
        self.cache: Optional[str] | Optional[bytes] | Any = None

    def check_if_cached(self) -> None:
        if self.type_question in ["question", "cephadex"]:
            cached = RedisManager.check_if_cached(
                self.r_client,
                f"convo:{self.user.id}-0",
            )
            if cached == 1:
                self.cache = RedisManager.retrieve_cached_data(
                    self.r_client,
                    f"convo:{self.user.id}-0",
                )

    def check_user_plan(self) -> bool:
        return not (self.type_question != "files" and self.user.id < SUB_PLAN_FOR_FILES_FEATURE)

    def ask_question(self) -> Generator:
        ## create a query object used to ask the llm for an answer, if the question is
        # a files question or a cephadex question, the embeddings will be used\
        # to search for the answer
        self.initialize_query()
        if self.type_question in ["files", "cephadex"]:
            if self.query is None:
                yield "I seem to be malfunctioning, please try again."
                return
            if self.query.context == "":
                yield """I'm sorry but I couldn't find any results for your query in the
                documentation, you can try re-phrasing the question or contact support for
                further assistance.  You can do so by using the feedback button
                or emailing us directly"""
                return
        if self.query is not None and self.query.context is not None:
            yield f"context: {self.query.context} &!& "
            time.sleep(0.1)
            yield f"file_id: {self.query.file_id} &!& "
            time.sleep(0.1)
            yield f"pages: {self.query.pages} &!& "
        yield from self.stream_and_cache(self.stream_selector())

    def initialize_query(self) -> None:
        self.query = ChatQuerySchema(
            query=self.question,
            type=self.type_question,
            user_id=self.user.id,
            prev_message=self.cache,
        )
        if self.type_question in ["files", "cephadex"]:
            self.embeddings = EmbeddingsSearch(
                self.query,
                self.r_client,
                Embedder(),
                Matcher(),
                Llm(),
            )
            query = self.embeddings.search()
            # if query == "No results found":
            #     raise ValueError("No results found")
            self.query = query
            return
        if self.type_question == "question":
            return

        self.build_prompt()

    def build_prompt(self) -> None:
        if self.query is None:
            msg = "Query is required to build prompt"
            raise ValueError(msg)
        if self.type_question == "explain":
            if self.card is None:
                msg = "Card is required to build prompt"
                raise ValueError(msg)
            prompt = PromptBuilder.build_prompt_explain_more(
                self.card.term,
                self.card.subject,
                self.card.content,
            )
        if self.type_question == "question":
            cache = (
                self.cache[:MAX_LENGTH_OF_PREV_RESPONSE_TO_INCLUDE]
                if self.cache is not None
                else ""
            )
            if self.card is None:
                msg = "Card is required to build prompt"
                raise ValueError(msg)
            prompt = PromptBuilder.question_prompt_builder(
                self.card.term,
                self.card.content,
                cache,
                self.query.query,
            )
        sys_instruct = """You are a helpful teacher who is an expert and providing
        clear explanations.
        There is no need to introduce yourself, but if questioned you should answer that you are a
        teacher named Ceph who is here to help."""
        self.query.sys_instruct = sys_instruct
        self.query.prompt = prompt.prompt

    def stream_selector(self) -> Generator:
        if self.type_question == "explain":
            yield from self.ask_explain_question()
        if self.type_question in ["files", "cephadex"]:
            yield from self.ask_files_question()
        else:
            yield from self.ask_default_question()

    def stream_and_cache(self, stream_selector: Generator) -> Generator:
        cache_chunks = []
        for chunk in stream_selector:
            cache_chunks.append(chunk)
            yield chunk
        cached_data = "".join(cache_chunks)
        cache_key = f"convo:{self.user.id}-0"
        if self.query is not None and self.query.prompt is not None:
            DataCollector.log_data(
                self.query.prompt,
                sys_instruct,
                cached_data,
                self.settings.openai_main_model,
                "stream",
                "chatbot",
                self.query.type,
            )
            RedisManager.cache_data(self.r_client, cache_key, cached_data, time=3600)

    def ask_files_question(self) -> Generator:
        if self.embeddings is None:
            msg = "Oops, seems we ran into an error, please try again."
            raise ValueError(msg)
        if self.query is None:
            msg = "Query is required to build prompt"
            raise ValueError(msg)
        if self.query.prompt is None:
            msg = "Query is required to build prompt"
            raise ValueError(msg)
        prompt = PromptSchema(
            prompt=self.query.prompt,
            type="stream",
            subtype="chatbot",
        )
        yield from self.ai_caller.get_response(prompt, sys_instruct)

    def ask_explain_question(self):  # noqa: ANN201
        if self.card is None:
            msg = "Card is required to build prompt"
            raise ValueError(msg)
        yield from self.ai_caller.explain_more(
            self.card.term,
            self.card.subject,
            self.card.content,
        )

    def ask_default_question(self):  # noqa: ANN201
        term = self.card.term if self.card is not None else ""
        content = self.card.content if self.card is not None else ""
        if self.query is None:
            msg = "Query is required to build prompt"
            raise ValueError(msg)
        yield from self.ai_caller.send_question_generator(
            term,
            content,
            self.cache,
            self.query.query,
        )

    ## shouldn't be necessary since we are using files for these questions also
    def ask_cephadex_question(self):  # noqa: ANN201
        pass

        # if type_question == "explain":
        #     stream_response = open_ai_caller.explain_more(
        #         card.term, card.subject, card.content
        #     )
        # if type_question == "question":
        #     latest_paragraph = (
        #         cache[:MAX_LENGTH_OF_PREV_RESPONSE_TO_INCLUDE]
        #         if cache is not None
        #         else None
        #     )

        #     if latest_paragraph is None:
        #         latest_paragraph = " "
        #     if request.question is None:
        #         raise HTTPException(
        #             status_code=status.HTTP_400_BAD_REQUEST,
        #             detail="Question is required",
        #         )
        #     query = ChatQuerySchema(
        #         query=request.question,
        #         type=type_question,
        #         user_id=user.id,
        #         prev_message=cache,
        #     )
        #     stream_response = stream_and_cache(
        #         open_ai_caller.send_question_generator(
        #             card.term, card.content, latest_paragraph, request.question
        #         ),
        #         f"convo:{user.id}-0",
        #         r_client,
        #         query,
        #         sys_instruct,
        #         settings,
        #     )
        #     return StreamingResponse(stream_response, media_type="text/plain")

        # if type_question in ["files", "cephadex"]:
        #     custom_query = ChatQuerySchema(
        #         query=request.question,
        #         type=type_question,
        #         user_id=user.id,
        #         prev_message=cache,
        #     )
        #     stream_response = custom_response(
        #         custom_query, user, r_client, open_ai_caller, settings
        #     )

        # def custom_response(custom_query, user, r, open_ai_caller, settings):


#     if custom_query.type == "files" and user.id < SUB_PLAN_FOR_FILES_FEATURE:
#         yield "You need to upgrade to access this feature"
#         return
#     type = custom_query.type
#     embeddings = EmbeddingsSearch(custom_query, r, Embedder, Matcher, Llm)
#     result_query = embeddings.search()
#     if result_query == "No results found":
#         if type == "files":
#             yield "I'm sorry but I couldn't find any results for your query in your files, you can
# try re-phrasing the question or searching for general results by not including '@files' before
# your question."
#         if type == "cephadex":
#             yield "I'm sorry but I couldn't find any results for your query in the documentation,
# you can try re-phrasing the question or contact support for further assistance.  You can do so by
# using the feedback button or emailing us directly at 'support@cephadex.com'."
#         return
#     if result_query.context is not None:
#         context = result_query.context[:MAX_CONTEXT_LENGTH]
#         file_id = result_query.file_id
#         pages = result_query.pages
#         yield f"context: {context} &!& "
#         time.sleep(0.1)
#         yield f"file_id: {file_id} &!& "
#         time.sleep(0.1)
#         yield f"pages: {pages} &!& "

#     yield from stream_and_cache(
#         open_ai_caller.get_response(result_query.prompt, sys_instruct),
#         f"convo:{user.id}-0",
#         r,
#         result_query,
#         sys_instruct,
#         settings,
#     )


# def stream_and_cache(
#     stream_generator, cache_key, r_client, result_query, sys_instruct, settings
# ):
#     cache_chunks = []

#     for chunk in stream_generator:
#         cache_chunks.append(chunk)
#         yield chunk
#     cached_data = "".join(cache_chunks)
#     DataCollector.log_data(
#         result_query.prompt,
#         sys_instruct,
#         cached_data,
#         settings.ai.openai_main_model,
#         "stream",
#         "chatbot",
#         result_query.type,
#     )
#     RedisManager.cache_data(r_client, cache_key, cached_data, time=3600)


# def documentation_response(query, user_id, r, open_ai_caller):
#     custom_query = ChatQuerySchema(query=query, user_id=user_id, type="cephadex")
#     embeddings = EmbeddingsSearch(custom_query, r, Embedder, Matcher, Llm, user_id)
#     custom_query = embeddings.search()
#     yield from open_ai_caller.get_response(custom_query.prompt, sys_instruct)
