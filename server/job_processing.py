import asyncio

import redis.asyncio as redis_async
import sentry_sdk
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# import logging
from dependencies.settings import get_settings
from models.embeddings.embeddings import EmbeddingsProcessor
from models.embeddings.embeddings_batch import EmbeddingsBatch
from models.helpers.log_decorators import job_log_decorator
from models.jobs.job_batch import JobBatch
from models.jobs.job_finder import JobFinder
from models.jobs.redis import async_pool
from startup.setup_loggers import setup_processing_logger

logger = setup_processing_logger()

settings = get_settings()

# logger = logging.getLogger("job_processing")

engine = create_async_engine(
    settings.db.async_sqlalchemy_database_uri,
    **settings.db.async_sqlalchemy_engine_options,
)

session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

semaphore = asyncio.Semaphore(settings.job_processing.max_concurrent_embeddings)


async def wait_for_redis_ready(max_attempts: int = 3, delay: float = 2.0) -> None:
    """Wait for Redis and RediSearch module to be fully ready before starting job processing."""
    logger.info("Checking Redis readiness...")

    for attempt in range(1, max_attempts + 1):
        try:
            async with redis_async.Redis(connection_pool=async_pool) as r_async:
                await r_async.ping()
                logger.debug("Redis ping successful (attempt {attempt})")
                try:
                    await r_async.execute_command("FT.INFO", "nonexistent_test_index")
                except Exception as e:
                    error_msg = str(e).lower()
                    if "unknown index name" in error_msg or "no such index" in error_msg:
                        # This is the expected error when RediSearch is working properly
                        logger.info("RediSearch module is ready (attempt %s)", attempt)
                        return
                    else:
                        # Other RediSearch-related error
                        logger.warning(
                            "RediSearch not ready: %s (attempt %s/%s)",
                            error_msg,
                            attempt,
                            max_attempts,
                        )

        except (ConnectionError, TimeoutError) as e:
            logger.warning("Redis connection failed (attempt %s/%s): %s", attempt, max_attempts, e)
        except Exception as e:
            logger.warning(
                "Redis readiness check failed (attempt %s/%s): %s",
                attempt,
                max_attempts,
                e,
            )

        if attempt < max_attempts:
            logger.info("Waiting %s seconds before retry...", delay)
            await asyncio.sleep(delay)

    msg = f"Redis/RediSearch not ready after {max_attempts} attempts"
    raise RuntimeError(msg)


##TODO: Re-enable embeddings or move to new worker when functionality is fixed
@job_log_decorator
async def process_jobs() -> None:
    # embeddings_check_interval = 5  # Check every 5 iterations
    # loop_counter = 0
    """Main job_processing function.  Here we find all pending jobs, put them into batches,
    create a JobBatch object for each batch, and then process each batch.
    """
    while True:
        try:
            async with redis_async.Redis(connection_pool=async_pool) as r_async, semaphore:
                await handle_jobs(r_async)
                # if loop_counter % embeddings_check_interval == 0:
                #     await handle_embeddings(r_async)
                #     loop_counter = 0
                # loop_counter += 1
                await asyncio.sleep(1)
        except (ConnectionError, TimeoutError):
            logger.exception("Redis connection error")
            await asyncio.sleep(5)
            continue
        except Exception:
            logger.exception("Unexpected error")
            await asyncio.sleep(5)
            continue


async def handle_jobs(r_async: redis_async.Redis) -> None:
    # logger.debug("handling jobs")
    jobs = []
    try:
        jobs = await JobFinder.find_pending_jobs(r_async)
    except Exception:
        logger.exception("Error finding pending jobs")
    batched_jobs = {}
    background_tasks = set()

    if jobs:
        for job in jobs:
            job.state = "pending"
            slug = job.slug
            if slug not in batched_jobs:
                batched_jobs[slug] = JobBatch(slug)
            batched_jobs[slug].add_job(job)
    if batched_jobs:
        for batch in batched_jobs.values():
            logger.debug("Processing new batch: %s", batch.slug)
            task = asyncio.create_task(batch.process())
            background_tasks.add(task)
            task.add_done_callback(background_tasks.discard)


async def handle_embeddings(r_async: redis_async.Redis) -> None:
    # logger.debug("Entered handle_embeddings")
    embeddings = []
    try:
        embeddings = await EmbeddingsProcessor.find_pending_embeddings(r_async)
    except Exception:
        logger.exception("Error finding pending embeddings")
    batched_embeddings = {}
    background_tasks = set()

    if embeddings:
        for embedding in embeddings:
            embedding.state = "pending"
            slug = embedding.slug
            if slug not in batched_embeddings:
                batched_embeddings[slug] = EmbeddingsBatch(slug)
            batched_embeddings[slug].add_job(embedding)
    if batched_embeddings:
        for batch in batched_embeddings.values():
            logger.debug("Processing new embeddings batch: %s", batch.slug)
            task = asyncio.create_task(batch.process())
            background_tasks.add(task)
            task.add_done_callback(background_tasks.discard)


async def main() -> None:
    """Main entry point that ensures Redis is ready before starting job processing."""
    logger.info("Starting job processing")
    logger.info("Environment is: %s", settings.app.environment)
    if settings.app.environment == "development":
        logger.info("Development environment")
        logger.info(settings.app)
        logger.info(settings.redis)
    if settings.monitoring.monitoring_enabled:
        logger.info("monitoring enabled")
        sentry_sdk.init(
            dsn=settings.monitoring.sentry_dsn,
            traces_sample_rate=settings.monitoring.traces_sample_rate,
            profiles_sample_rate=settings.monitoring.profiles_sample_rate,
        )

    # Wait for Redis and RediSearch to be ready before starting job processing
    try:
        await wait_for_redis_ready()
        logger.info("Redis is ready, starting job processing loop...")
        await process_jobs()
    except Exception:
        logger.exception("Failed to start job processing")
        raise


if __name__ == "__main__":
    asyncio.run(main())
