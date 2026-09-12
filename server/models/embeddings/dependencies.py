import logging
from typing import Optional

import numpy as np
from openai import OpenAI
from redis import Redis
from redis.asyncio import Redis as RedisAsync
from redis.commands.search.query import Query

from dependencies.settings import get_settings
from models.jobs.job_schema import EmbeddingSchema, PromptSchema

settings = get_settings()

log = logging.getLogger("App")
VECTOR_DIMENSION = 1536
INDEX_NAME = "idx:EmbeddingIndex"
# open_ai = OpenAI(api_key=settings.ai.openai_api_key)


class Llm:
    def __init__(self):
        self.openai = OpenAI(api_key=settings.ai.openai_api_key)

    def call_llm(self, prompt: PromptSchema) -> str | None:
        response = self.open_ai.chat.completions.create(
            model=settings.ai.openai_main_model,
            messages=[
                {
                    "role": "system",
                    "content": """You are a helpful assistant that uses loaded information to
            respond to questions.  Based upon that information you come up with your own response.
            You can use markdown to format your response as well as LaTex and code blocks as
            needed.""",
                },
                {"role": "user", "content": prompt.prompt},
            ],
            temperature=settings.ai.temperature,
        )
        return response.choices[0].message.content

    async def summarize(self, prompt: PromptSchema) -> str | None:
        response = self.open_ai.chat.completions.create(
            model=settings.ai.openai_main_model,
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert at summarization,
        extracting the most important information from a given text.
        You are able to summarize any text you are given.""",
                },
                {"role": "user", "content": prompt.prompt},
            ],
            temperature=settings.ai.temperature,
        )
        return response.choices[0].message.content


class Embedder:
    @staticmethod
    def embed(query: str) -> list:
        open_ai = OpenAI(api_key=settings.ai.openai_api_key)
        response = open_ai.embeddings.create(
            input=query,
            model="text-embedding-3-small",
            dimensions=VECTOR_DIMENSION,
        )
        return response.data[0].embedding


query = (
    Query("(*)=>[KNN 3 @embedding $query_vector AS vector_score]")
    .sort_by("vector_score")
    .return_fields(
        "vector_score",
        "user_id",
        "deck_id",
        "item_number",
        "item_quantity",
        "page",
        "type",
        "source",
        "text",
        "slug",
    )
    .paging(0, 3)
    .dialect(2)
)
MIN_VECTOR_SCORE = 0.4


class Matcher:
    def similarity_search(
        self,
        r: Redis | RedisAsync,
        embedding: list,
        user_id: int | None = None,
        doc_type: str | None = None,
        qty: int = 3,
        slug: Optional[str] = None,
        page: Optional[int] = None,
        extra_params: Optional[dict] = None,
        min_vector_score: float = MIN_VECTOR_SCORE,
    ) -> list[EmbeddingSchema]:
        log.debug(
            f"""calling similarity search with {doc_type} {qty} {slug} {page}
            {embedding[:2]} {user_id}""",  # noqa: G004
        )
        query_str = f"(@type:{doc_type}"
        query_str_end = f")=>[KNN {qty} @embedding $query_vector AS vector_score]"
        if user_id is not None:
            user_id_filter = f"@user_id:[{user_id} {user_id}]"
            query_str = f"{query_str} {user_id_filter}"

        if slug is not None:
            slug_filter = f'@slug:"{slug}"'
            query_str = f"{query_str} {slug_filter}"

        if page is not None:
            page_filter = f"@page:[{page} {page}]"
            query_str = f"{query_str} {page_filter}"
        query_str = f"{query_str}{query_str_end}"
        query = (
            Query(query_str)
            .sort_by("vector_score")
            .return_fields(
                "vector_score",
                "user_id",
                "deck_id",
                "item_number",
                "item_quantity",
                "page",
                "page",
                "type",
                "source",
                "text",
                "slug",
                "file_id",
            )
            .paging(0, qty)
            .dialect(2)
        )
        extra_params = {}
        result = r.ft("idx:EmbeddingIndex").search(
            query,
            {"query_vector": np.array(embedding, dtype=np.float32).tobytes()} | extra_params,  # type: ignore
        )
        result_docs = result.docs  # type: ignore
        embeddings_list = []
        for doc in result_docs:
            vector_score = round(1 - float(doc.vector_score), 2)
            if vector_score > min_vector_score:
                new_embedding_schema = EmbeddingSchema(
                    slug=doc.slug,
                    user_id=doc.user_id,
                    deck_id=doc.deck_id,
                    item_number=doc.item_number,
                    item_quantity=1,
                    text=doc.text,
                    source="n/a",
                    vector_score=vector_score,
                    type=doc.type,
                    file_id=doc.file_id,
                    page=doc.page,
                )
                embeddings_list.append(new_embedding_schema)
        return embeddings_list

    def find_neighbours(
        self,
        r: Redis | RedisAsync,
        embedding: EmbeddingSchema,
        offsets: list,
    ) -> list[EmbeddingSchema]:
        neighbours_list = []
        base_query = f'@slug:"{embedding.slug}"'
        fields_to_return = ["text"]
        for offset in offsets:
            item_number = embedding.item_number + offset
            query = (
                Query(f"{base_query} @item_number:{item_number}")
                .return_fields(
                    *fields_to_return,
                )  # Use the .return_fields() method here
                .paging(0, 1)
            )
            res = r.ft("idx:EmbeddingIndex").search(query)
            if res.docs:  # type: ignore
                new_embedding = EmbeddingSchema(
                    slug=embedding.slug,
                    user_id=embedding.user_id,
                    deck_id=embedding.deck_id,
                    item_number=item_number,
                    item_quantity=embedding.item_quantity,
                    text=res.docs[0].text,  # type: ignore
                    source=embedding.source,
                    vector_score=0,
                    type=embedding.type,
                )
                neighbours_list.extend(new_embedding)

        return neighbours_list
