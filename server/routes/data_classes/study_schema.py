from typing import Optional

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from routes.data_classes.deck_schema import StudyCardSchema

config = ConfigDict(
    populate_by_name=True, alias_generator=to_camel, from_attributes=True
)


class GetCardsDueResponse(BaseModel):
    status: str
    message: str
    cards: list[StudyCardSchema]


class AnsweredCardData(BaseModel):
    model_config = config

    card_id: int
    action: str = Field(description="one of 'incr', 'decr', 'skip', 'easy', 'hard'")
    unique_id: int | None
    answer: Optional[str | None] = None


class GetCardsDueRequest(BaseModel):
    model_config = config

    deck_id: int
    batch_number: int | None
    cards: list[AnsweredCardData] | None
    settings: dict[str, int] | None
