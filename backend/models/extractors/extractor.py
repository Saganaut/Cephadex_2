import pathlib
import requests
import re
import codecs
import random
import json
import os
import math
import datetime as dt
from werkzeug.utils import secure_filename
from flask import session
from pdf2image import convert_from_path
from pdfminer.high_level import extract_pages
from pptx import Presentation
import docx2txt
from pydub import AudioSegment
from youtube_transcript_api import YouTubeTranscriptApi
from bs4 import BeautifulSoup
from pydub.utils import mediainfo
from pytesseract import image_to_string
from models.storage.s3 import upload_to_s3
import openai
import tiktoken
from pymediainfo import MediaInfo

from models.models_ import Deck, Job, JobNotification, DeckFiles
from tools.lists import DECK_NAMES
from models.helpers.helpers import count_tokens, split_text
from models.exceptions.exceptions import (
    YoutubeError,
    UnsupportedFileError,
    AudioError,
    ExtractionError,
    ExtractionWikiError,
)
import logging
from config.settings import PAGES_PER_MIN, TOKENS_PER_PAGE, MAX_TOKENS_PER_JOB
from models.helpers.log_decorators import log_decorator

from typing import TYPE_CHECKING, Optional, Union, IO

if TYPE_CHECKING:
    from sqlalchemy.orm import (
        Session,
    )  # Or whatever the correct import path is for your db_session
    from flask_wtf import FlaskForm


openai.api_key = os.environ.get("OPENAI_API_KEY")
encoding = tiktoken.get_encoding("cl100k_base")
UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER")

logger = logging.getLogger("flask_app")

"""
This class serves as the central hub for content creation tasks, orchestrating the conversion of input data 
into actionable jobs for further processing. It plays a key role in the following:

1. Data Storage: Holds data and instructions pertinent to content creation.
2. Job Object Creation: Creates job objects based on either a Flask form or a dictionary of options.
   (Note: 'deck' and 'description' fields are disabled when using a dictionary.) <-- TO DO
3. Extraction Function: Houses the primary function for data extraction, invoked by the main controller.

Features:
- Slug ID: A unique identifier shared across all jobs and their corresponding notification entries for each extraction.
- Audio Job Special Handling: Audio jobs undergo a two-step process. The initial step is transcription, 
  which is queued before standard jobs for the same audio source are generated.

Usage:
The class takes in a form or a dictionary and performs the following tasks:
1. Transforms the form into a 'payload,' which comprises sets of instructions for an AI model.
2. Creates a new 'deck' entry in the database.
3. Generates a notification entry to keep track of job status.
"""


