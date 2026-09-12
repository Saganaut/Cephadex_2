import logging
import os
import tempfile

from config import AISettings, AWSSettings
from models.creators.creator import AiCaller
from models.decks.card.card_factory import CardFactory
from models.decks.deck.deck_manager import DeckManager
from models.helpers.log_decorators import job_log_decorator
from models.jobs.job_schema import JobSchema
from models.jobs.session import session_factory
from models.storage.s3 import StorageManager

processing_logger = logging.getLogger("job_processing")


class JobProcessor:
    def __init__(
        self,
        job: JobSchema,
        qty_jobs: int,
        ai_settings: AISettings,
        aws_settings: AWSSettings,
    ):
        self.job: JobSchema = job
        self.slug: str = job.slug
        self.openai_caller: AiCaller = AiCaller(ai_settings, aws_settings)
        self.qty_jobs: int = qty_jobs

    @job_log_decorator
    async def process(self) -> None:
        if self.job.type == "audio":
            await self.process_audio_job()
        elif self.job.type == "standard":
            await self.process_standard_job()

    async def process_standard_job(self) -> None:
        if self.job.task_type in [
            "Create Transcription",
            "Create Notes",
            "Create Summary",
        ]:
            await self.handle_long_form()
        else:
            await self.handle_extract_terms()
        # if self.job.payload["prompt_options"]["images_opt"]:
        if self.job.payload.extras and "Generate images" in self.job.payload.extras:
            await self.handle_images()

    # @job_log_decorator
    async def handle_long_form(self) -> None:
        response = None
        ## TODO this wont work as transcribe_whisper expects an audio file - investigate
        if self.job.text is None:
            msg = "No text provided for transcription job"
            raise ValueError(msg)
        if self.job.type == "Create Transcription":
            response = await self.openai_caller.transcribe_whisper(self.job.text)
        else:
            if self.job.task_type in ["Create Notes", "Create Summary"]:
                response = await self.openai_caller.summarize(self.job.text)
            self.job.processed_text = response

    # @job_log_decorator
    async def handle_extract_terms(self) -> None:
        if self.job.text is None:
            msg = "No text provided for transcription job"
            raise ValueError(msg)
        response = await self.openai_caller.extract_terms(
            self.job.text,
            self.job.payload,
        )
        if response is None:
            msg = "No response from extract terms"
            raise Exception(msg)  # noqa: TRY002
        async with session_factory() as session:
            deck = await DeckManager.retrieve_deck_and_load_cards(
                session,
                self.job.deck_id,
            )
            ## The unique() method must be invoked on this Result,
            # as it contains results that include joined eager loads against collections
            card_factory = CardFactory(session, deck)
            await card_factory.async_create_cards(
                response,
                self.job.task_type,
            )
            self.job.processed_text = str(response)
            self.job.qty_cards_created = card_factory.card_counter
            await session.commit()

    async def handle_images(self) -> None:
        pass

    # @job_log_decorator

    @job_log_decorator
    async def process_audio_job(self) -> None:
        if self.job.file_path is None:
            msg = "No file path specified"
            raise ValueError(msg)
        object_data = StorageManager.get_s3_object_in_folder(
            "audio_segments",
            self.job.file_path,
        )
        if isinstance(object_data, bool):
            msg = "Could not find audio segment in s3"
            raise Exception(msg)  # noqa: TRY004, TRY002
        temp_segments_dir = "temp/segments"
        os.makedirs(temp_segments_dir, exist_ok=True)  # noqa: PTH103

        segment = object_data["Body"].read()
        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".mp3",
            dir=temp_segments_dir,
        )
        temp_file.write(segment)
        temp_file.seek(0)
        temp_file.close()

        text = await self.openai_caller.transcribe_whisper(temp_file.name)

        StorageManager.delete_s3_object_in_folder("audio_segments", self.job.file_path)
        os.remove(temp_file.name)  # noqa: PTH107
        if isinstance(text, str):
            self.job.processed_text = text
        else:
            msg = "Error transcribing audio"
            raise TypeError(msg)
