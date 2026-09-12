import codecs
import datetime as dt
import logging
import math
import os
import pathlib
import random
import re
import uuid
from typing import IO, Any, Union

import docx2txt
import requests
import tiktoken
from bs4 import BeautifulSoup
from fastapi import UploadFile
from pdf2image.pdf2image import convert_from_path
from pdfminer.high_level import extract_pages
from pptx import Presentation
from pydub import AudioSegment
from pymediainfo import MediaInfo
from pytesseract import image_to_string
from redis import Redis
from sqlalchemy.orm import (
    Session,
)
from youtube_transcript_api import YouTubeTranscriptApi

from config import AWSSettings, Settings, TokenSettings
from models.exceptions.exceptions import (
    AudioError,
    ExtractionError,
    ExtractionWikiError,
    UnsupportedFileError,
    YoutubeError,
)
from models.helpers.helpers import Helpers, count_tokens, split_text
from models.helpers.log_decorators import log_decorator
from models.jobs.job_schema import (
    EmbeddingSchema,
    ExtractedContent,
    ExtractorDataSchema,
    PayloadSchema,
)
from models.models_ import Deck, DeckFiles, User
from models.redis_manager import RedisManager
from models.storage.s3 import StorageManager
from routes.data_classes.create_schema import (
    ExtractionRequestData,
    ExtrasOptions,
)
from tools.lists import DECK_NAMES

encoding = tiktoken.get_encoding("cl100k_base")


log = logging.getLogger("App")

SUBSCRIPTION_EMBEDDINGS_LEVEL = 1


