import asyncio
import logging
from typing import Optional

import redis.asyncio as redis_async
from redis.asyncio import Redis as RedisAsync
from sqlalchemy.ext.asyncio import AsyncSession

from config import Settings, TokenSettings
from dependencies.settings import get_settings
from models.creators.creator import AiCaller
from models.decks.card.card_factory import CardFactory
from models.decks.deck.deck_manager import DeckManager
from models.decks.deck.doc_factory import DocFactory
from models.exceptions.job_processing_exceptions import JobProcessingExceptions
from models.helpers.log_decorators import job_log_decorator
from models.jobs.job_finder import JobFinder
from models.jobs.job_processor import JobProcessor
from models.jobs.job_schema import JobSchema
from models.jobs.redis import async_pool
from models.jobs.session import session_factory
from models.models_ import DeckAttributes, JobNotification  # noqa: TCH001
from models.redis_manager import RedisManager
from models.user.user_manager import UserManager
from routes.data_classes.create_schema import CardType, ExtrasOptions

log = logging.getLogger("job_processing")
settings = get_settings()
semaphore = asyncio.Semaphore(settings.job_processing.max_concurrent_tasks)

""" This class is the primary hub for content creation tasks, orchestrating all the jobs involved
with a a card or document creation process, semaphores are used to limit concurrency as
everything is done
asynchronously"""


CARDS_PER_JOB = 1


