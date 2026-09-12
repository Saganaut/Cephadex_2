import codecs
import json
import re
import textwrap
from io import BytesIO
from typing import Any, List, Union

import tiktoken
from pylatexenc.latex2text import LatexNodes2Text
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

encoding = tiktoken.get_encoding("cl100k_base")


## TOKEN HANDLERS
def count_tokens(text) -> int:
    text = encoding.encode(text)
    return len(text)


def token_encoding(text: str) -> list[int]:
    """Encode a string into tokens"""
    return encoding.encode(text)


def token_decoding(text: list[int]) -> str:
    """Decode a string from tokens"""
    return encoding.decode(text)


def split_tokens(tokens: List[str], n: int) -> List[List[str]]:
    return [tokens[i : i + n] for i in range(0, len(tokens), n)]


def remove_html_tags(text: str) -> str:
    """Remove html tags from a string"""
    clean = re.compile("<.*?>")
    return re.sub(clean, "", text)


## MISC FORMATTERS
def add_period(s: str) -> str:
    if s and s[-1] != ".":
        s += "."
    return s


def check_comma_list(string: str) -> bool:
    return "," in string


def add_underscores(string: str) -> str:
    if "_" in string:
        string = string.replace("_", "___")
    return string


## turn string of comma separated terms into list of terms
def comma_list_to_list(string: str) -> List[str]:
    """Turn a comma seperated string into a list"""
    return string.split(",")


def clean_text(text: str) -> str:
    """#Decode Unicode escape sequences into actual characters"""
    text = codecs.decode(text, "unicode_escape")
    # Replace newline characters with spaces
    # This pattern matches any character that is not a letter, digit, whitespace,
    # or regular punctuation.
    pattern = r"[^\w\s.,;:?!-’'\"()]+"  # noqa: RUF001
    return re.sub(pattern, "", text)


def get_replacement_value(value: str, prefix: str = "", suffix: str = "") -> str:
    return prefix + value + suffix if value else ""


def render_latex(latex_code: str) -> str:
    return LatexNodes2Text().latex_to_text(latex_code)


def double_backslashes(s: str) -> str:
    """Help format latex formulas by adding backslahes"""
    result = ""
    pattern = r"\\\[.*?\\\]|\\\(.*?\\\)|(?<!\\)\$.+?(?<!\\)\$"
    # Match LaTeX formulas delimited by \[...\] or \(...\), or inline formulas delimited by $...$
    matches = re.findall(pattern, s)
    last_end = 0
    for match in matches:
        start = s.index(match, last_end)
        result += s[last_end:start]
        result += re.sub(r"\\", r"\\\\", match)
        last_end = start + len(match)
    result += s[last_end:]
    return result


def decode_latex_in_string(string: str) -> str:
    # Define a regular expression pattern to match LaTeX formulas
    pattern = r"(\$[^\$]*\$|\\\([^\)]*\\\))"
    # Use the pattern to find all LaTeX formulas in the string
    matches = re.findall(pattern, string)
    # Loop over the matches and replace each LaTeX formula with its decoded equivalent
    for match in matches:
        decoded = render_latex(match)
        string = string.replace(match, decoded)

    return string


def fix_json(s: str) -> Any:
    try:
        json.loads(s)
        return s
    except json.JSONDecodeError as e:
        # JSONDecodeError is raised if the string is not in valid JSON format
        # We can attempt to fix the error by removing any trailing commas or fixing the quotes
        s = s[: e.pos] + s[e.pos :].replace(",", "")
        s = s.replace("'", '"')

        try:
            json.loads(s)
            return s
        except json.JSONDecodeError as e:
            msg = "Unable to fix JSON string"
            raise ValueError(msg) from e


def create_pdf(string: str) -> BytesIO:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer)
    # Define the width and height of the canvas
    width, height = letter
    # Define the margin and the maximum line width
    margin = 36
    max_width: int = int((width - 2 * margin) // 8)
    # Wrap the string to fit within the canvas

    lines = textwrap.wrap(string, width=max_width)
    # Draw each line on the canvas
    y = height - margin
    for line in lines:
        pdf.drawString(margin, y, line)
        y -= 20  # Move down to the next line
    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer


## TODO: Fix this freaking mess - most of this is probably useless
class Formatter:
    @staticmethod
    def extract_json_from_string(s: str) -> Union[str, None]:
        json_start = s.find("[")
        if json_start == -1:
            return None
        json_end = s.rfind("]")
        if json_end == -1:
            return None
        return s[json_start : json_end + 1]

    @staticmethod
    def isolate_json_string(json_string: str) -> str:
        # Isolate JSON-like object
        start_index = json_string.find("[")
        end_index = json_string.rfind("]")
        return json_string[start_index : end_index + 1]

    @staticmethod
    def load_json_string(x: str) -> str:
        json_result, success = Formatter.try_json_load(x)

        if not success:
            json_result, success = Formatter.try_json_load(
                Formatter.fix_end_json_string_single(x),
            )
        if not success:
            json_result, success = Formatter.try_json_load(
                Formatter.fix_end_json_string_double(x),
            )
        if not success:
            (
                json_result,
                success,
            ) = Formatter.fix_end_json_string_truncate_after_last_curly_brace(x)
        if not success:
            msg = "Failed to decode JSON"
            raise json.JSONDecodeError(msg, x, 0)
        return json_result

    @staticmethod
    def try_json_load(json_string: str) -> tuple:
        try:
            return json.loads(json_string), True
        except json.JSONDecodeError:
            return None, False

    @staticmethod
    def fix_end_json_string_single(json_string: str) -> str:
        if json_string.endswith(("'", '"')):
            json_string = json_string[:-1] + "}]"
        elif json_string.endswith("}"):
            json_string += "]"
        else:
            json_string += "'}]"
        return json_string

    @staticmethod
    def fix_end_json_string_double(json_string: str) -> str:
        if json_string.endswith(("'", '"')):
            json_string = json_string[:-1] + "}]"
        elif json_string.endswith("}"):
            json_string += "]"
        else:
            json_string += '"}]'
        return json_string

    @staticmethod
    def fix_end_json_string_truncate_after_last_curly_brace(json_string: str) -> str:
        index_of_last_brace = json_string.rfind("}")
        if index_of_last_brace != -1:
            json_string = json_string[: index_of_last_brace + 1] + "]"
        return json_string

    @staticmethod
    def clean_up_content(term: str, content: str) -> str:
        x = content.strip()
        z = [term, ":"]
        y = "".join(z)

        if x.startswith(term):
            x = x.replace(term, "")

        if x.startswith(y):
            x = x.replace(y, "", 1)

        x = x.strip()
        x = add_period(x)

        return x
