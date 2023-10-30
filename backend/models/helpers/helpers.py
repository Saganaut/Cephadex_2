import string
import tiktoken 
import numpy as np
from flask import render_template
from typing import Union
from flask import Response
from models.helpers.log_decorators import log_decorator


encoding = tiktoken.get_encoding("cl100k_base")

def remove_punctuation(words: str) -> str:
    s = words
    punct = string.punctuation  # contains all punctuation characters
    return ''.join([char for char in s if char not in punct])

@log_decorator
def split_text(text: str, n: int = 1700) -> Union[list, str]:
    tokens = count_tokens(text)
    if tokens > n:
        n_chunks = tokens // n
        if tokens % n != 0:
            n_chunks += 1
        chunks = np.array_split(text.split(), n_chunks)
        return [' '.join(chunk) for chunk in chunks]
    else:
        return text
    
    
## TOKEN HANDLERS
def count_tokens(text:str) -> int:
    tokens = encoding.encode(text)
    return len(tokens)

def token_encoding(text) -> list[int]:
    return encoding.encode(text)

def token_decoding(encoded_text: list[int]) -> str:
    return encoding.decode(encoded_text)

## split list of tokens into chunks of n tokens
def split_tokens(tokens: int, n: int):
    return [tokens[i:i+n] for i in range(0, len(tokens), n)]

