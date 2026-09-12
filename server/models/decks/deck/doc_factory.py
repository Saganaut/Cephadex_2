import datetime as dt
import logging
import random

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from config import (
    AISettings,
    AWSSettings,
)
from models.creators.creator import AiCaller
from models.helpers.log_decorators import job_log_decorator
from models.jobs.job_schema import JobSchema
from models.models_ import Deck, DeckAttributes, DeckFiles
from tools.lists import SUMMARY_FILE_NAMES

""" Contains both async and regular methods - but only used for async at the moment
This object us used to create documents by reassembling processed content from jobs and saving them
in the db
We additionally use this object to create deck attributes
"""
IMAGE_PROMPT = """Generate an abstract and colorful image suitable for a deck cover.
The deck is related to {topic}. Avoid including any text or recognizable symbols.
Ensure that the composition is visually striking and suitable as a cover for a presentation deck."""

log = logging.getLogger("job_processing")


class DocFactory:
    def __init__(
        self,
        session: AsyncSession,
        deck_id: int,
        ai_settings: AISettings,
        aws_settings: AWSSettings,
        prompt_options: dict | None = None,  # noqa: ARG002
    ) -> None:
        self.deck_id: int = deck_id
        self.open_ai_caller = AiCaller(ai_settings, aws_settings)
        self.session: AsyncSession = session
        self.settings: AISettings = ai_settings

    @classmethod
    async def create(
        cls,
        session: AsyncSession,
        deck_id: int,
        ai_settings: AISettings,
        aws_settings: AWSSettings,
    ) -> "DocFactory":
        instance = cls(session, deck_id, ai_settings, aws_settings)

        await instance.set_deck()
        return instance

    async def set_deck(self) -> None:
        stmt = select(Deck).filter_by(id=self.deck_id).options(selectinload(Deck.deck_files))
        result = await self.session.execute(stmt)
        deck = result.scalars().unique().all()
        self.deck = deck[0]

    async def save_transcript(self, content: list) -> None:
        full_text = "".join(job.processed_content for job in content)
        chosen_name = (
            f"{random.choice(SUMMARY_FILE_NAMES)}_Audio_Transcript {random.randint(1, 99)}"  # noqa: S311
        )
        new_file_to_be_stored = DeckFiles(
            file_name=chosen_name[:100],
            text_string=full_text,
            create_type="Audio Transcript",
            time_created=dt.datetime.now(),
        )
        self.session.add(new_file_to_be_stored)
        self.deck.deck_files.append(new_file_to_be_stored)
        await self.session.flush()

    @job_log_decorator
    async def create_image_for_deck(self) -> None:
        if self.deck.img is not None:
            return
        style = "modern and colorful"
        prompt = f"""Generate a {style} image related to {self.deck.topic}.
        Don't include any text or symbols. Ensure that the composition is visually striking.
        The image should have purple, orange and blue as the main color palette"""
        img_url = await self.open_ai_caller.create_image(
            prompt,
            self.settings.images_model,
            size=self.settings.image_size,
        )
        if img_url:
            await self.open_ai_caller.save_image_to_deck(img_url, self.deck)

    @job_log_decorator
    async def create_deck_attributes(self, text: str) -> "DeckAttributes":
        ## creates a deck attribute row
        ## assigns relevant attributes to deck if missing, if not just stores the row
        ## One deck can be associated with many attributes

        response = await self.open_ai_caller.extract_deck_attributes(text)
        response = response[0]
        subject = response["subject"][:50]
        topic = response["topic"][:100]
        concepts = (", ".join(response["concepts"]))[:200]
        difficulty = response["difficulty"][:50]
        language = response["language"][:50]
        attributes = DeckAttributes(
            deck_id=self.deck_id,
            subject=subject,
            topic=topic,
            concepts=concepts,
            grade=difficulty,
            language=language,
        )
        self.session.add(attributes)
        self.assign_attributes_to_deck(self.deck, attributes)
        await self.session.flush()
        return attributes

    @job_log_decorator
    def assign_attributes_to_deck(
        self,
        deck: Deck,
        deck_attributes: DeckAttributes,
    ) -> None:
        if deck.subject is None:
            deck.subject = deck_attributes.subject
        if deck.topic is None:
            deck.topic = deck_attributes.topic
        if deck.description is None:
            deck.description = deck_attributes.concepts

    @job_log_decorator
    async def summarize_with_claude(self, content: list[JobSchema]) -> str:
        full_text = "".join(
            job.processed_text if job.processed_text is not None else "" for job in content
        )
        language = content[0].payload.language
        language_prompt = f"in {language}" if language is not None else ""
        processed_text = await self.open_ai_caller.reformat_with_claude(
            full_text,
            language_prompt,
        )
        deck_name = self.deck.name
        chosen_name = f"Summary-{deck_name}-{random.choice(SUMMARY_FILE_NAMES)}"  # noqa: S311
        file_storage = DeckFiles(
            file_name=chosen_name[:100],
            text_string=processed_text,
            create_type="Summary",
        )
        self.session.add(file_storage)
        await self.session.flush()
        self.deck.deck_files.append(file_storage)
        await self.session.commit()
        return full_text

    @job_log_decorator
    async def create_cornell_notes_with_claude(self, content: list[JobSchema]) -> str:
        log.debug("Entered create_cornell_notes_with_claude")
        full_text = "".join(
            job.processed_text if job.processed_text is not None else "" for job in content
        )
        language = content[0].payload.language
        language_prompt = f"in {language}" if language is not None else ""

        processed_text = await self.open_ai_caller.create_cornell_notes_with_claude(
            full_text,
            language_prompt,
        )
        deck_name = self.deck.name
        chosen_name = f"Notes-{deck_name}-{random.choice(SUMMARY_FILE_NAMES)}"  # noqa: S311
        file_storage = DeckFiles(
            file_name=chosen_name[:100],
            text_string=processed_text,
            create_type="Notes",
        )
        self.session.add(file_storage)
        await self.session.flush()
        self.deck.deck_files.append(file_storage)
        return full_text

    @job_log_decorator
    async def async_save_transcript(self, content: list[JobSchema]) -> None:
        sorted_content = sorted(content, key=lambda job: job.item_number)
        full_text = "".join(
            job.processed_text if job.processed_text is not None else "" for job in sorted_content
        )
        language = content[0].payload.language
        language_prompt = f"in {language}" if language is not None else ""
        deck_name = self.deck.name
        processed_text = await self.open_ai_caller.reformat_with_claude(
            full_text,
            language_prompt,
        )
        chosen_name = f"""{random.choice(SUMMARY_FILE_NAMES)} - {deck_name}
        - Audio Transcript {random.randint(1, 99)}"""  # noqa: S311
        file_storage = DeckFiles(
            file_name=chosen_name[:100],
            text_string=processed_text,
            create_type="Audio Transcript",
        )
        self.session.add(file_storage)
        await self.session.flush()
        self.deck.deck_files.append(file_storage)
        await self.session.commit()

    @job_log_decorator
    async def async_create_deck_attributes(self, text: str) -> DeckAttributes:
        response = await self.open_ai_caller.extract_deck_attributes(text)
        subject = response.get("subject", "")
        topic = response.get("topic", "")
        concepts = ", ".join(response.get("concepts", []))
        difficulty = response.get("difficulty", "")
        language = response.get("language", "")
        attributes = DeckAttributes(
            deck_id=self.deck_id,
            subject=subject[:50],
            topic=topic[:50],
            concepts=concepts[:200],
            grade=difficulty[:50],
            language=language[:50],
        )
        self.session.add(attributes)
        await self.session.flush()
        await self.async_assign_attributes_to_deck(self.deck, attributes)
        return attributes

    @job_log_decorator
    async def async_assign_attributes_to_deck(
        self,
        deck: Deck,
        deck_attributes: DeckAttributes,
    ) -> None:
        if deck.subject is None:
            deck.subject = deck_attributes.subject
        if deck.topic is None:
            deck.topic = deck_attributes.topic
        if deck.description is None:
            deck.description = deck_attributes.concepts[:255]
        await self.session.commit()