class JobBatch:
    def __init__(self, slug: str) -> None:
        self.slug: str = slug
        self.jobs: list[JobSchema] = []
        self.failed_jobs: list[JobSchema] = []
        self.error_ratio: float = 0
        self.doc_creator: Optional[DocFactory] = None
        self.text: Optional[str] = None
        self.attributes: Optional[DeckAttributes] = None
        self.job_notification: Optional[JobNotification] = None
        self.card_created: int = 0
        self.sufficient_cards: bool = True

    def add_job(self, job: JobSchema) -> None:
        self.jobs.append(job)

    # @job_log_decorator
    async def process(self) -> None:
        async with redis_async.Redis(connection_pool=async_pool) as r_client:
            self.deck_id = self.jobs[0].deck_id
            qty_jobs = await self.estimate_qty_jobs()
            await r_client.publish(self.slug, f"qty:{qty_jobs}")
            tasks = [self.process_job_with_semaphore(job, r_client) for job in self.jobs]
            await asyncio.gather(*tasks)

            try:
                await self.handle_completion(r_client, settings)
            except Exception as e:  # noqa: BLE001
                await r_client.publish(self.slug, "error:handling completion")
                log.critical("Error handling completion: %s", str(e))

    # @job_log_decorator
    async def estimate_qty_jobs(self) -> int:
        qty_jobs = len(self.jobs)
        if self.jobs[0].type == "audio":
            if self.jobs[0].payload.card_type == CardType.Mix:
                qty_jobs = qty_jobs * 4
            elif self.jobs[0].payload.extras is not None and (
                ExtrasOptions.Create_Notes in self.jobs[0].payload.extras
                or ExtrasOptions.Create_Summary in self.jobs[0].payload.extras
            ):
                qty_jobs = qty_jobs * 3
            else:
                qty_jobs = qty_jobs * 2
        return qty_jobs

    # @job_log_decorator
    async def process_job_with_semaphore(self, job: JobSchema, r_client: RedisAsync) -> None:
        async with semaphore:
            job_to_process = JobProcessor(
                job,
                len(self.jobs),
                settings.ai,
                settings.aws,
            )
            max_attempts = settings.job_processing.max_job_processor_attempts
            for attempt in range(1, max_attempts + 1):
                try:
                    await job_to_process.process()
                    await self.publish_job_complete(job, r_client)
                    break
                except Exception as e:
                    log.exception(
                        "Error while in attempt JobProcessor.process, slug %s",
                        job.slug,
                    )
                    if attempt == max_attempts:
                        log.exception("Max attempts reached, abandonning: %s", job.slug)
                        await self.publish_job_failed(job, r_client, e)

    ## Disabling add more cards for now
    ## Disabling create deck covers due to cost
    @job_log_decorator
    async def handle_completion(self, r_client: RedisAsync, settings: Settings) -> None:
        async with session_factory() as session:
            self.doc_creator = await DocFactory.create(
                session,
                self.deck_id,
                settings.ai,
                settings.aws,
            )
            task_type = self.jobs[0].type
            if self.doc_creator is None:
                raise JobProcessingExceptions.DocCreatorNotInitializedError
            if task_type == "audio":
                await self.reassemble_audio_transcript(self.doc_creator)
                await self.turn_audio_jobs_into_regular_jobs(r_client)
            else:
                try:
                    await self.reassemble_long_form(self.doc_creator, r_client)
                    await self.create_deck_attributes(self.doc_creator)
                    # await self.create_deck_cover(self.doc_creator)
                    await self.check_sufficient_cards_created()
                    if self.sufficient_cards is False:
                        await self.add_more_cards(session, settings)
                except Exception:
                    log.exception("Error handling completion work")

                await self.publish_notification(session, r_client, settings.token)

    @staticmethod
    async def publish_job_failed(job: JobSchema, r_client: RedisAsync, e: Exception) -> None:
        job.state = "failed"
        job.error_message = str(e)[:100]
        job_dict = job.model_dump()
        string_key = str(job.key)
        await r_client.json().set(
            string_key,
            "$",
            job_dict,
        )  # type: ignore ## THis type error is innacurate, ignore
        await r_client.expire(str(job.key), 3600)
        await r_client.publish(job.slug, "error:processing job")
        await r_client.expire(job.slug, 360000)

    @staticmethod
    async def publish_job_complete(job: JobSchema, r_client: RedisAsync) -> None:
        log.debug("Publishing job complete")
        job.state = "complete"
        job_dict = job.model_dump()
        await r_client.json().set(
            str(job.key),
            "$",
            job_dict,
        )  # type: ignore ## THis type error is innacurate, ignore
        await r_client.expire(str(job.key), 3600)

        await r_client.publish(
            job.slug,
            f"complete:{job.task_type}{job.item_number}/{job.item_quantity}",
        )
        await r_client.expire(job.slug, 3600)

    @job_log_decorator
    async def create_deck_cover(self, doc_creator: DocFactory) -> None:
        retries = 0
        max_attempts = 2
        while retries < max_attempts:
            try:
                await doc_creator.create_image_for_deck()
                break
            except Exception:
                log.exception("Error creating deck cover")
                retries += 1
                await asyncio.sleep(retries)
                continue

    @job_log_decorator
    async def reassemble_long_form(self, doc_creator: DocFactory, r_client: RedisAsync) -> None:
        long_form_jobs = [
            job for job in self.jobs if job.task_type in settings.job_processing.long_form_jobs
        ]
        try:
            if long_form_jobs:
                job_type = long_form_jobs[0].task_type
                if job_type == "Create Notes":
                    self.text = await doc_creator.create_cornell_notes_with_claude(
                        long_form_jobs,
                    )
                if job_type == "Create Transcription":
                    self.text = await doc_creator.async_save_transcript(long_form_jobs)
                if job_type == "Create Summary":
                    self.text = await doc_creator.summarize_with_claude(long_form_jobs)
            # self.text = await self.doc_creator.async_create_doc(long_form_jobs)
        except Exception as e:
            log.exception("Error reassembling long form")
            for job in long_form_jobs:
                job.state = "failed"
                job.error_message = str(e)[:100]
                job_dict = job.model_dump()
                r_client.json().set(str(job.key), "$", job_dict)
                await r_client.expire(str(job.key), 3600)

    @job_log_decorator
    async def reassemble_audio_transcript(self, doc_creator: DocFactory) -> None:
        audio_jobs = []
        # for job in self.jobs:
        #     if job.type == "audio":
        #         audio_jobs.append(job)
        #         # self.jobs.remove(job)
        audio_jobs = [job for job in self.jobs if job.type == "audio"]
        if audio_jobs:
            await doc_creator.async_save_transcript(audio_jobs)

    @job_log_decorator
    async def create_deck_attributes(self, doc_creator: DocFactory) -> None:
        if self.text is None:
            self.text = self.jobs[0].text
        if self.text is None:
            msg = "No text provided for deck attributes"
            raise JobProcessingExceptions.UnableToCreateDeckAttributesError(msg)
        self.attributes = await doc_creator.async_create_deck_attributes(
            self.text[: settings.job_processing.max_characters_deck_attributes_text],
        )

    async def check_sufficient_cards_created(self) -> None:
        non_long_form_jobs = [
            job for job in self.jobs if job.task_type not in settings.job_processing.long_form_jobs
        ]
        len_non_long_form_jobs = len(non_long_form_jobs)
        total_cards_created = 0
        for job in non_long_form_jobs:
            total_cards_created += job.qty_cards_created

        if total_cards_created / CARDS_PER_JOB < len_non_long_form_jobs:
            self.sufficient_cards = False

    @job_log_decorator
    async def publish_notification(
        self,
        session: AsyncSession,
        r_client: RedisAsync,
        token_settings: TokenSettings,
    ) -> None:
        job_notification = await JobFinder.find_pending_notification(session, self.slug)
        status = await self.check_completion_rate(self.slug, r_client)
        if status == "complete":
            job_notification.state = "ready"
            await r_client.publish(self.slug, f"ready:{self.deck_id}")
        if status == "failed":
            job_notification.state = "failed"
            await r_client.publish(self.slug, f"failed:{self.deck_id}")
            user = await UserManager.refund_credit(
                session,
                job_notification.user_id,
                job_notification.cost,
                token_settings,
            )
            await RedisManager.cache_json_data(
                r_client,
                f"user_{user.id}",
                user.to_dict(),
                180,
            )
        await session.commit()

    @job_log_decorator
    async def check_completion_rate(self, slug: str, r_client: RedisAsync) -> str:
        jobs = await r_client.execute_command(
            "FT.SEARCH",
            "JobIndex",
            f'@slug:"{slug}"',
            "RETURN",
            1,
            "state",
        )
        decoded_states = decode_recursive(jobs)  # type: ignore
        if decoded_states is None:
            msg = "Unable to decode jobs, no jobs found"
            raise Exception(msg)  # noqa: TRY002
        states = [result[1] for result in decoded_states[2:]]  # type: ignore
        complete = states.count("complete")
        failed = states.count("failed")
        pending = states.count("pending")
        if pending > 0:
            log.critical("pending jobs found for slug %s, decoded_states: %s", slug, decoded_states)
        if complete + failed == 0:
            log.critical("no jobs found for slug %s, decoded_states: %s", slug, decoded_states)
        if complete / max((complete + failed), 1) > (
            1 - settings.job_processing.acceptable_error_ratio
        ):
            return "complete"

        return "failed"

    @job_log_decorator
    async def add_more_cards(self, session: AsyncSession, settings: Settings) -> None:
        open_ai_caller = AiCaller(settings.ai, settings.aws)
        cards = await open_ai_caller.add_more_cards(self.attributes)
        deck = await DeckManager.retrieve_deck_and_load_cards(session, self.deck_id)
        card_factory = CardFactory(session, deck)
        await card_factory.async_create_cards(cards, "Mcq")

    @job_log_decorator
    async def turn_audio_jobs_into_regular_jobs(self, r_client: RedisAsync) -> None:
        new_jobs = []
        for job in self.jobs:
            if job.payload.card_type == CardType.Mix:
                new_job = self.create_new_job_from_audio_job(job, CardType.Definitions)
                new_jobs.append(new_job)
                new_job = self.create_new_job_from_audio_job(job, CardType.Mcq)
                new_jobs.append(new_job)
                new_job = self.create_new_job_from_audio_job(job, "Create Summary")
                new_jobs.append(new_job)
            else:
                new_job = self.create_new_job_from_audio_job(job, job.payload.card_type)
                new_jobs.append(new_job)
            if job.payload.extras is not None and ExtrasOptions.Create_Notes in job.payload.extras:
                new_job = self.create_new_job_from_audio_job(job, "Create Notes")
                new_jobs.append(new_job)

            elif (
                job.payload.extras is not None
                and ExtrasOptions.Create_Summary in job.payload.extras
            ):
                new_job = self.create_new_job_from_audio_job(job, "Create Summary")
                new_jobs.append(new_job)
        await self.send_jobs_to_redis(r_client, new_jobs)

    @job_log_decorator
    async def send_jobs_to_redis(self, r_client: RedisAsync, new_jobs: list[JobSchema]) -> None:
        async def set_and_expire_job(job: JobSchema) -> None:
            key = f"Job:{job.slug}:{job.task_type}:S:{job.item_number}/{job.item_quantity}"
            job.key = key
            job_dict = job.model_dump()
            r_client.json().set(key, "$", job_dict)
            await r_client.expire(key, 3600)

        await asyncio.gather(*(set_and_expire_job(job) for job in new_jobs))

    def create_new_job_from_audio_job(
        self,
        job: JobSchema,
        job_type: str | CardType | None,
    ) -> JobSchema:
        payload = job.payload
        if isinstance(job_type, CardType):
            payload.card_type = job_type

        if job_type is None:
            msg = "job_type cannot be None"
            raise ValueError(msg)
        return JobSchema(
            slug=job.slug,
            type="standard",
            payload=payload,
            state="queued",
            user_id=job.user_id,
            item_number=job.item_number,
            item_quantity=job.item_quantity,
            time_created=job.time_created,
            deck_id=job.deck_id,
            text=job.processed_text,
            priority=0,
            qty_cards_created=0,
            task_type=job_type,
            error_message=None,
        )

    async def cache_results(self, session: AsyncSession) -> None:
        pass


def decode_recursive(data: bytes | list) -> bytes | list | str:
    if isinstance(data, bytes):
        return data.decode("utf-8")
    if isinstance(data, list):
        return [decode_recursive(item) for item in data]
    return data