class ExtractData:
    """ExtractData is responsible for extract data from a variety of services and creating
    the extract object
    which contains all the required data for making decks
    """

    ##TODO cache text
    @log_decorator
    @staticmethod
    def get_content(
        r_client: Redis,
        extract_obj: ExtractorDataSchema,
        settings: Settings,
    ) -> ExtractorDataSchema:
        """Retrieve the text content from input, or in the case of an audio file the duration
        of the the file
        """
        log.debug(extract_obj.model_dump_json(indent=2))

        if extract_obj.file_path:
            extract_obj = ExtractData.handle_files(extract_obj, settings, r_client)
        elif extract_obj.text_input:
            extract_obj = ExtractData.handle_pasted_text(
                extract_obj,
            )
        elif extract_obj.link_input:
            extract_obj = ExtractData.handle_link(extract_obj, settings, r_client)
        if extract_obj.text is None and extract_obj.duration is None:
            msg = """Unable to extract text from input in get_content function -
            investigation required - call a detective."""
            raise ExtractionError(msg)
        if extract_obj.extension in [".wav", ".mp3"]:
            return extract_obj
        if extract_obj.text is None:
            log.error("Error in get content: extract_obj.text is None")
        if extract_obj.text is None:
            msg = "No text extracted from input"
            raise ExtractionError(msg)
        extract_obj.text = remove_repetitive_patterns(extract_obj.text)
        extract_obj.split_text = split_text(
            extract_obj.text,
            settings.token.max_tokens_per_job,
        )
        return extract_obj

    @staticmethod
    def handle_link(
        extract_obj: ExtractorDataSchema,
        settings: Settings,
        r_client: Redis,
    ) -> ExtractorDataSchema:
        if extract_obj.link_input is None:
            msg = "No link input provided"
            raise ExtractionError(msg)
        cached = ExtractData.check_is_cached(r_client, extract_obj.link_input)
        if extract_obj.link_input is None:
            msg = "No link input provided"
            raise ExtractionError(msg)
        extract_obj.source_type = extract_obj.link_input[:128]
        if not isinstance(cached, bool) and cached is not None:
            extract_obj.extracted_content = [
                ExtractedContent(**content) for content in cached["content"]
            ]
            extract_obj.text = (" ").join(
                [content.text for content in extract_obj.extracted_content],
            )
            return extract_obj
        extract_obj.text, extract_obj.extracted_content, _ = ExtractData.extract_from_url(
            extract_obj.link_input,
            extract_obj.expanded_link,
        )
        key = RedisManager.create_key(extract_obj.link_input)
        data = {
            "content": [
                extracted_content.model_dump()
                for extracted_content in extract_obj.extracted_content
            ],
        }
        RedisManager.cache_json_data_non_async(
            r_client,
            key,
            data,
            time_exp=settings.redis.link_cache_time,
        )

        return extract_obj

    @staticmethod
    def handle_pasted_text(extract_obj: ExtractorDataSchema) -> ExtractorDataSchema:
        text = extract_obj.text_input
        if text is None:
            msg = "No text input provided"
            raise ExtractionError(msg)
        content = ExtractedContent(text=text, source="text", page=0)
        extract_obj.extracted_content = [content]
        extract_obj.text = text
        extract_obj.source_type = "text"
        return extract_obj

    @staticmethod
    def handle_files(  # noqa: C901
        extract_obj: ExtractorDataSchema,
        settings: Settings,
        r_client: Redis,
    ) -> ExtractorDataSchema:
        raw_key = f"{extract_obj.file_path}{extract_obj.user_id!s}"
        key = RedisManager.create_key(raw_key)
        if extract_obj.file_path is None:
            msg = "No file path provided"
            raise AudioError(msg)
        path = pathlib.Path(extract_obj.file_path)
        # extension = os.path.splitext(extract_obj.file_path)[1].lower()
        extension = path.suffix.lower()
        extract_obj.extension = extension
        extract_obj.source_type = extension
        cached = ExtractData.check_is_cached(
            r_client,
            extract_obj.file_path,
            str(extract_obj.user_id),
        )
        if not isinstance(cached, bool) and cached is not None:
            if extension in [".wav", ".mp3"]:
                duration = ExtractedContent(**cached["content"][0])
                extract_obj.duration = float(
                    duration.text,
                )  ## just using text to store the duration as a string
                extract_obj.tokens = int(
                    convert_time_to_tokens(extract_obj.duration, settings.token),
                )
                return extract_obj

            extract_obj.extracted_content = [
                ExtractedContent(**content) for content in cached["content"]
            ]
            extract_obj.text = (" ").join(
                [content.text for content in extract_obj.extracted_content],
            )
            return extract_obj
        if extract_obj.file_path is None:
            msg = "No file path provided"
            raise AudioError(msg)
        if extension in [".wav", ".mp3"]:
            extract_obj.duration = get_audio_content(extract_obj.file_path)
            extract_obj.tokens = int(
                convert_time_to_tokens(extract_obj.duration, settings.token),
            )
            raw_key = f"{extract_obj.file_path}{extract_obj.user_id!s}"
            key = RedisManager.create_key(raw_key)
            data = {
                "content": [
                    {
                        "text": str(extract_obj.duration),
                        "source": "audio",
                        "page": 0,
                    },
                ],
            }
            RedisManager.cache_json_data_non_async(r_client, key, data)
            return extract_obj
        if extension in [".pdf"]:
            log.debug("entered extract from pdf")
            extract_obj.text, extract_obj.extracted_content = ExtractData.extract_from_pdf(
                extract_obj.file_path,
            )
            log.debug(extract_obj.text)
            extract_obj.source_type = "pdf"
        elif extension in [".pptx"]:
            extract_obj.text, extract_obj.extracted_content = ExtractData.extract_from_pptx(
                extract_obj.file_path,
            )
            extract_obj.source_type = "pptx"
        elif extension in [".docx"]:
            extract_obj.text, extract_obj.extracted_content = ExtractData.extract_from_docx(
                extract_obj.file_path,
            )
            extract_obj.source_type = "docx"
        elif extension in [".txt"]:
            extract_obj.text, extract_obj.extracted_content = ExtractData.extract_from_txt(
                extract_obj.file_path,
            )
            extract_obj.source_type = "txt"

        if extension not in [".pdf", ".pptx", ".docx", ".txt"]:
            raise UnsupportedFileError
        if extract_obj.extracted_content is None:
            msg = "No extracted content from file"
            raise ExtractionError(msg)
        data = {
            "content": [
                extracted_content.model_dump()
                for extracted_content in extract_obj.extracted_content
            ],
        }
        RedisManager.cache_json_data_non_async(r_client, key, data)

        return extract_obj

    @staticmethod
    @log_decorator
    def check_is_cached(r_client: Redis, arg_1: str, arg_2: str = "") -> dict | None | bool:
        raw_key = f"{arg_1}{arg_2}"
        key = RedisManager.create_key(raw_key)
        if RedisManager.check_if_cached(r_client, key):
            return RedisManager.retrieve_cached_json_data_non_async(r_client, key)
        return False

    @staticmethod
    # @log_decorator
    def get_deck(
        db: Session,
        user_id: int,
        extract_obj: ExtractorDataSchema,
    ) -> tuple[Deck, bool]:
        """Retrieve the deck object and a boolean to determine whether a new deck was created"""
        if extract_obj.existing_deck not in [None, ""]:
            deck = db.query(Deck).filter_by(id=extract_obj.existing_deck).first()
            if deck:
                return deck, False
        chosen_name = extract_obj.new_deck_name or random.choice(DECK_NAMES)  # noqa: S311
        description = extract_obj.new_deck_description or None
        tags = extract_obj.new_deck_tags or None
        deck = Deck(
            name=chosen_name,
            user_id=user_id,
            description=description,
            tags=tags,
        )
        log.debug(deck.user_id)
        return deck, True

    @staticmethod
    def job_clean_up(extract_obj: ExtractorDataSchema) -> None:
        file_path = extract_obj.file_path
        try:
            if file_path is not None:
                pathlib.Path(file_path).unlink()
        except FileNotFoundError:
            log.exception("File {file_path} not found %s", file_path)
        except Exception:
            log.exception("Error in job cleanup")

    ## TODO - Move this to jobs so that the source can be reformatted
    @staticmethod
    # @log_decorator
    def save_source_text(
        db: Session,
        deck: Deck,
        extract_obj: ExtractorDataSchema,
        aws_settings: AWSSettings,
        user: User,
        r_client: Redis,
    ) -> ExtractorDataSchema:
        """Saves the source text as a deckfile object to be stored in the db,
        doesn't work for audio
        """
        if (
            extract_obj.payload.extras is not None
            and ExtrasOptions.Save_Text in extract_obj.payload.extras
            and extract_obj.extension
            not in [
                ".wav",
                ".mp3",
            ]
        ):
            name = f"source_{deck.name}_{extract_obj.extension}"
            path = None
            text = None
            if extract_obj.extension in [".pdf", ".pptx", ".docx"]:
                log.debug("entered pdf pptx docx")
                ## upload to S3
                file_path = extract_obj.file_path
                file_name = f"{deck.id}_{uuid.uuid4()}{extract_obj.extension}"
                if file_path is None:
                    msg = "No file path provided"
                    raise ExtractionError(msg)
                StorageManager.upload_to_s3("source_files", file_path, file_name)
                path = f"{aws_settings.s3_uri}/source_files/{file_name}"
            else:
                text = extract_obj.text

            file_storage = DeckFiles(
                file_name=name,
                text_string=text,
                create_type="source",
                time_created=dt.datetime.now(),
                file_path=path,
                file_type=extract_obj.extension,
                slug=extract_obj.slug,
            )
            db.add(file_storage)
            db.flush()
            ExtractData.send_text_for_embeddings(
                extract_obj,
                user.id,
                r_client,
                file_storage.id,
            )

            deck.deck_files.append(file_storage)
            extract_obj.file_id = file_storage.id
        return extract_obj

    @staticmethod
    def send_text_for_embeddings(
        extract_obj: ExtractorDataSchema,
        user_id: int,
        r_client: Redis,
        file_id: int,
        sentences_per_chunk: int = 5,
        min_length_chunk: int = 15,
    ) -> None:
        ##TODO this sometimes sets chunnk size too high.
        # Need to fix and limit to 500 max characters
        # if extract_obj.source_type in ["pdf", "pptx"]:
        ## loop through the extracted conten
        log.debug("sending text for embeddings")
        if extract_obj.extracted_content and extract_obj.slug and extract_obj.deck_id:
            i = 1
            for content in extract_obj.extracted_content:
                processed_chunks = chunker(
                    content.text,
                    sentences_per_chunk,
                    min_length_chunk,
                )

                for chunk in processed_chunks:
                    new_chunk = EmbeddingSchema(
                        slug=extract_obj.slug,
                        type="chunk",
                        user_id=user_id,
                        text=chunk,
                        deck_id=extract_obj.deck_id,
                        page=content.page,
                        document=extract_obj.source_type,
                        item_number=i,
                        item_quantity=len(extract_obj.extracted_content),
                        source=extract_obj.source_type if extract_obj.source_type else "Unknown",
                        state="queued",
                        file_id=file_id,
                    )
                    i += 1
                    key = f"Embedding:{extract_obj.slug}--i{i}-chunk-p{content.page}"
                    RedisManager.cache_json_data_non_async(
                        r_client,
                        key,
                        new_chunk.model_dump(),
                        None,
                    )

    @staticmethod
    def tokens_to_credit(tokens: int, token_settings: TokenSettings) -> int:
        return round(tokens / token_settings.tokens_per_page)

    # @log_decorator
    @staticmethod
    def prepare_extractor_data(
        request: ExtractionRequestData,
        user_id: int,
        file: UploadFile | None,
    ) -> ExtractorDataSchema:
        file_path = save_file(file, user_id) if file else None
        payload = PayloadSchema(
            card_type=request.cardTypeField,
            subject=request.subjectField,
            language=request.languageField,
            detail_lvl=request.detailField,
            min=request.minField,
            max=request.maxField,
            custom_front=request.customTermField,
            custom_back=request.customContentField,
            extras=request.multiOptionsField,
            difficulty=None,
        )
        return ExtractorDataSchema(
            file_path=file_path,
            existing_deck=request.existingDeckField,
            new_deck_name=request.nameField,
            new_deck_description=request.descriptionField,
            new_deck_tags="",
            user_id=user_id,
            payload=payload,
            text_input=request.textField,
            link_input=request.linkField,
            deck_id=request.existingDeckField,
            slug=str(user_id) + dt.datetime.now().strftime("%Y%m%dT%H%M%S"),
            split_text=[],
        )

    # @log_decorator
    @staticmethod
    def quantity_tokens(
        extract_obj: ExtractorDataSchema,
        token_settings: TokenSettings,
    ) -> ExtractorDataSchema:
        """Give a token cost depending on number of characters (or length of audio file)"""
        if extract_obj.extension in [".wav", ".mp3"]:
            if extract_obj.duration is None:
                msg = "No audio duration provided, unable to get quantity_tokens"
                raise AudioError(msg)
            extract_obj.tokens = int(
                convert_time_to_tokens(extract_obj.duration, token_settings),
            )
        else:
            if isinstance(extract_obj.text, list):
                msg = "Unable to get quantity_tokens"
                raise ExtractionError(msg)
            if extract_obj.text is None:
                msg = "Unable to get quantity_tokens"
                raise ExtractionError(msg)
            extract_obj.tokens = count_tokens(extract_obj.text)
        return extract_obj

    @staticmethod
    # @log_decorator
    def extract_from_pdf(  # noqa: C901
        file_data: Union[str, Any],  # noqa: ANN401
        n: int = 3,
    ) -> tuple[str, list[ExtractedContent]]:
        """Extract text from a pdf, if a page has less than n characters attempts OCR
        otherwise defautls to pdf miner
        """
        try:
            text = []
            list_extract_content = []
            # Using pdfminer.six to extract pages from PDF
            for i, page_layout in enumerate(extract_pages(file_data), start=1):
                current_page_text = ""
                for element in page_layout:
                    if hasattr(element, "get_text"):
                        current_page_text += element.get_text()  # type:ignore
                        current_page = ExtractedContent(
                            text=current_page_text,
                            source="pdf",
                            page=i,
                        )
                if len(current_page_text.strip()) < n:  # Threshold check
                    # If the text is less than n, then use OCR
                    try:
                        # Convert page to image
                        images = convert_from_path(file_data, first_page=i, last_page=i)
                        for image in images:
                            # Perform OCR on the image
                            current_page_text = image_to_string(image)

                            current_page = ExtractedContent(
                                text=current_page_text,
                                source="pdf",
                                page=i,
                            )
                            current_page.text = current_page_text
                    except Exception:
                        log.exception("Error occurred during OCR")
                if current_page_text:
                    text.append(current_page_text)
                if current_page:
                    list_extract_content.append(current_page)
            # return
            return "\n".join(text), list_extract_content

        except FileNotFoundError as e:
            raise FileNotFoundError from e
        except Exception as e:
            msg = f"Failed to extract data: {e}"
            raise ExtractionError(msg) from e

    @staticmethod
    # @log_decorator
    def extract_from_pptx(
        file_path: Union[str, Any],  # noqa: ANN401
    ) -> tuple[str, list[ExtractedContent]]:
        """Extract text from a pptx file"""
        try:
            prs = Presentation(file_path)
            text_runs = []
            list_extract_content = []

            slide_number = 1
            for slide in prs.slides:
                slide_text = ""
                for shape in slide.shapes:
                    if hasattr(shape, "text"):
                        cleaned_text = clean_text(shape.text)
                        text_runs.append(cleaned_text)
                        slide_text += cleaned_text
                content = ExtractedContent(
                    text=slide_text,
                    source="pptx",
                    page=slide_number,
                )
                list_extract_content.append(content)
                slide_number += 1
            return " ".join(text_runs), list_extract_content
        except FileNotFoundError as e:
            raise FileNotFoundError from e
        except Exception as e:
            msg = f"Failed to extract data: {e}"
            raise ExtractionError(msg) from e

    @staticmethod
    # @log_decorator
    def extract_from_docx(
        file_path: Union[str, Any],  # noqa: ANN401
    ) -> tuple[str, list[ExtractedContent]]:
        try:
            text = docx2txt.process(file_path)
            text = text.replace("\n", " ")
            content = ExtractedContent(text=text, source="docx", page=0)
            return text, [content]
        except FileNotFoundError as e:
            raise e from e
        except Exception as e:
            msg = f"Failed to extract data: {e}"
            raise ExtractionError(msg) from e

    @staticmethod
    @log_decorator
    def extract_from_txt(file_path: str) -> tuple[str, list[ExtractedContent]]:
        """Extract text from a text file"""
        try:
            text = pathlib.Path(file_path).read_text()
            content = ExtractedContent(text=text, source="txt", page=0)
            return text, [content]
        except Exception as e:
            raise ExtractionError from e

    @staticmethod
    # @log_decorator
    def extract_from_url(  # noqa: C901, PLR0912
        link_data: str,
        expanded_link: bool = False,  # noqa: ARG004
    ) -> tuple[str, list[ExtractedContent], str]:
        """Extract text from a url, either wiki or youtube"""
        text = ""
        try:
            if "wikipedia" in link_data:
                link_type = "wiki"
                if check_comma_list(link_data):
                    links = link_data.split(";")
                    for link in links:
                        part = ExtractData.extract_from_wiki(link)
                        text = part if text is None else text + part
                else:
                    text = ExtractData.extract_from_wiki(link_data)
            elif "youtube" in link_data:
                link_type = "youtube"
                if check_comma_list(link_data):
                    links = link_data.split(";")
                    for link in links:
                        part = ExtractData.extract_from_youtube(ExtractData.get_video_id(link))
                        if part is None:
                            msg = "Failed to extract data from YouTube"
                            raise YoutubeError(msg)  # noqa: TRY301
                        text = part if text is None else text + part
                else:
                    link = ExtractData.get_video_id(link_data)
                    text = ExtractData.extract_from_youtube(link)
            else:
                link_type = "url"
                if check_comma_list(link_data):
                    links = link_data.split(";")
                    for link in links:
                        part = ExtractData.extract_from_other_url(link)
                else:
                    text = ExtractData.extract_from_other_url(link_data)
            if text is None:
                msg = "Failed to extract data from URL"
                raise ExtractionError(msg)  # noqa: TRY301
            content = ExtractedContent(text=text, source=link_data, page=0)
            return text, [content], link_type
        except Exception as e:
            raise ExtractionError from e

    @staticmethod
    # @log_decorator
    def extract_from_other_url(link: str) -> str:
        success_status_code = 200
        response = requests.get(link, timeout=10)
        text = ""
        if response.status_code == success_status_code:
            soup = BeautifulSoup(response.text, "html.parser")
            for paragraph in soup.find_all("p"):
                text = text + paragraph.text
            return text
        log.exception(
            "Failed to retrieve the URL. Status code",
        )
        raise ExtractionError

    @staticmethod
    # @log_decorator
    def extract_from_wiki(wiki_url: str) -> str:
        """Extract from wikilinks"""
        try:
            content = make_request(wiki_url)
            return process_soup(content)
        except requests.exceptions.RequestException as e:
            raise e from e
        except Exception as e:
            raise ExtractionWikiError from e

    @staticmethod
    # @log_decorator
    def extract_from_youtube(youtube_url: str) -> str | None:  # noqa: C901
        """Extract from youtube"""
        try:
            full_text = None
            transcripts = YouTubeTranscriptApi.list_transcripts(youtube_url)
            transcript = None
            # Iterate over transcripts and choose the first manually created transcript,
            for t in transcripts:
                if not t.is_generated:
                    transcript = t
                    break
            # If no manually created transcript found, choose the first auto-generated transcript
            if transcript is None:
                for t in transcripts:
                    if t.is_generated:
                        transcript = t
                        break
            # If no transcript is found, raise an error
            if transcript is None:
                msg = "Transcript not found"
                raise YoutubeError(msg)  # noqa: TRY301
            # Fetch the transcript
            srt = transcript.fetch()
            for dicti in srt:
                x = dicti["text"]
                if full_text is None:
                    full_text = x
                else:
                    full_text += x
            if full_text is not None:
                return full_text
        except Exception as e:
            msg = "Failed to extract data from YouTube"
            raise YoutubeError(msg) from e

    @staticmethod
    # @log_decorator
    def get_video_id(link: Union[str, list[str]]) -> str:
        """Clean up youtube links nad puts them in teh appropriate format to use
        with the youtube extraction api
        """
        link = "".join(link)
        link = link.strip()
        patterns = [
            r"youtu\.be/([^/]+)",
            r"youtube\.com/watch\?v=([^&]+)",
            r"youtube\.com/embed/([^/]+)",
            r"youtube\.com/v/([^/]+)",
            r"youtube\.googleapis\.com/v/([^/]+)",
        ]
        for pattern in patterns:
            if match := re.search(pattern, link):
                return match[1]
        msg = "Invalid YouTube link provided"
        raise YoutubeError(msg)

    # @log_decorator
    @staticmethod
    def extract_audio(duration: float, file: str) -> list:
        """Divides up audio if necessary into segments and stores them,
        then creating individual jobs
        audio files need to be divided up into max chunks of 25mb for whisper
        """
        folder_path = "audio_segments"
        if not pathlib.Path(folder_path).exists():
            # if not os.path.exists(folder_path):
            # os.makedirs(folder_path)
            pathlib.Path(folder_path).mkdir(parents=True)
        return divide_audio(file, duration)


