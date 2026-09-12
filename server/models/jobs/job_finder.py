import asyncio
import json
import logging
from typing import Sequence

from redis.asyncio import Redis as RedisAsync
from redis.exceptions import ResponseError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.exceptions.job_processing_exceptions import JobProcessingExceptions
from models.helpers.log_decorators import job_log_decorator
from models.jobs.job_schema import JobSchema
from models.models_ import JobNotification

logger = logging.getLogger("job_processing")

JOB_EXPIRATION = 3600


class JobFinder:
    @staticmethod
    async def find_pending_jobs(r_async: RedisAsync) -> list[JobSchema] | None:
        """We're finding all pending jobs, then conducting a second search 1 second later to
        make sure no batches are divided into 2
        consider increasing to 2 seconds if batching problem persists.
        Ideally this is refactored to have a pubsub and another queue but adds complexity that ma
        y not be necessary now
        """
        try:
            slug_search_result = await r_async.execute_command(
                "FT.SEARCH",
                "JobIndex",
                '@state:"queued"',
            )
            if slug_search_result is None:
                return None
            jobs = []
            jobs = await JobFinder.add_jobs_and_update_redis(
                slug_search_result,
                r_async,
                jobs,
            )
            if jobs:
                await asyncio.sleep(1)
                processed_slugs = []
                for job in jobs:
                    if job.slug not in processed_slugs:
                        processed_slugs.append(job.slug)
                        slug_search_result = await r_async.execute_command(
                            "FT.SEARCH",
                            "JobIndex",
                            f'(@slug:"{job.slug}" @state:"queued")',
                        )
                        if slug_search_result is None:
                            continue
                        new_jobs = await JobFinder.add_jobs_and_update_redis(
                            slug_search_result,
                            r_async,
                            jobs,
                        )
                        jobs.extend(new_jobs)
            return jobs

        except ResponseError as e:
            if "no such index" in str(e).lower():
                try:
                    logger.info("Creating JobIndex...")
                    result = await r_async.execute_command(
                        "FT.CREATE",
                        "JobIndex",
                        "ON",
                        "JSON",
                        "PREFIX",
                        "1",
                        "Job:",
                        "SCHEMA",
                        "$.slug",
                        "AS",
                        "slug",
                        "TEXT",
                        "$.task_type",
                        "AS",
                        "task_type",
                        "TEXT",
                        "$.state",
                        "AS",
                        "state",
                        "TEXT",
                    )
                    logger.info(f"JobIndex created successfully: {result}")

                    # Verify the index was actually created
                    try:
                        info_result = await r_async.execute_command("FT.INFO", "JobIndex")
                        logger.info(f"JobIndex verified: {info_result[:50]}...")  # First 50 chars
                    except Exception as verify_e:
                        logger.error(f"Failed to verify JobIndex creation: {verify_e}")

                except Exception as create_e:
                    logger.error(f"Failed to create JobIndex: {create_e}")
                    raise JobProcessingExceptions.FindingPendingJobsError from create_e
                return []
            else:
                raise JobProcessingExceptions.FindingPendingJobsError from e

    @staticmethod
    async def add_jobs_and_update_redis(
        slug_search_result,
        r_async: RedisAsync,
        jobs: list,
    ) -> list:
        for i in range(1, len(slug_search_result), 2):
            key = slug_search_result[i]
            job_json = slug_search_result[i + 1][1]
            job_json = job_json.decode("utf-8")
            job_data = json.loads(job_json)
            job = JobSchema(**job_data)
            job.state = "pending"
            jobs.append(job)
            updated_job_data = job.model_dump()
            await r_async.json().set(
                key,
                "$",
                updated_job_data,
            )  ## ignore this warning, type issues with redis asyncio
            await r_async.expire(key, JOB_EXPIRATION)
        return jobs

    @staticmethod
    @job_log_decorator
    async def find_pending_notifications(
        session: AsyncSession,
    ) -> Sequence[JobNotification]:
        result = await session.execute(
            select(JobNotification).filter_by(state="queued"),
        )
        return result.scalars().all()

    @staticmethod
    @job_log_decorator
    async def find_pending_notification(
        session: AsyncSession,
        slug: str,
    ) -> JobNotification:
        result = await session.execute(
            select(JobNotification).filter_by(state="queued", slug=slug),
        )
        return result.scalar_one()
