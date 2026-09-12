import asyncio
import json
import logging

from asyncpg import ForeignKeyViolationError
from openai import AsyncOpenAI
from redis.asyncio import Redis as RedisAsync
from redis.commands.search.field import (
    NumericField,
    TextField,
    VectorField,
)
from redis.commands.search.indexDefinition import IndexDefinition, IndexType

from dependencies.settings import get_settings
from models.doc_rows import DocRows
from models.jobs.job_schema import EmbeddingSchema
from models.jobs.session import session_factory

log = logging.getLogger("App")
settings = get_settings()

VECTOR_DIMENSION = 1536


class EmbeddingsProcessor:
    def __init__(self):
        self.openai = AsyncOpenAI(api_key=settings.ai.openai_api_key)

    async def process_embeddings(
        self,
        embeddings: list[EmbeddingSchema],
        r_async: RedisAsync,
        page: int,
        emb_type: str = "chunk",
    ) -> None:
        processed_embeddings = []
        for embedding in embeddings:
            response = await self.openai.embeddings.create(
                input=embedding.text,
                model="text-embedding-3-small",
                dimensions=VECTOR_DIMENSION,
            )
            embedding.state = "complete"
            embedding.embedding = response.data[0].embedding
            processed_embeddings.append(embedding)

        pipeline = r_async.pipeline()
        for embedding in processed_embeddings:
            key = f"Embedding:{embedding.slug}--i{embedding.item_number}-{emb_type}-p{page}"
            updated_embedding_data = embedding.model_dump()
            pipeline.json().set(key, "$", updated_embedding_data)
        await pipeline.execute()

    @staticmethod
    async def find_pending_embeddings(r_async) -> list[EmbeddingSchema] | None:
        """Once we find some embeddings we are conducting a second search to make sure we have all
        of them of the same batch, the 1 second delay serves 2 purposes
        to ensure we have all of the embedding jobs from the same batch, as mentioned above,
        and also to ensure that the deck has been created in the db by the time
        we are creating new rows that reference that deck
        """
        try:
            slug_search_result = await r_async.execute_command(
                "FT.SEARCH",
                "idx:EmbeddingIndex",
                '@state:"queued"',
            )
            if slug_search_result is None:
                return None
        except Exception as e:
            if "no such index" in str(e):
                try:
                    log.info("Creating EmbeddingIndex...")
                    await create_embeddings_index(r_async)
                    log.info("EmbeddingIndex created successfully")

                    # Verify the index was actually created
                    try:
                        info_result = await r_async.execute_command("FT.INFO", "idx:EmbeddingIndex")
                        log.info(f"EmbeddingIndex verified: {info_result[:50]}...")  # First 50 chars
                    except Exception as verify_e:
                        log.error(f"Failed to verify EmbeddingIndex creation: {verify_e}")

                except Exception as create_e:
                    log.error(f"Failed to create EmbeddingIndex: {create_e}")
                    raise create_e
            else:
                raise e
        embeddings = []
        embeddings = await EmbeddingsProcessor.add_embeddings_and_update_redis(
            slug_search_result,
            r_async,
            embeddings,
        )
        await asyncio.sleep(1)
        if embeddings:
            processed_slugs = []
            for job in embeddings:
                if job.slug not in processed_slugs:
                    processed_slugs.append(job.slug)
                    slug_search_result = await r_async.execute_command(
                        "FT.SEARCH",
                        "idx:EmbeddingIndex",
                        f'(@slug:"{job.slug}" @state:"queued")',
                    )
                    if slug_search_result is None:
                        continue
                    new_jobs = await EmbeddingsProcessor.add_embeddings_and_update_redis(
                        slug_search_result,
                        r_async,
                        embeddings,
                    )
                    embeddings.extend(new_jobs)
        return embeddings

    @staticmethod
    async def add_embeddings_and_update_redis(
        slug_search_result: list,
        r_async: RedisAsync,
        embeddings: list,
    ) -> list:
        for i in range(1, len(slug_search_result), 2):
            key = slug_search_result[i]
            embedding_json = slug_search_result[i + 1][1]
            embedding_data = json.loads(embedding_json)
            embedding = EmbeddingSchema(**embedding_data)
            embedding.state = "pending"
            embeddings.append(embedding)
            updated_embedding_data = embedding.model_dump()
            await r_async.json().set(key, "$", updated_embedding_data)  # type: ignore
        return embeddings

    @staticmethod
    async def create_rows_in_db(jobs: list[EmbeddingSchema], page: int) -> None:
        try:
            async with session_factory() as db:
                jobs_to_add = []
                for job in jobs:
                    new_doc_row = DocRows(
                        user_id=job.user_id,
                        deck_id=job.deck_id,
                        file_id=job.file_id,
                        page=page,
                        chunk=job.item_number,
                        slug=job.slug,
                        text=job.text[:500],
                    )
                    jobs_to_add.append(new_doc_row)
                db.add_all(jobs_to_add)
                await db.commit()
        except ForeignKeyViolationError as e:
            detail_start = str(e).find("DETAIL:")
            if detail_start != -1:
                detail_msg = str(e)[detail_start:]
            else:
                detail_msg = "No additional detail available."
            log.exception("Error creating rows in db for embeddings %s", detail_msg)


async def create_embeddings_index(r_async: RedisAsync) -> None:
    schema = (
        TextField("$.slug", as_name="slug"),
        NumericField("$.item_number", as_name="item_number"),
        NumericField("$.deck_id", as_name="deck_id"),
        NumericField("$.user_id", as_name="user_id"),
        TextField("$.state", as_name="state"),
        TextField("$.text", as_name="text"),
        TextField("$.type", as_name="type"),
        NumericField("$.page", as_name="page"),
        NumericField("$.file_id", as_name="file_id"),
        VectorField(
            "$.embedding",
            "FLAT",
            {
                "TYPE": "FLOAT32",
                "DIM": VECTOR_DIMENSION,
                "DISTANCE_METRIC": "COSINE",
            },
            as_name="embedding",
        ),
    )
    definition = IndexDefinition(prefix=["Embedding:"], index_type=IndexType.JSON)
    try:
        await r_async.ft("idx:EmbeddingIndex").create_index(
            fields=schema,
            definition=definition,
        )
    except Exception:
        log.exception("Error creating embeddinsg index")
    await r_async.ft("idx:EmbeddingIndex").info()