def save_file(file: UploadFile, user_id: int) -> str:
    if file.filename is None:
        msg = "No file name provided"
        raise ExtractionError(msg)
    path = pathlib.Path(file.filename)
    root = path.stem
    ext = path.suffix.lower()
    # file_basename, file_extension = os.path.splitext(file.filename)
    random_int = user_id * 234
    new_filename = f"{Helpers.secure_filename(root)}_{random_int}{ext}"
    folder_path = "temp/uploaded_files"
    if not pathlib.Path(folder_path).exists():
        # if not os.path.exists():
        pathlib.Path(folder_path).mkdir(parents=True)

        # os.makedirs("temp/uploaded_files")
    file_path = pathlib.Path(folder_path) / new_filename
    # file_path = os.path.join("temp/uploaded_files", new_filename)
    # with open(file_path, "wb") as out_file:
    with pathlib.Path(file_path).open("wb") as out_file:
        file.file.seek(0)
        out_file.write(file.file.read())
        file.file.seek(0)
    # upload_to_s3("extract_temp_files", file_path)
    # os.remove(file_path)
    return str(file_path)


# @log_decorator
def get_audio_content(file_path: str) -> float:
    return get_duration(file_path)


def check_comma_list(string: str) -> bool:
    """Check if there is a comma in a string --> indicating more htan one link"""
    """ deprecated to use semi colon?"""
    return "," in string


