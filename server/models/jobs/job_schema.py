from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

from routes.data_classes.create_schema import (
    CardType,
    DetailField,
    ExtrasOptions,
    Language,
    Subject,
)


class PromptSchema(BaseModel):
    type: str
    subtype: str
    prompt: str
    version: Optional[float] = None


class PayloadSchema(BaseModel):
    """all prompt options"""

    card_type: CardType | None
    subject: Subject | None
    language: Language | None
    difficulty: str | None
    detail_lvl: DetailField | None
    min: str | None
    max: str | None
    custom_front: str | None
    custom_back: str | None
    extras: list[ExtrasOptions] | None


class ExtractedContent(BaseModel):
    text: str
    source: str
    page: int


class ExtractorDataSchema(BaseModel):
    slug: Optional[str] = None
    user_id: int
    deck_id: Optional[int] = None
    tokens: Optional[int] = 0
    existing_deck: int | None
    new_deck_name: str | None
    new_deck_description: str | None
    new_deck_tags: str | None
    task_type: Optional[str] = None
    source_type: Optional[str] = None
    extension: Optional[str] = None
    duration: Optional[float] = None
    file_path: str | None
    text_input: str | None
    link_input: str | None
    expanded_link: bool = False
    extracted_content: Optional[list[ExtractedContent]] = None
    text: Optional[str] = None
    split_text: list[str]
    file_id: Optional[int] = None
    payload: PayloadSchema


class State(str, Enum):
    queued = "queued"
    pending = "pending"
    complete = "complete"
    failed = "failed"


class EmbeddingSchema(BaseModel):
    slug: str
    user_id: Optional[int] = None
    type: str = Field("standard", description="document page chunk or standard")
    deck_id: Optional[int] = None
    text: str
    item_number: int
    item_quantity: int
    page: Optional[int] = None
    source: str
    document: Optional[str] = None
    file_id: Optional[int] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    state: Optional[str] = None
    embedding: Optional[list] = None
    embedding_type: Optional[str] = None
    vector_score: Optional[float] = None


class ChatQuerySchema(BaseModel):
    query: str
    type: str
    user_id: int
    deck_id: Optional[int] = None
    file_id: Optional[int] = None
    embedding: list[float] = []
    context: str = ""
    prev_message: Optional[str] = None
    prompt: Optional[str] = None
    response: Optional[str] = None
    sources: Optional[set] = None
    pages: list[int] = []
    sys_instruct: Optional[str] = None


class JobNotificationSchema(BaseModel):
    slug: str
    user_id: int
    deck_id: int
    time_created: str
    payload: PayloadSchema
    text: Optional[str] = None
    processed_text: Optional[str] = None
    time_updated: str
    state: str = Field(
        "queued",
        description="can be queued, pending, complete, notified, failed",
    )
    cost: float


class JobSchema(BaseModel):
    slug: str
    user_id: int
    deck_id: int
    type: str = Field("standard", description="can be standard or audio")
    task_type: str | CardType
    item_number: int
    item_quantity: int
    time_created: str
    priority: int
    key: Optional[str] = None
    payload: PayloadSchema
    text: Optional[str] = None
    processed_text: Optional[str] = None
    file_path: Optional[str] = None
    state: str = Field("queued", description="can be queued, pending, complete, notified, failed")
    error_message: str | None
    qty_cards_created: int

    #  "promptions":
    #      {"main": "Definitions",
    #       "subject": null,
    #       "trans": null,
    #       "lang": null,
    #       "detail_lvl": null,
    #       "min": null,
    #       "max": null,
    #       "images": null, "
    #       save_text": null,
    #       "custom_term": "",
    #       "custom_content": "",
    #       "create_summary": true,
    #       "create_notes": false}, "task_type": "standard"}

    # {"promptions":
    # {"main": "Definitions",
    #  "subject": null,
    #  "trans": null,
    #  "lang": null,
    #  "detail_lvl": null,
    #  "min": null,
    #  "max": null,
    #  "images": null,
    #  "save_text": null,
    #  "custom_term": null,
    #  "custom_content": null},
    # "segment": "static\\files/98824segment_0.mp3",
    # "user_id": 282}
