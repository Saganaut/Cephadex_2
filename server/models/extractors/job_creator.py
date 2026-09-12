import datetime as dt
import logging
from copy import deepcopy

from redis import Redis

from models.exceptions.exceptions import (
    AudioError,
)
from models.extractors.data_extractor import ExtractData
from models.jobs.job_schema import (
    ExtractorDataSchema,
    JobSchema,
    PayloadSchema,
)
from models.models_ import JobNotification
from routes.data_classes.create_schema import CardType, ExtrasOptions

logger = logging.getLogger("App")


class JobManager:
    """JobManager as the central hub for content creation tasks, orchestrating the conversion of
    input data
    into actionable jobs for further processing. It plays a key role in the following:

    1. Data Storage: Holds data and instructions pertinent to content creation.
    2. Job Object Creation: Creates job objects based on the extract object created in data
    extractor.

    Features:
    - Slug ID: A unique identifier shared across all jobs and their corresponding notification
    entries for each extraction.
    - Audio Job Special Handling: Audio jobs undergo a two-step process. The initial step is
    transcription,
      which is queued before standard jobs for the same audio source are generated.
    - If the user selects "Mix" cards of type definitions and Mcq are created"

    """

    ## ! WATCH OUT FOR ISSUES WITH MUTABILITY OF EXTRACT OBJ AND PAYLOAD
    @staticmethod
    # @log_decorator
    def create_jobs(
        extract_obj: ExtractorDataSchema,
    ) -> tuple[JobNotification, list[JobSchema]]:
        """Create either audio job or regular jobs and matching job notification object
        returns a tuple containing the notification object and a list of jobs to be committed
        to the db
        """
        jobs_to_commit = []

        if extract_obj.extension in [".wav", ".mp3"]:
            if extract_obj.payload.card_type is CardType.Mix and extract_obj.payload.extras is None:
                extract_obj.payload.extras = [ExtrasOptions.Create_Summary]
            audio_jobs = JobManager.create_all_audio_jobs(extract_obj)
            jobs_to_commit.extend(audio_jobs)
        else:
            if extract_obj.payload.card_type == CardType.Mix:
                def_extract_obj = extract_obj
                def_extract_obj.task_type = "Definitions"
                payload = deepcopy(extract_obj.payload)
                payload.card_type = CardType.Definitions
                jobs = JobManager.standard_job_creator(def_extract_obj, payload)
                jobs_to_commit.extend(jobs)
                mcq_extract_obj = extract_obj
                mcq_extract_obj.task_type = "Mcq"
                payload = deepcopy(extract_obj.payload)
                payload.card_type = CardType.Mcq
                jobs = JobManager.standard_job_creator(mcq_extract_obj, payload)
                jobs_to_commit.extend(jobs)
                # if (
                #     extract_obj.payload.extras is not None
                #     and ExtrasOptions.Create_Notes in extract_obj.payload.extras
                # ):
                #     notes_extract_obj = extract_obj
                #     notes_extract_obj.task_type = "Create Notes"
                #     payload = deepcopy(extract_obj.payload)
                #     payload.card_type = None
                #     payload.extras = [ExtrasOptions.Create_Notes]
                #     jobs = JobManager.standard_job_creator(notes_extract_obj, payload)
                #     jobs_to_commit.extend(jobs)
                # else:
                #     summary_extract_obj = extract_obj
                #     payload = deepcopy(extract_obj.payload)
                #     payload.card_type = None
                #     summary_extract_obj.task_type = "Create Summary"
                #     payload.extras = [ExtrasOptions.Create_Summary]
                #     jobs = JobManager.standard_job_creator(
                #         summary_extract_obj, payload
                #     )
                #     jobs_to_commit.extend(jobs)

            else:
                jobs = JobManager.standard_job_creator(
                    extract_obj,
                    extract_obj.payload,
                )
                jobs_to_commit.extend(jobs)
            if (
                extract_obj.payload.extras is not None
                and ExtrasOptions.Create_Summary in extract_obj.payload.extras
            ):
                summary_extract_obj = extract_obj
                payload = deepcopy(extract_obj.payload)
                payload.card_type = None
                summary_extract_obj.task_type = "Create Summary"
                payload.extras = [ExtrasOptions.Create_Summary]
                jobs = JobManager.standard_job_creator(summary_extract_obj, payload)
                jobs_to_commit.extend(jobs)
            if (
                extract_obj.payload.extras is not None
                and ExtrasOptions.Create_Notes in extract_obj.payload.extras
            ):
                notes_extract_obj = extract_obj
                payload = deepcopy(extract_obj.payload)
                payload.card_type = None
                notes_extract_obj.task_type = "Create Notes"
                notes_extract_obj.payload.extras = [ExtrasOptions.Create_Notes]
                jobs = JobManager.standard_job_creator(notes_extract_obj, payload)
                jobs_to_commit.extend(jobs)

        job_notification = JobManager.notification_creator(extract_obj)
        job_notification.state = "queued"
        return job_notification, jobs_to_commit

    @staticmethod
    def create_redis_jobs(r_client: Redis, jobs: list[JobSchema]) -> None:
        for job in jobs:
            key = f"Job:{job.slug}:{job.task_type}:{job.item_number}/{job.item_quantity}"
            job.key = key
            job_dict = job.model_dump()
            r_client.json().set(key, "$", job_dict)
            r_client.expire(key, 3600)

    ## TODO move this to new way of handlking jobs with redis
    @staticmethod
    def create_all_audio_jobs(extract_obj: ExtractorDataSchema) -> list[JobSchema]:
        extract_obj.task_type = "audio"
        if extract_obj.file_path is None:
            msg = "No file path provided"
            raise AudioError(msg)
        if extract_obj.duration is None:
            msg = "No duration provided"
            raise AudioError(msg)
        segments = ExtractData.extract_audio(
            extract_obj.duration,
            extract_obj.file_path,
        )

        # if extract_obj.payload.card_type is CardType.Mix:
        #     extract_obj.payload.task_type = CardType.Definitions
        audio_jobs = []
        for segment in segments:
            item_number = segments.index(segment) + 1
            audio_job = JobManager.create_audio_job(
                extract_obj,
                segment,
                item_number,
                len(segments),
            )
            audio_jobs.append(audio_job)
        return audio_jobs

    # @log_decorator
    @staticmethod
    def create_audio_job(
        extract_obj: ExtractorDataSchema,
        segment: str,
        item_number: int,
        item_quantity: int,
    ) -> JobSchema:
        time_created = dt.datetime.now()
        time_created = time_created.strftime("%Y-%m-%d %H:%M:%S")
        """creates the actual audio job to be stored in the db"""
        if extract_obj.slug is None:
            logger.error("no slug, can not proceed with job creation")
            raise Exception
        if extract_obj.deck_id is None:
            logger.error("no deck_id, can not proceed with job creation")
            raise Exception
        if extract_obj.task_type is None:
            logger.error("no task_type, can not proceed with job creation")
            raise Exception

        return JobSchema(
            slug=extract_obj.slug,
            type="audio",
            state="queued",
            user_id=extract_obj.user_id,
            deck_id=extract_obj.deck_id,
            payload=extract_obj.payload,
            item_number=item_number,
            item_quantity=item_quantity,
            time_created=time_created,
            priority=0,
            text=None,
            task_type="",
            error_message=None,
            qty_cards_created=0,
            file_path=segment,
        )

    # @log_decorator
    @staticmethod
    def standard_job_creator(
        extract_obj: ExtractorDataSchema,
        payload: PayloadSchema,
    ) -> list[JobSchema]:
        if extract_obj.task_type is None and extract_obj.payload.card_type is not None:
            extract_obj.task_type = extract_obj.payload.card_type
        jobs = []
        counter = 1
        time_created = dt.datetime.now()
        time_created = time_created.strftime("%Y-%m-%d %H:%M:%S")
        total_len = len(extract_obj.split_text)
        if extract_obj.slug is None:
            logger.error("no slug, can not proceed with job creation")
            raise Exception
        if extract_obj.deck_id is None:
            logger.error("no deck_id, can not proceed with job creation")
            raise Exception
        if extract_obj.task_type is None:
            logger.error("no task_type, can not proceed with job creation")
            raise Exception
        for text in extract_obj.split_text:
            new_job = JobSchema(
                slug=extract_obj.slug,
                user_id=extract_obj.user_id,
                deck_id=extract_obj.deck_id,
                type="standard",
                item_number=counter,
                item_quantity=total_len,
                time_created=time_created,
                priority=0,
                payload=payload,
                text=text,
                processed_text=None,
                file_path=None,
                state="queued",
                error_message=None,
                qty_cards_created=0,
                task_type=extract_obj.task_type,
            )
            counter += 1
            jobs.append(new_job)
        return jobs

    @staticmethod
    # @log_decorator
    def notification_creator(extract_obj: ExtractorDataSchema) -> JobNotification:
        payload_json_str = extract_obj.payload.model_dump_json()
        return JobNotification(
            user_id=extract_obj.user_id,
            slug=extract_obj.slug,
            cost=extract_obj.tokens,
            time_created=dt.datetime.now(),
            source_type=extract_obj.source_type,
            payload=payload_json_str,
        )