# @log_decorator
def clean_text(text: str) -> str:
    """Decode Unicode escape sequences into actual characters"""
    text = codecs.decode(text, "unicode_escape")
    # Replace newline characters with spaces
    # This pattern matches any character that is not a letter,
    # digit, whitespace, or regular punctuation.
    pattern = r"[^\w\s.,;:?!-’'\"()]+"  # noqa: RUF001
    return re.sub(pattern, "", text)


# @log_decorator
def make_request(wiki_url: str) -> "bytes":
    # Replace the URL with the mobile version
    wiki_url = re.sub(
        r"https://(..).wikipedia.org",
        r"https://\1.m.wikipedia.org",
        wiki_url,
    )
    page = requests.get(wiki_url, timeout=10)
    page.raise_for_status()  # Check for any HTTP request errors
    return page.content


# @log_decorator
def process_soup(content: str | bytes) -> str:
    """Process the content of the page to extract the text"""
    soup = BeautifulSoup(content, "html.parser")
    # Remove unwanted HTML elements
    remove_elements(soup)
    return extract_content(soup)


# @log_decorator
def remove_elements(soup: BeautifulSoup) -> None:  # noqa: C901
    """Remove unwanted elements from wiki page"""
    unwanted_tags = [
        "script",
        "style",
        "table",
        "noscript",
        "nav",
        "header",
        "footer",
        "sup",
        "div",
        "h2",
        "li",
        "a",
    ]
    unwanted_class_types = [
        "reference",
        "toc",
        "thumbcaption",
        "reflist",
        "navbox",
        "section-heading",
        "references",
    ]
    unwanted_selectors = [
        ".portalbox-entry",
        ".firstHeading",
        "#footer-info-lastmod",
        "#footer-info-copyright",
        "#footer-places-privacy",
        "#footer-places-about",
        "#footer-places-disclaimers",
        "#footer-places-contact",
        "#footer-places-terms-use",
        "#footer-places-desktop-toggle",
        "#footer-places-developers",
        "#footer-places-statslink",
        "#footer-places-cookiestatement",
    ]
    unwanted_attrs = [{"id": "toc"}, {"id": "page-secondary-actions"}, {"id": "toc"}]
    unwanted_list = ["interlanguage-link"]

    for tag, cls in zip(unwanted_tags, unwanted_class_types):
        for item in soup.find_all(tag, class_=cls):
            item.extract()

    for selector in unwanted_selectors:
        for tag in soup.select(selector):
            tag.extract()

    for attrs in unwanted_attrs:
        for div in soup.find_all("div", attrs):
            div.extract()

    for item in unwanted_list:
        for li in soup.find_all("li", class_=item):
            li.extract()
    for li in soup.find_all("li"):
        if li.find("a"):
            li.extract()


