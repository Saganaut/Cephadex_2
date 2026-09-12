import logging

import redis.asyncio as redis_async
from redis.asyncio import Redis as RedisAsync

from dependencies.settings import get_settings
from models.doc_rows import DocRows
from models.embeddings.dependencies import Embedder, Llm, Matcher
from models.jobs.job_schema import ChatQuerySchema, EmbeddingSchema, PromptSchema
from models.jobs.session import sync_session_factory

settings = get_settings()

log = logging.getLogger("App")


r = redis_async.Redis(
    host=settings.redis.host,
    port=settings.redis.port,
    password=settings.redis.password,
    decode_responses=True,
)


### receive query from user
class EmbeddingsSearch:
    def __init__(
        self,
        query: ChatQuerySchema,
        r: RedisAsync,
        embedder: Embedder,
        matcher: Matcher,
        llm: Llm,
    ):
        self.query: ChatQuerySchema = query
        self.r: RedisAsync = r
        self.embedder: Embedder = embedder
        self.matcher: Matcher = matcher
        self.results: list = []
        self.llm: Llm = llm

    ### embed query
    # @log_decorator
    def search(self) -> ChatQuerySchema:
        log.debug("entered search")
        self.embed_query()
        self.similarity_search()
        # if self.results is None or self.results == []:
        #     return ChatQuerySchema(
        #         query=self.query.query,
        #         prompt=None,
        #         user_id=self.query.user_id,
        #         context="",
        #         file_id=None,
        #         pages=[],
        #         type=self.query.type,
        #     )

        self.find_neighbours()
        self.create_context()
        self.build_prompt()
        log.debug("Returning query with context  %s", self.query.context)
        return ChatQuerySchema(
            query=self.query.query,
            prompt=self.query.prompt,
            user_id=self.query.user_id,
            context=self.query.context,
            file_id=self.query.file_id,
            pages=self.query.pages,
            type=self.query.type,
        )

    # @log_decorator
    def embed_query(self) -> None:
        embedding = self.embedder.embed(self.query.query)
        self.query.embedding = embedding

    ### search for similar embeddings
    ### return top results
    # @log_decorator
    def similarity_search(self) -> list | None:
        ## search for document

        if self.query.type == "cephadex":
            self.query.file_id = None
            slug = "0"
            ## all the documentation is in 0 file
            matches = self.matcher.similarity_search(
                r=self.r,
                embedding=self.query.embedding,
                doc_type="chunk",
                qty=3,
            )
            self.results = matches
            return matches

        document = self.matcher.similarity_search(
            self.r,
            embedding=self.query.embedding,
            user_id=self.query.user_id,
            doc_type="document",
            qty=1,
        )
        if not document:
            return []
        self.query.file_id = document[0].file_id
        slug = document[0].slug

        pages = self.matcher.similarity_search(
            self.r,
            embedding=self.query.embedding,
            user_id=self.query.user_id,
            doc_type="page",
            qty=3,
            slug=slug,
            min_vector_score=0.2,
        )
        match_list = []

        for page in pages:
            if page.page is not None and page.page not in self.query.pages:
                self.query.pages.append(page.page)
            matches = self.matcher.similarity_search(
                self.r,
                embedding=self.query.embedding,
                user_id=self.query.user_id,
                doc_type="chunk",
                qty=3,
                slug=page.slug,
                page=page.page,
                min_vector_score=0.2,
            )
            match_list.extend(matches)
        self.results = match_list
        log.debug("Results: %s ", self.results)
        return match_list

    ### find neighbors of top results
    ### return top results and neighbors
    ## here matcher should return an embedding schema but without the embeddings

    # @log_decorator

    def find_neighbours(self, offset_qty_neg: int = 2, offset_qty_pos: int = 2) -> None:
        ## retrieve rows + neighbor rows from db
        new_entries = []
        with sync_session_factory() as db:
            for result in self.results:
                lower_bound = result.item_number - offset_qty_neg
                upper_bound = result.item_number + offset_qty_pos
                db_results = (
                    db.query(DocRows)
                    .filter(
                        DocRows.slug == result.slug,
                        DocRows.chunk.between(lower_bound, upper_bound),
                    )
                    .all()
                )
                for db_result in db_results:
                    new_entry = EmbeddingSchema(
                        slug=db_result.slug,
                        user_id=self.query.user_id,
                        type="chunk",
                        deck_id=None,
                        text=db_result.text,
                        page=0,
                        document="documentation",
                        item_number=db_result.chunk,
                        item_quantity=len(db_results),
                        source="documentation",
                        state="queued",
                        file_id=None,
                    )
                    new_entries.append(new_entry)
            self.results.extend(new_entries)
        # log.debug("finding neighbors")
        # for result in self.results:
        #     print("result", result)
        #     neighbor_results = self.matcher.find_neighbours(
        #         self.r, embedding=result, offsets=[-offset_qty_neg, offset_qty_pos]
        #     )
        #     print("neighbor_results", neighbor_results)
        #     for neighbor in neighbor_results:
        #         print("neighbor", neighbor)
        #         self.results.append(neighbor)

    ## take all the results assemble the ones with their neighbors
    # @log_decorator
    def create_context(self) -> None:
        log.debug("creating context with results")
        sorted_list = sorted(self.results, key=lambda x: (x.slug, x.item_number))
        sources = set()
        for item in sorted_list:
            self.query.context += f"{item.text}\n "
            sources.add(item.source)

    # @log_decorator
    def build_prompt(self) -> None:
        log.debug("building prompt")
        if self.query.prev_message is not None:
            prev_message = f"""You are continuing an existing conversation.
            Your previous responses included: {self.query.prev_message}"""
        else:
            prev_message = ""
        if self.query.type == "cephadex":
            self.query.prompt = f"""You are the personification of an app, your name is Ceph,
            short for Cephadex. {prev_message} The user asked this question {self.query.query}
            provide an answer using the following information {self.query.context},
            Only answer if the information included is enough to answer, otherwise respond
            that you are unable to answer that question. Your answer: \n"""
        ## TODO: decide whether we should include prev_message in the prompt
        else:
            self.query.prompt = f"""The user asked this question {self.query.query}
            provide an answer using the following information {self.query.context},
            if the information is not enough to answer the question respond that you
            could not find the answer in their files and ask to rephrase the question.
            Your answer: \n"""

    ## not used since responses are streamed, leaving it here for testing purposes
    # @log_decorator
    def send_to_llm(self) -> str | None:
        if self.query.prompt is None:
            log.info("Prompt is None")
            return "Oops, there was an error, please try again or contact support"
        prompt = PromptSchema(
            prompt=self.query.prompt,
            type="chatbot",
            subtype=self.query.type,
        )
        return self.llm.call_llm(prompt)


### build prompt
