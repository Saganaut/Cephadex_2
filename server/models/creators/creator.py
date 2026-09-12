import asyncio
import json
import logging
import os
import random
import re
from typing import Generator, Union

import requests
import tiktoken
from anthropic import AI_PROMPT, HUMAN_PROMPT, AsyncAnthropic
from openai import (
    APITimeoutError,
    AsyncOpenAI,
    InternalServerError,
    OpenAI,
    RateLimitError,
    Stream,
)
from openai.types.audio import Transcription
from openai.types.chat import ChatCompletion

from config import AISettings, AWSSettings
from models.creators.formatters import remove_html_tags
from models.exceptions.exceptions import APIResponseError, APIResponseFormatError
from models.helpers.log_decorators import log_decorator
from models.jobs.job_schema import PayloadSchema, PromptSchema
from models.llm_data import DataCollector
from models.models_ import Card, Deck, DeckAttributes
from models.storage.s3 import StorageManager

from .prompt_builder import PromptBuilder

processing_logger = logging.getLogger("job_processing")
encoding = tiktoken.get_encoding("cl100k_base")

"""What sampling temperature to use, between 0 and 2.
Higher values like 0.8 will make the output more random, while
lower values like 0.2 will make it more focused and deterministic.
We generally recommend altering this or top_p but not both."""
## consider adding response_format={ "type": "json_object" }, to the call_ai_terms function

""" Errors to handle APITimeoutError, InternalSeverError, RateLimitError -->
retry with exponantial backoff
APIConnectionError -->  retry also?
BadRequestError --> is this the repetitive pattern one?
All others just raise exceptions, log and pass"""