class Extractor:
    def __init__(self, db_session: "Session", data: dict):
        self.db_session: "Session" = db_session
        options = {
            "main_opt": data.get("prompt"),
            "subject_opt": data.get("subject"),
            "trans_opt": data.get("languages"),
            "lang_opt": data.get("main_lang"),
            "detail_lvl_opt": data.get("length"),
            "min_opt": data.get("qmin_option"),
            "max_opt": data.get("qmax_option"),
            "images_opt": data.get("generate_images"),
            "save_text_opt": data.get("save_text"),
            "custom_term": data.get("custom_term"),
            "custom_content": data.get("custom_content"),
            "create_summary_opt": data.get("create_summary"),
            "create_notes_opt": data.get("create_notes"),
        }

        self.prompt_options: dict = options
        self.deck_description = data.get("deck_description")
        self.existing_deck = data.get("existing_deck")
        self.new_deck_name = data.get("new_deck_name")
        self.file_path: Optional[str] = data.get("file_path")
        self.text_data: Optional[str] = data.get("text_input")
        self.link_data: Optional[str] = data.get("link_input")
        self.user_id: Optional[str] = data.get("user_id")
        self.slug: str = str(self.user_id) + dt.datetime.now(dt.timezone.utc).isoformat()
        self.extension: str = None
        self.text: str = None
        self.tokens: int = None
        self.description: str = None

    def __repr__(self):
        return (
            f"Extractor(prompt_options={self.prompt_options}, "
            f"file_data={repr(self.file_path)}, "
            f"text_data={repr(self.text_data)}, "
            f"link_data={repr(self.link_data)}, "
            f"slug={repr(self.slug)})"
        )

    @log_decorator
    def get_deck(self) -> tuple["Deck", bool]:
        """Retrieves the deck object and a boolean to determine whether a new deck was created"""
        if self.existing_deck not in  [None, ""]:
            deck = Deck.query.filter_by(id=self.existing_deck).first()
            self.deck = deck
            return deck, False
        else:
            chosen_name = self.new_deck_name or random.choice(DECK_NAMES)
            description = self.deck_description or None
            deck = Deck(name=chosen_name, user_id=self.user_id, description=description)
            self.deck = deck
            return deck, True

    def job_clean_up(self) -> None:
        file_path = self.file_path
        try:
            os.remove(file_path)
            print(f"File {file_path} has been deleted successfully")
        except FileNotFoundError:
            print(f"File {file_path} not found")
    @log_decorator
    def get_content(self) -> str:
        """Retrieves the text content from input, or in the case of an audio file the duration
        of the the file"""
        if self.file_path:
            extension = os.path.splitext(self.file_path)[1].lower()
            self.extension = extension
            if extension in [".wav", ".mp3"]:
                self.duration = get_audio_content(self.file_path)
                self.tokens = convert_time_to_tokens(self.duration)
                if self.prompt_options["main_opt"] == "Mix":
                    self.prompt_options["main_opt"] = "Definitions"
                return self.duration
            elif extension in [".pdf"]:
                self.text = clean_text(extract_from_pdf(self.file_path))
                self.type = "pdf"
                os.remove(self.file_path)
            elif extension in [".pptx"]:
                self.text = clean_text(extract_from_pptx(self.file_path))
                self.type = "pptx"
                os.remove(self.file_path)
            elif extension in [".docx"]:
                self.text = clean_text(extract_from_docx(self.file_path))
                self.type = "docx"
                os.remove(self.file_path)
            elif extension in [".txt"]:
                self.text = self.extract_from_txt()
                self.type = "txt"
                os.remove(self.file_path)
            else:
                raise UnsupportedFileError
        elif self.text_data:
            self.text = self.text_data
            self.type = "text"
        elif self.link_data:
            self.text, self.type = extract_from_url(self.link_data)
        return self.text

    @log_decorator
    def quantity_tokens(self) -> int:
        """Gives a token cost depending on number of characters (or length of audio file)"""
        if self.extension in [".wav", ".mp3"]:
            self.tokens = convert_time_to_tokens(self.duration)
        else:
            self.tokens = count_tokens(self.text)
        return self.tokens

    @log_decorator
    def save_source_text(self) -> None:
        """Saves the source text as a deckfile object to be stored in the db"""
        if self.prompt_options["save_text_opt"] is True and self.extension not in [
            ".wav",
            ".mp3",
        ]:
            name = f"{self.deck.name}_Source_Content"
            file_storage = DeckFiles(
                file_name=name,
                text_string=self.text,
                create_type="source",
                time_created=dt.datetime.now(dt.timezone.utc),
            )
            self.db_session.add(file_storage)
            self.deck.deck_files.append(file_storage)
            self.db_session.commit()

    @log_decorator
    def create_jobs(self) -> None:
        """creates either audio job or regular job and matching job notification object"""
        if self.extension in [".wav", ".mp3"]:
            self.type = "audio"
            self.audio_job_creator()
        else:
            texts = split_text(self.text, MAX_TOKENS_PER_JOB)
            self.text = texts
            if not isinstance(texts, list):
                self.text = [texts]
            if self.prompt_options["main_opt"] == "Mix":
                prompt = "Definitions"
                self.job_creator(prompt)
                prompt = "Mcq"
                self.job_creator(prompt)
                if self.prompt_options["create_notes_opt"] is True:
                    self.job_creator("Turn2notes")
                else:
                    self.job_creator("Summarize")
            else:
                prompt = self.prompt_options["main_opt"]
                self.job_creator(prompt)
                if self.prompt_options["create_summary_opt"] is True:
                    self.job_creator("Summarize")
                elif self.prompt_options["create_notes_opt"] is True:
                    self.job_creator("Turn2notes")
        self.notification_creator()

    @log_decorator
    def audio_job_creator(self) -> None:
        """renames and stores the audio file"""
        # upload_folder = UPLOAD_FOLDER
        # random_string = "".join(random.choices("0123456789", k=5))
        # original_filename = self.file_data.filename
        # filename, extension = os.path.splitext(original_filename)
        # new_filename = f"{filename}_{random_string}{extension}"
        # new_filename_secure = secure_filename(new_filename)
        # os.makedirs(upload_folder, exist_ok=True)
        # file_path = os.path.join(upload_folder, new_filename_secure)
        # self.file_data.save(file_path)
        # self.file_data = None
        self.extract_audio(self.file_path)

    @log_decorator
    def job_creator(self, prompt: str) -> None:
        prompt_options = self.prompt_options
        prompt_options["main_opt"] = prompt
        counter = 0
        for text in self.text:
            total_len = len(self.text)
            counter = counter + 1
            payload_dict = {
                "deck": self.deck.id,
                "text": text,
                "prompt_options": prompt_options,
                "task_type": "standard",
            }
            payload = json.dumps(payload_dict, ensure_ascii=False)
            logger.debug(f"payload is: {text[:50]}")
            data = Job(
                slug=self.slug,
                user=self.user_id,
                task_type="standard",
                payload=payload,
                item_number=counter,
                deck_id=self.deck.id,
                item_quantity=total_len,
            )
            self.db_session.add(data)
            if counter == total_len:
                session["slug"] = self.slug
                self.db_session.commit()

    @log_decorator
    def notification_creator(self) -> None:
        job_notification = JobNotification(
            user_id=self.user_id,
            slug=self.slug,
            cost=self.tokens,
            time_created=dt.datetime.now(dt.timezone.utc),
            input_details=self.type,
        )
        self.db_session.add(job_notification)
        self.db_session.commit()

    ## AUDIO EXTRACTORS
    @log_decorator
    def extract_audio(self, file: str) -> None:
        """Divides up audio if necessary into segments and stores them, then creating individual jobs
        audio files need to be divided up into max chunks of 25mb for whisper"""
        folder_path = "audio_segments"
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(folder_path)
        try:
            segments = divide_audio(file, self.duration)
            item_quantity = len(segments)
            print(file)
            for segment in segments:
                item_number = segments.index(segment) + 1
                self.create_audio_job(segment, item_number, item_quantity)
            os.remove(file)
        except Exception as e:
            # Handle any exceptions that may occur during audio extraction
            logger.error(
                f"Error occurred during audio extraction: {str(e)}, raising AudioError"
            )
            raise AudioError

    @log_decorator
    def create_audio_job(
        self, segment: str, item_number: int, item_quantity: int
    ) -> None:
        """creates the actual audio job to be stored in the db"""
        payload = {
            "prompt_options": self.prompt_options,
            "segment": segment,
            "deck": self.deck.id,
            "task_type": "audio",
        }
        payload_string = json.dumps(payload)
        audio_job = Job(
            task_type="audio",
            state="queued",
            user=self.user_id,
            deck_id=self.deck.id,
            payload=payload_string,
            slug=self.slug,
            item_number=item_number,
            item_quantity=item_quantity,
        )
        self.db_session.add(audio_job)
        self.db_session.commit()


