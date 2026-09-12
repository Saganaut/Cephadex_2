import base64
import os
import re
import string
from io import BytesIO
from typing import Optional

import numpy as np
import qrcode
import tiktoken

# import xhtml2pdf.pisa as pisa
from PIL import Image

from models.helpers.log_decorators import log_decorator

encoding = tiktoken.get_encoding("cl100k_base")


def remove_punctuation(words: str) -> str:
    s = words
    punct = string.punctuation  # contains all punctuation characters
    return "".join([char for char in s if char not in punct])


@log_decorator
def split_text(text: str, n: int = 1700) -> list[str]:
    tokens = count_tokens(text)
    if tokens > n:
        n_chunks = tokens // n
        if tokens % n != 0:
            n_chunks += 1
        chunks = np.array_split(text.split(), n_chunks)
        return [" ".join(chunk) for chunk in chunks]
    return [text]


## TOKEN HANDLERS
def count_tokens(text: str) -> int:
    tokens = encoding.encode(text)
    return len(tokens)


def token_encoding(text: str) -> list[int]:
    return encoding.encode(text)


def token_decoding(encoded_text: list[int]) -> str:
    return encoding.decode(encoded_text)


## split list of tokens into chunks of n tokens
def split_tokens(tokens: int, n: int) -> list[list[int]]:
    return [tokens[i : i + n] for i in range(0, len(tokens), n)]  # type: ignore


class Helpers:
    @staticmethod
    @log_decorator
    # async def generate_pdf_from_html(url: str):
    #     ### ! Dprecated
    #     logging.warning("generate_pdf_from_html is deprecated")
    # async with httpx.AsyncClient() as client:
    #     response = await client.get(url)
    # html_content = response.content

    # pdf = BytesIO()
    # await asyncio.to_thread(
    #     pisa.CreatePDF,
    #     BytesIO(html_content),
    #     pdf,
    #     link_callback=lambda uri, rel: asyncio.run(fetch_resources(uri, rel, url)),
    # )
    # return pdf.getvalue()

    @staticmethod
    def secure_filename(filename: str) -> Optional[str]:
        """Sanitize the filename by removing path information and replacing
        spaces or invalid characters with underscores.
        """
        # Windows' reserved characters and names
        windows_reserved = {
            "CON",
            "PRN",
            "AUX",
            "NUL",
            "COM1",
            "COM2",
            "COM3",
            "COM4",
            "COM5",
            "COM6",
            "COM7",
            "COM8",
            "COM9",
            "LPT1",
            "LPT2",
            "LPT3",
            "LPT4",
            "LPT5",
            "LPT6",
            "LPT7",
            "LPT8",
            "LPT9",
        }
        reserved_chars = '<>:"/\\|?*'

        # Remove path information
        filename = filename.split("/")[-1].split("\\")[-1]

        # Replace invalid characters with an underscore
        filename = "".join(char if char not in reserved_chars else "_" for char in filename)

        # Remove any spaces
        filename = filename.replace(" ", "_")

        # Check against Windows reserved names
        name, ext = re.split(r"\.(?=[^\.]+$)", filename) if "." in filename else (filename, "")
        if name.upper() in windows_reserved:
            return None

        return f"{name}.{ext}" if ext else name

    @staticmethod
    @log_decorator
    def create_qr_code(link: str, folder_path: str) -> str:
        """Creates a qr code used for sharing decks, uses a faded version of Cephadex
        logo as background
        """
        qr = qrcode.QRCode(  # type: ignore
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,  # type: ignore
            box_size=10,
            border=4,
        )
        qr.add_data(link)
        qr.make(fit=True)
        img_qr = qr.make_image(fill_color="black", back_color="#efe8ff")
        image_path = os.path.join(folder_path, "Cephadex-logo-6.png")  # noqa: PTH118
        absolute_image_path = os.path.abspath(image_path)  # noqa: PTH100

        background = Image.open(absolute_image_path)
        background = background.resize(img_qr.size, Image.Resampling.LANCZOS)
        img_qr = img_qr.convert("RGBA")
        img_qr.putalpha(150)
        background = background.convert("RGBA")
        result = Image.alpha_composite(background, img_qr)
        buffered = BytesIO()
        result.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()


# async def fetch_resources(uri: str, rel, quiz_url):
#     async with httpx.AsyncClient() as client:
#         unknown_find_better_name = await client.get(urljoin(quiz_url, uri))
#         return unknown_find_better_name.content