class AiCaller:
    """initialize with ither type response as Text or Json, defaults to Text.
    model can be changed to  gpt-4-32k gpt-3.5-turbo  gpt-3.5-turbo-16k
    """

    """ claude models : "claude-3-haiku-20240307"""

    def __init__(
        self,
        settings: AISettings,
        aws_settings: AWSSettings,
    ) -> None:
        self.settings: AISettings = settings
        self.aws_settings: AWSSettings = aws_settings
        self.async_client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.anthropic = AsyncAnthropic(
            api_key=settings.anthropic_api_key,
        )
        self.type_response: str = settings.type_response
        self.model: str = settings.openai_main_model
        self.images_model: str = settings.images_model
        self.temperature: float = settings.temperature
        self.audio_model: str = settings.audio_model

    def switch_models(self, model: str, image_modal: str) -> None:
        self.model = model
        self.images_model = image_modal

    @log_decorator
    async def call_claude(self, prompt: str, model: str, max_tokens_to_sample: int = 4096) -> str:
        messages = [{"role": "user", "content": f"{HUMAN_PROMPT}{prompt} {AI_PROMPT}"}]

        try:
            completion = self.anthropic.messages.create(
                model=model,
                max_tokens=4096,
                messages=messages,
            )
            completion = await completion
            return completion.content[0].text

        except Exception as e:
            processing_logger.exception("Error calling claude")
            raise APIResponseError from e

    ## TODO: Consider fine tuning the back off here.  ALso need to implement it for other functions
    async def call_ai_terms(  ## noqa: ANN201
        self,
        sys_instruct: str,
        user_prompt: PromptSchema,
        response_format={"type": "json_object"},  # noqa: B006, ANN001
    ):
        retries = 3
        backoff_factor = 2
        base_delay = 2
        for attempt in range(retries):
            try:
                response = await self.async_client.chat.completions.create(
                    model=self.model,
                    response_format=response_format,
                    messages=[
                        {"role": "system", "content": sys_instruct},
                        {"role": "assistant", "content": user_prompt.prompt},
                    ],
                    temperature=self.temperature,
                    max_tokens=4095,
                    top_p=1,
                    frequency_penalty=0,
                    presence_penalty=0,
                    # temperature=self.temperature,
                )
                if response is None:
                    raise APIResponseError  # noqa: TRY301
                content = response.choices[0].message.content
                if content is not None:
                    await DataCollector.async_log_data(
                        prompt=user_prompt.prompt,
                        sys_instruct=sys_instruct,
                        response=content,
                        model=self.model,
                        response_format=response_format,
                        type=user_prompt.type,
                        subtype=user_prompt.subtype,
                        temperature=self.temperature,
                    )
            except APIResponseError as e:  # noqa: PERF203
                processing_logger.exception("APIResponseError, no content returned")
                raise APIResponseError from e
            except APITimeoutError or InternalServerError or RateLimitError as e:  # noqa: PLW0711, B030
                if attempt < retries - 1:
                    stagger_value_float = random.randint(1, 1000) / 500  # noqa: S311
                    processing_logger.exception(
                        "Error calling ai terms: %s. Retrying ({attempt + 1}/{retries})",
                        e.message,
                    )
                    sleep_time = base_delay * (backoff_factor**attempt) + stagger_value_float
                    await asyncio.sleep(sleep_time)
                else:
                    raise
            except Exception as e:
                processing_logger.exception("Unexpected error in call_ai_terms")
                raise Exception from e  # noqa: TRY002
        return response

    ## this is only used in code_review script
    def call_ai_terms_non_async(
        self,
        sys_instruct: str,
        user_prompt: PromptSchema,
        response_format={"type": "json_object"},  # noqa: B006, ANN001
    ) -> ChatCompletion:
        return self.client.chat.completions.create(
            model=self.model,
            response_format=response_format,
            messages=[
                {"role": "system", "content": sys_instruct},
                {"role": "user", "content": user_prompt.prompt},
            ],
            temperature=self.temperature,
        )

    def ai_stream(self, sys_instruct: str, user_prompt: str) -> Stream:
        try:
            return self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": sys_instruct},
                    {"role": "user", "content": user_prompt},
                ],
                stream=True,
            )
        except Exception as e:
            processing_logger.exception("Error streaming")
            raise APIResponseError from e

    ## TODO figure out why I m getting a type error here.  Transcript seems to work fine
    @log_decorator
    async def transcribe_whisper(self, audio_file_path: str) -> str | Transcription:
        with open(audio_file_path, "rb") as audio_file:  # noqa: ASYNC230, PTH123
            transcript = await self.async_client.audio.transcriptions.create(
                file=audio_file,
                model=self.audio_model,
                response_format="text",
            )
            if transcript is None:
                raise APIResponseError
        return transcript

    ## currently unused
    async def add_more_cards(
        self,
        attributes: DeckAttributes,
        extract_type: str = "Mcq",
    ) -> list | dict:
        sys_instruct = """You are an excellent teacher, you respond to all questions in
        a JSON object
        like string, do not answer with anything outside of the JSON object"""
        prompt = PromptBuilder.build_add_more_cards_prompt(
            attributes.subject,
            attributes.topic,
            attributes.concepts,
            attributes.grade,
            attributes.language,
            extract_type,
        )
        response = await self.call_ai_terms(sys_instruct, prompt)
        return self.process_term_extractions(response)

    ## currently unused

    async def extract_deck_attributes(self, text: str) -> dict:
        sys_instruct = """You are an expert at education and classification of content by subject,
        topic and level of difficulty as well as language. You are diligent and think about things
        carefully and only return content in JSON format"""
        user_prompt = """Identify the main subject, topic, concepts and level of difficulty as well
        as language of the following text, the levels of difficulty should be based upon the educational
        level at which one would be expected to encounter the identified concepts, either primary school,
        middle school, high school, college or post-graduate level.  Return your response as a JSON object
        only in the following format: {"subject": "main subject identified", "topic": "main topic identified",
        "concepts": ["concept1", "concept2", ...], "difficulty": "difficulty level", "language":
        "identified language of text"}\n  The passage: \n {text}"""  # noqa: E501

        user_prompt = user_prompt.replace("{text}", text)
        prompt = PromptSchema(
            prompt=user_prompt,
            type="extract",
            subtype="deck_attributes",
        )
        response = await self.call_ai_terms(sys_instruct, prompt)
        response = self.process_term_extractions(response)
        if isinstance(response, list):
            return response[0]

        return response

    @log_decorator
    async def extract_terms(self, text: str, payload: PayloadSchema) -> list:
        text = remove_html_tags(text)
        prompt = PromptBuilder.build_prompt(payload)
        subject = ""
        if payload.subject is not None and payload.subject.value != "Unspecified":
            subject = payload.subject.value
        sys_instruct = f"You are a helpful teacher who wants to help students learn {subject}."
        prompt.prompt = prompt.prompt + text + "The JSON object: \n"
        response = await self.call_ai_terms(sys_instruct, prompt)
        response = self.process_term_extractions(response)
        if isinstance(response, list):
            return response
        return [response]

    @log_decorator
    def process_term_extractions(self, response: ChatCompletion) -> list | dict:  # noqa: PLR0911
        try:
            content = response.choices[0].message.content
            if content is None:
                msg = "No content to extract in process term extractions"
                raise APIResponseError(msg)  # noqa: TRY301
            step1 = re.sub(r"```json", "", content, flags=re.IGNORECASE)
            content = re.sub(r"```$", "", step1)
            byte_string = content.encode("utf-8")
            content = byte_string.decode("utf-8")
            content = json.loads(content)
            if isinstance(content, list):
                return content
            if content.get("questions"):
                return content["questions"]
            if content.get("terms"):
                return content["terms"]
            if content.get("response"):
                return content["response"]
            if content.get("array"):
                return content["array"]
            if content.get("JSON"):
                return content["JSON"]
            return content
        except Exception as e:
            processing_logger.exception("Can't process content")
            raise APIResponseFormatError from e

    def process_extraction_string(self, response: ChatCompletion) -> str:
        content = response.choices[0].message.content
        if content is None:
            msg = "No content to extract in process term extractions"
            raise APIResponseError(msg)
        try:
            byte_string = content.encode("utf-8")
            return byte_string.decode("utf-8")
        except Exception as e:
            processing_logger.exception("Can't process content")
            raise APIResponseFormatError from e

    async def process_text(
        self,
        instruction: str,
        task: str,
        extra_info: str,
        items: str,
    ) -> str:
        items = remove_html_tags(items)
        option_1 = (
            f"You are an expert at {instruction} and respond in the same language as the passage"
        )
        option_2 = f"""{task} the following passage and return it {extra_info} ignore
        table of contents and indexes, {items}"""
        prompt = PromptSchema(prompt=option_2, type="process_text", subtype=extra_info)
        response = await self.call_ai_terms(
            option_1,
            prompt,
            response_format={"type": "text"},
        )
        return self.process_extraction_string(response)

    @log_decorator
    async def summarize(self, items: str) -> str:
        return await self.process_text(
            "summarizing key points in a passage",
            "Summarize",
            """headers should refer to the content or topic of the passage, avoid headers such as
            summary or key points, your summary should get straight to the point and not
            include content such as 'in this passage""",
            items,
        )

    async def turn_to_notes(self, items: str) -> str:
        return await self.process_text(
            "turning text into study notes",
            "Turn into notes",
            """headers should refer to the content or topic of the passage,
            avoid headers such as summary or key points, your summary should
            get straight to the point and not include content such as 'in this passage""",
            items,
        )

    async def transcribe_and_translate(self, items: str, payload: PayloadSchema) -> str:
        items = remove_html_tags(items)
        if payload.language is None:
            msg = "No language provided - unable to transcribe and translate"
            raise Exception(msg)  # noqa: TRY002
        language = payload.language.value
        option_1 = f"You are a helpful {language} translator"
        option_2 = f"translate the following passage to {language} {items}"
        prompt = PromptSchema(prompt=option_2, type="long_form", subtype="translate")
        response = await self.call_ai_terms(option_1, prompt)

        return self.process_extraction_string(response)

    async def create_new_card(self, data: dict) -> dict:
        prompt = PromptBuilder.build_create_new_cards_prompt(data)
        sys_instruct = """You are an expert at creating educational content
        and flashcards of all different types.  You respond in JSON format only"""
        response = await self.call_ai_terms(sys_instruct, prompt)
        content = response.choices[0].message.content
        if content is None:
            raise APIResponseError
        try:
            return json.loads(content)
        except Exception as e:
            logging.exception(
                "Error loading json in create new card with content: ",
            )
            raise APIResponseFormatError from e

    ##### STREAMS
    def explain_more(
        self,
        term: str,
        subject: str,
        content: str,
    ) -> Generator[str, None, None]:
        prompt = PromptBuilder.build_prompt_explain_more(term, subject, content)
        sys_instruct = """You are a helpful teacher who is an expert and providing clear
        explanations.
        There is no need to introduce yourself, but if questioned you should answer
        that you are a teacher named Ceph who is here to help."""
        yield from self.get_response(prompt, sys_instruct)

    def why_wrong_generator(self, ww_prompt: dict) -> Generator[str, None, None]:
        prompt = PromptBuilder.build_prompt_why_wrong(ww_prompt)
        sys_instruct = """You are a helpful teacher who is an expert and providing clear
        and detailed explanations. There is no need to introduce yourself, but if questioned
        you should answer that you are a teacher named Ceph who is here to help."""
        yield from self.get_response(prompt, sys_instruct)

    def send_question_generator(
        self,
        term: str,
        content: str,
        latest_paragraph: str,
        question: str,
    ) -> Generator[str, None, None]:
        prompt: PromptSchema = PromptBuilder.question_prompt_builder(
            term,
            content,
            latest_paragraph,
            question,
        )
        sys_instruct = """You are a helpful teacher who is an expert and providing clear
        and detailed explanations - where appropriate you use the socratic method of teaching.
        Your persona is that of octopus robot teacher, you are witty but helfpul and instructive.
        There is no need to introduce yourself, but if questioned you should answer that you are
        a teacher named Ceph who is here to help.
        You respond to the student in the same language as their question"""
        yield from self.get_response(prompt, sys_instruct)

    def get_response(self, prompt: PromptSchema, sys_instruct: str) -> Generator[str, None, None]:
        response = self.ai_stream(sys_instruct, prompt.prompt)
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                yield (chunk.choices[0].delta.content)

    #### Image
    async def create_image(
        self,
        prompt: str,
        model: str,
        size: str = "256x256",
    ) -> Union[str, None]:
        response = await self.async_client.images.generate(
            model=model,
            prompt=prompt,
            n=1,
            response_format="url",
            size=size,  # type: ignore
        )
        if response is None:
            raise APIResponseError
        return response.data[0].url

    #### CLAUUDE

    async def create_cornell_notes_with_claude(self, text: str, language: str) -> str:
        prompt = PromptBuilder.claude_notes_prompt_builder(text, language)
        return await self.call_claude(
            prompt.prompt,
            self.settings.claude_main_model,
        )

    async def reformat_with_claude(self, text: str, language: str) -> str:
        prompt = PromptBuilder.claude_reformat_prompt_builder(text, language)
        return await self.call_claude(
            prompt.prompt,
            self.settings.claude_main_model,
        )

    ##### HELPERS
    ## TODO these should be moved to more appropriate places
    async def save_image(self, url: str, card: Card, user_id: int, deck_id: int) -> None:
        content = await download_image(url)
        img_name = create_image_name(card.term, user_id, deck_id)
        img_path = os.path.join("temp\\card_img", img_name)  # noqa: PTH118
        with open(img_path, "wb") as f:  # noqa: ASYNC230, PTH123
            f.write(content)
        success = await StorageManager.async_upload_to_s3(
            "card_img",
            img_path,
            img_name,
        )
        os.remove(img_path)  # noqa: PTH107
        card.img = f"card_img/{img_name}"
        if not success:
            processing_logger.error("Error uploading image to s3")

    async def save_image_to_deck(self, url: str, deck: Deck) -> None:
        content = await download_image(url)
        random_int = random.randint(1, 999)  # noqa: S311
        deck_name = deck.name.replace(" ", "_")
        img_name = create_image_name(deck_name, random_int, deck.id)
        directory_path = os.path.abspath("temp\\deck_img")  # noqa: PTH100
        if not os.path.exists(directory_path):  # noqa: PTH110
            os.makedirs(directory_path)  # noqa: PTH103
        img_path = os.path.join(directory_path, img_name)  # noqa: PTH118
        with open(img_path, "wb") as f:  # noqa: ASYNC230, PTH123
            f.write(content)
        success = await StorageManager.async_upload_to_s3(
            "deck_img",
            img_path,
            img_name,
        )
        os.remove(img_path)  # noqa: PTH107
        deck.img = f"{self.aws_settings.s3_uri}/deck_img/{img_name}"
        if not success:
            processing_logger.error("Error uploading image to s3")


def create_image_name(term: str, user_id: str | int, deck_id: str | int) -> str:
    return sanitize_filename(f"{user_id}_{deck_id}_{term}.png")


def sanitize_filename(filename: str) -> str:
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, "")
    return filename


async def download_image(url: str) -> bytes:
    r = requests.get(url, timeout=5)  # noqa: ASYNC210
    r.raise_for_status()
    return r.content