@log_decorator
def tokens_general(data) -> int:
    """Counts tokens from given data with a file path."""
    file_path = data.get("file_path")
    if file_path:
        with open(file_path, "rb") as file_data:  # 'rb' mode for reading in binary
            extension = os.path.splitext(file_path)[1].lower()
            if extension in [".wav", ".mp3"]:
                duration = get_audio_content(file_data)
                return convert_time_to_tokens(duration)
            elif extension in [".pdf"]:
                text = clean_text(extract_from_pdf(file_data))
            elif extension in [".pptx"]:
                text = clean_text(extract_from_pptx(file_data))
            elif extension in [".docx"]:
                text = clean_text(extract_from_docx(file_data))
            elif extension in [".txt"]:
                text = file_data.read().decode(
                    "utf-8"
                )  # decode to convert bytes to string

            else:
                raise UnsupportedFileError("Unsupported file type provided.")

    elif "text_input" in data:
        text = data["text_input"]

    elif "link_input" in data:
        text, link_type = extract_from_url(data["link_input"])

    else:
        raise ValueError("No valid input provided in the data dictionary.")

    return count_tokens(text)


@log_decorator
def save_file_to_upload_folder(file: str) -> str:
    """saves a file to appropriate folder"""
    upload_folder = UPLOAD_FOLDER
    random_string = "".join(random.choices("0123456789", k=5))
    original_filename = file.filename
    filename, extension = os.path.splitext(original_filename)
    new_filename = f"{filename}_{random_string}{extension}"
    new_filename_secure = secure_filename(new_filename)
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, new_filename_secure)
    file.save(file_path)
    return file_path


@log_decorator
def get_audio_content(file_path: str) -> float:
    print("get audio content file_data shows up as?", file_path)
    duration = get_duration(file_path)
    # file_data.seek(0)
    return duration


