import datetime as dt
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from routes.data_classes.create_schema import CardType, Language

config = ConfigDict(
    populate_by_name=True,
    alias_generator=to_camel,
    from_attributes=True,
)


class BaseDeckSchema(BaseModel):
    model_config = config

    id: int
    name: str
    description: str | None
    creator: int | None
    public: bool = False
    create_method: Optional[str | None] = None
    category: str | None
    subject: str | None
    topic: str | None
    share_id: str | None
    group_id: Optional[int] = None
    qty_cards: int | None
    img: str | None
    cards: Optional[list[int]] = None
    parents: Optional[list[int]] = None
    files: Optional[list[int]] = None
    tags: str | None
    type: str = "Deck"
    group: Optional[list[int]] = None


class DeckSchema(BaseDeckSchema):
    model_config = config

    time_created: str | dt.datetime
    time_updated: str | dt.datetime
    times_studied: int = 0
    access_date: str | None
    share_date: str | None
    qty_new_cards: int = 0
    shared: bool = False  ##
    accepted: bool = False  ##
    sharer: int | None  ##
    source: str | None  ##
    edited: int | None = 0  ##
    children: Optional[list[int]] = None
    fav: bool = False  ##
    qty_cards_learning: int
    qty_cards_mastered: int
    qty_groups: int
    qty_files: int
    qty_subdecks: int
    qty_cards_seen: int
    qty_cards_due: int
    qty_quizzes: int


class PublicDeckSchema(BaseDeckSchema):
    model_config = config

    creator: Optional[int] = None
    share_id: Optional[str] = None
    likes: int
    shares: int
    views: int = 0
    liked: bool = False


class BaseCardSchema(BaseModel):
    model_config = config

    id: int
    term: str
    content: str | None
    boc_2: str | None
    boc_3: str | None
    boc_4: str | None
    formula: str | None
    img: str | None
    sound: str | None
    boc_id: int | None = 0
    box_id: Optional[int] = None
    create_method: Optional[str | None] = None
    diff_lvl: float
    subject: str | None
    topic: Optional[str] = None
    custom_front: str | None
    custom_back: str | None
    language: Language | None
    len_option: Optional[str | None] = None
    qmin_option: Optional[str | None] = None
    qmax_option: Optional[str | None] = None
    category: CardType | str
    deck_id: Optional[int] = None


class CardSchema(BaseCardSchema):
    model_config = config

    srs_interval: int
    time_updated: str | None | dt.datetime
    times_asked: int
    times_correct: int
    times_correct_row: int
    time_created: str | dt.datetime
    edited: bool
    fav: bool
    share_id: Optional[str] = None
    deck_id: Optional[int] = None


class StudyCardSchema(CardSchema):
    model_config = config

    unique_id: int
    batch_number: int


class PublicCardSchema(BaseCardSchema):
    model_config = config
    type: Optional[str] = "publicCard"


class DeckAttributesSchema(BaseModel):
    model_config = config

    id: int
    deck_id: int
    subject: str | None
    grade: str | None
    topic: str | None
    sub_topic: str | None
    difficulty: str | None
    concepts: str | None
    time_created: str | dt.datetime
    language: str | None


class DeckFilesSchema(BaseModel):
    model_config = config

    id: int
    name: str
    file_path: str | None
    file_type: str | None
    file_size: int | None
    text_string: str | None
    create_type: str | None
    time_created: str
    fav: bool = False


class JobNotificationSchema(BaseModel):
    model_config = config

    id: int
    user_id: int | None
    slug: str
    state: str
    complete: bool = False
    notified: bool = False
    time_created: str | dt.datetime
    cost: int | None
    input_details: str | None
    extract_type: str | None


class SharedDeckSchema(BaseModel):
    model_config = config

    id: int
    user_id: int | None
    user_email: str
    deck_id: int
    time_created: str | dt.datetime
    share_id: str
    expire: bool
    hours_until_expire: int
    type: str = Field(description="user, guest, general")
    name: Optional[str] = None


class CardDataResponse(BaseModel):
    status: str
    message: str
    cards: list[CardSchema] | None


class CardDataWithPaginationResponse(CardDataResponse):
    model_config = config

    page_number: int
    total_pages: int


class DeckDataResponse(BaseModel):
    status: str
    message: str
    decks: list[DeckSchema] | None


class FileDataResponse(BaseModel):
    status: str
    message: str
    files: list[DeckFilesSchema] = []
    fileIds: Optional[list[int]] = None


class SharedDeckDataResponse(BaseModel):
    status: str
    message: str
    decks: list[SharedDeckSchema] | None


class GetSharedDeckDataResponse(BaseModel):
    status: str
    message: str
    decks: list[BaseDeckSchema] | None
    cards: list[PublicCardSchema] | None


class PublicDeckDataResponse(BaseModel):
    status: str
    message: str
    decks: list[PublicDeckSchema] | None
    totalPages: int | None


class PublicCardDataResponse(BaseModel):
    status: str
    message: str
    cards: list[PublicCardSchema] | None


class CardData(BaseModel):
    model_config = config

    term: str
    content: str | None
    boc_2: str | None
    boc_3: str | None
    boc_4: str | None
    category: CardType | str
    formula: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    language: Optional[str] = None
    custom_front: Optional[str] = None
    custom_back: Optional[str] = None


class UpdateDeckRequest(BaseModel):
    name: str | None
    description: str | None
    tags: str | None
    public: bool | None
    category: str | None
    subject: str | None
    topic: str | None
    img: str | None
