## slug needs to be documentation-0 file id needs to be 0


import asyncio

import redis as sync_redis

from dependencies.settings import get_settings
from models.doc_rows import DocRows
from models.extractors.data_extractor import chunker
from models.jobs.job_schema import EmbeddingSchema
from models.jobs.session import sync_session_factory
from models.redis_manager import RedisManager

from .doc_data import doc_text

settings = get_settings()


redis_client = sync_redis.Redis(
    host="redis-12068.c55.eu-central-1-1.ec2.cloud.redislabs.com",
    port=12068,
    password="**********",  ##TODO: add password before use
    decode_responses=True,
)


async def set_doc_as_embedding() -> None:
    i = 1
    sentences_per_chunk = 5
    min_length_chunk = 15
    processed_chunks = chunker(doc_text, sentences_per_chunk, min_length_chunk)
    jobs_to_add = []
    with sync_session_factory() as db:
        for chunk in processed_chunks:
            new_chunk = EmbeddingSchema(
                slug="0",
                type="chunk",
                user_id=None,
                text=chunk,
                deck_id=None,
                page=0,
                document="documentation",
                item_number=i,
                item_quantity=len(processed_chunks),
                source="documentation",
                state="queued",
                file_id=None,
            )
            new_doc_row = DocRows(
                user_id=None,
                deck_id=None,
                file_id=None,
                page=0,
                chunk=i,
                slug=0,
                text=chunk[:500],
            )
            jobs_to_add.append(new_doc_row)
            i += 1
            key = f"Embedding:{0}--i{i}-chunk-p{0}"
            RedisManager.cache_json_data_non_async(
                redis_client,
                key,
                new_chunk.model_dump(),
                None,
            )
        db.add_all(jobs_to_add)
        db.commit()


async def main() -> None:
    await set_doc_as_embedding()


if __name__ == "__main__":
    asyncio.run(main())