@log_decorator
def extract_from_pdf(file_data: str, n: int = 3) -> str:
    """extracts text from a pdf, if a page has less than n characters attempts OCR
    otherwise defautls to pdf miner"""
    try:
        text = []
        # Using pdfminer.six to extract pages from PDF
        for i, page_layout in enumerate(extract_pages(file_data), start=1):
            current_page_text = ""
            for element in page_layout:
                if hasattr(element, "get_text"):
                    current_page_text += element.get_text()
            if len(current_page_text.strip()) < n:  # Threshold check
                # If the text is less than n, then use OCR
                try:
                    # Convert page to image
                    images = convert_from_path(file_data, first_page=i, last_page=i)
                    for image in images:
                        # Perform OCR on the image
                        current_page_text = image_to_string(image)
                except Exception as e:
                    logger.error(f"Error occurred during OCR: {str(e)}")

            text.append(current_page_text)
        return "\n".join(text)

    except FileNotFoundError as e:
        raise e
    except Exception as e:
        raise ExtractionError(f"Failed to extract data: {e}") from e


@log_decorator
def extract_from_pptx(file_path: str) -> Optional[str]:
    """extracts text from a pptx file"""
    try:
        prs = Presentation(file_path)
        text_runs = []
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    cleaned_text = clean_text(shape.text)
                    text_runs.append(cleaned_text)
        return " ".join(text_runs)
    except FileNotFoundError as e:
        raise e
    except Exception as e:
        raise ExtractionError(f"Failed to extract data: {e}") from e


@log_decorator
def extract_from_docx(file_path: str) -> Optional[str]:
    try:
        text = docx2txt.process(file_path)
        text = text.replace("\n", " ")
        return text
    except FileNotFoundError as e:
        raise e from e
    except Exception as e:
        raise ExtractionError(f"Failed to extract data: {e}") from e


@log_decorator
def extract_from_txt(file_path: str) -> str:
    """extracts text from a text file"""
    try:
        return pathlib.Path(file_path).read_text()
    except Exception as e:
        raise ExtractionError(f"Failed to extract data: {e}") from e


@log_decorator
def extract_from_url(link_data: str) -> tuple[str, str]:
    """extracts text from a url, either wiki or youtube"""
    text = None
    try:
        if "wikipedia" in link_data:
            link_type = "wiki"
            if check_comma_list(link_data):
                links = link_data.split(";")
                for link in links:
                    part = extract_from_wiki(link)
                    text = part if text is None else text + part
            else:
                text = extract_from_wiki(link_data)
        elif "youtube" in link_data:
            link_type = "youtube"
            if check_comma_list(link_data):
                links = link_data.split(";")
                for link in links:
                    link = get_video_id(link)
                    part = extract_from_youtube(link)
                    text = part if text is None else text + part
            else:
                link = get_video_id(link_data)
                text = extract_from_youtube(link)
        else:
            link_type = "url"
            if check_comma_list(link_data):
                links = link_data.split(";")
                for link in links:
                    part = extract_from_other_url(link)
            else:
                text = extract_from_other_url(link_data)
        return text, link_type
    except Exception as e:
        raise ExtractionError(f"Failed to extract data: {e}") from e


@log_decorator
def extract_from_other_url(link: str) -> str:
    response = requests.get(link)
    text = ""
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        for paragraph in soup.find_all("p"):
            text = text + paragraph.text
        return text
    else:
        logger.error(f"Failed to retrieve the URL. Status code: {response.status_code}")
        raise ExtractionError(
            f"Failed to retrieve the URL. Status code: {response.status_code}"
        )


@log_decorator
def extract_from_wiki(wiki_url: str) -> str:
    """extract from wikilinks"""
    try:
        content = make_request(wiki_url)
        return process_soup(content)
    except requests.exceptions.RequestException as e:
        raise e from e
    except Exception as e:
        raise ExtractionWikiError(f"Failed to extract data: {e}") from e


@log_decorator
def extract_from_youtube(youtube_url: str) -> str:
    """extracts from youtube"""
    try:
        full_text = None
        transcripts = YouTubeTranscriptApi.list_transcripts(youtube_url)
        transcript = None
        # Iterate over transcripts and choose the first manually created transcript, if it exists
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
            raise YoutubeError("Transcript not found")
        # Fetch the transcript
        srt = transcript.fetch()
        for dict in srt:
            x = dict["text"]
            if full_text is None:
                full_text = x
            else:
                full_text += x
        return full_text
    except Exception as e:
        raise YoutubeError(f"Failed to extract data: {e}") from e


@log_decorator
def get_video_id(link: Union[str, list[str]]) -> Optional[str]:
    """cleans up youtube links nad puts them in teh appropriate format to use
    with the youtube extraction api"""
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


def check_comma_list(string: str) -> bool:
    """checks if there is a comma in a string --> indicating more htan one link"""
    """ deprecated to use semi colon?"""
    return "," in string