# @log_decorator
def extract_content(soup: BeautifulSoup) -> str:
    """Beautiful soup extractor"""
    wanted_tags = ["p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "td"]
    extracted_content = []
    for tag in wanted_tags:
        elements = soup.find_all(tag)
        extracted_content.extend(
            element.get_text(strip=True, separator=" ") for element in elements
        )
    return "\n\n".join(extracted_content)


## returns duration in seconds
## TODO: check why this is in a loop
# @log_decorator
def get_duration(file_path: str) -> float:
    """Return duration in seconds"""
    try:
        info = MediaInfo.parse(file_path)
        if isinstance(info, str):
            msg = "get_duration returned a string instead of a media object"
            raise AudioError(msg)  # noqa: TRY301

        audio_track = next(
            (track for track in info.tracks if track.track_type == "Audio"),
            None,
        )

        if audio_track is not None:
            duration = float(audio_track.duration)
            return duration / 1000
        msg = "No audio track found in the file"
        raise AudioError(msg)  # noqa: TRY301

    except Exception as e:
        logging.exception(
            "An error occurred when trying to get duration of audio file ",
        )
        raise AudioError from e


def convert_time_to_tokens(time: float, token_settings: TokenSettings) -> float:
    """Convert time to tokens - using estimates of how many pages a min of audio is
    worth and how many tokens a page is worth
    """
    return ((time / 60) / token_settings.pages_per_min) * token_settings.tokens_per_page


# @log_decorator
def divide_audio(
    input_file: Union[str, IO[bytes]],
    duration: float,
    max_segment_size_mb: int = 20,
) -> list[str]:
    """Divides up the audio file into segments of at max 20mb of length, checks
    if any segments are below 0.1mb
    deletes those to avoid empty segments -
    """
    min_segment_size_mb = 0.1
    try:
        file_size_bytes = os.path.getsize(input_file)  # type:ignore #TODO fix this # noqa: PTH202
        max_segment_size_bytes = max_segment_size_mb * 1024 * 1024
        num_segments = math.ceil(file_size_bytes / max_segment_size_bytes)
        random_string = "".join(random.choices("0123456789", k=5))  # noqa: S311
        file_extension = os.path.splitext(input_file)[-1].replace(".", "")  # type:ignore #TODO fix this # noqa: PTH122
        audio = AudioSegment.from_file(input_file, format=file_extension)
        segment_length_ms = duration // num_segments
        start_time = 0
        end_time = segment_length_ms * 1000  # milliseconds in segment_length seconds
        total_length = len(audio)
        segment_paths = []
        while start_time < total_length:
            segment = audio[start_time:end_time]
            output_file = f"{random_string}_segment_{start_time}.mp3"
            log.info(output_file)
            segment.export((output_file), format="mp3")

            if os.path.getsize(output_file) > min_segment_size_mb * 1024 * 1024:  # noqa: PTH202
                StorageManager.upload_to_s3("audio_segments", output_file)

                segment_paths.append(str(output_file))
            else:
                os.remove(output_file)  # noqa: PTH107
            start_time += segment_length_ms * 1000
            end_time += segment_length_ms * 1000
        return segment_paths

    except FileNotFoundError as e:
        logging.exception("File not found in divide_audio")
        raise e from e


def chunker(text: str, sentences_per_chunk: int, min_length_chunk: int) -> list[str]:
    """Divides up the text into chunks of a certain length"""
    text = remove_unwanted_characters(text)
    text_chunks = re.split(r"\.\s+|\?\s+|!\s+", text)
    grouped_chunks = [
        text_chunks[i : i + sentences_per_chunk]
        for i in range(0, len(text_chunks), sentences_per_chunk)
    ]
    return [" ".join(chunk) for chunk in grouped_chunks if len(" ".join(chunk)) > min_length_chunk]


def remove_unwanted_characters(text: str) -> str:
    """Remove unwanted characters from the text"""
    pattern = r"\[\d{1,2}\]|[^\w\s.,;:?!-’'\"()]+"  # noqa: RUF001

    return re.sub(pattern, "", text)


def remove_repetitive_patterns(text: str) -> str:
    # Replace multiple newlines with a single newline
    text = re.sub(r"\n+", "\n", text)

    # Replace occurrences of multiple spaces with a single space
    text = re.sub(r"\s+", " ", text)

    # Replace multiple instances of dots with optional spaces used in ellipses or other contexts
    text = re.sub(r"(\.(\s)?){2,}", ".", text)

    # Optionally, remove URLs
    text = re.sub(r"http[s]?://\S+", "", text)

    # Remove any non-printable characters
    text = re.sub(r"[^\x20-\x7E]+", "", text)

    return text.strip()