@log_decorator
def clean_text(text: str) -> str:
    """Decode Unicode escape sequences into actual characters"""
    text = codecs.decode(text, "unicode_escape")
    # Replace newline characters with spaces
    # This pattern matches any character that is not a letter, digit, whitespace, or regular punctuation.
    pattern = r"[^\w\s.,;:?!-’'\"()]+"
    return re.sub(pattern, "", text)


@log_decorator
def make_request(wiki_url: str) -> "bytes":
    # Replace the URL with the mobile version
    wiki_url = re.sub(
        r"https://(..).wikipedia.org", r"https://\1.m.wikipedia.org", wiki_url
    )
    page = requests.get(wiki_url)
    page.raise_for_status()  # Check for any HTTP request errors
    return page.content


@log_decorator
def process_soup(content: str) -> str:
    """processes the content of the page to extract the text"""
    soup = BeautifulSoup(content, "html.parser")
    # Remove unwanted HTML elements
    remove_elements(soup)
    return extract_content(soup)


@log_decorator
def remove_elements(soup: BeautifulSoup):
    """remove unwanted elements from wiki page"""
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


@log_decorator
def extract_content(soup: BeautifulSoup) -> str:
    """beautiful soup extractor"""
    wanted_tags = ["p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "td"]
    extracted_content = []
    for tag in wanted_tags:
        elements = soup.find_all(tag)
        extracted_content.extend(
            element.get_text(strip=True, separator=" ") for element in elements
        )
    return "\n\n".join(extracted_content)


## returns duration in seconds
@log_decorator
def get_duration(file_path: str) -> float:
    print("get duration file is showing up as?", file_path)
    logger.info(f"get duration of audio file {file_path}")
    try:
        info = MediaInfo.parse(file_path)
        print(info)
        for track in info.tracks:
            if track.track_type == 'Audio':
                duration = float(track.duration)  # Duration in milliseconds
                return duration / 1000 
    except Exception as e:
        logging.error("An error occurred when trying to get duration of audio file", e)
        raise AudioError from e


    """gets duration of audio file"""
    # file_data = file.read()
    # temp_filename = f"temp_audio_file{name}"
    # with open(temp_filename, "wb") as temp_file:
    #     temp_file.write(file_data)
    # logger.info(f"get duration of audio file {temp_filename}")
    # info = mediainfo(temp_filename)
    # try:
    #     duration = float(info["duration"])
    # except Exception as e:
    #     logging.error("An error occurred when trying to get duration of audio file", e)
    #     raise AudioError from e
    # time_base = float(info["time_base"].split("/")[1])
    # duration = float(info["duration_ts"]) / time_base
    # os.remove(temp_filename)
    # return duration


def convert_time_to_tokens(time: float) -> float:
    """converts time to tokens - using estimates of how many pages a min of audio is
    worth and how many tokens a page is worth"""
    return ((time / 60) / PAGES_PER_MIN) * TOKENS_PER_PAGE


@log_decorator
def divide_audio(
    input_file: Union[str, IO[bytes]], duration: float, max_segment_size_MB: int = 20
) -> list[str]:
    """Divides up the audio file into segments of at max 20mb of length, checks if any segments are below 0.1mb
    deletes those to avoid empty segments -"""
    min_segment_size_MB = 0.1
    try:
        file_size_bytes = os.path.getsize(input_file)
        max_segment_size_bytes = max_segment_size_MB * 1024 * 1024
        num_segments = math.ceil(file_size_bytes / max_segment_size_bytes)
        random_string = "".join(random.choices("0123456789", k=5))
        file_extension = os.path.splitext(input_file)[-1].replace(".", "")
        audio = AudioSegment.from_file(input_file, format=file_extension)
        segment_length_ms = duration // num_segments
        start_time = 0
        end_time = segment_length_ms * 1000  # milliseconds in segment_length seconds
        total_length = len(audio)
        segment_paths = []
        while start_time < total_length:
            segment = audio[start_time:end_time]
            output_file = f"{random_string}_segment_{start_time}.mp3"
            logger.info(output_file)
            segment.export((output_file), format="mp3")
            upload_to_s3("cephadex", "audio_segments", output_file)

            if os.path.getsize(output_file) > min_segment_size_MB * 1024 * 1024:
                segment_paths.append(str(output_file))
            else:
                os.remove(output_file)
            start_time += segment_length_ms * 1000
            end_time += segment_length_ms * 1000
        return segment_paths

    except FileNotFoundError as e:
        logging.error(f"File not found in divide_audio: {e}")
        raise e from e
