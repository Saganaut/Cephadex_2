import datetime as dt

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class Card(Base):
    __tablename__ = "card"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    term: Mapped[str] = mapped_column(String(1000), nullable=False)
    # content == Back of card 1
    content: Mapped[str] = mapped_column(String(5000), nullable=False)
    ## used for MCQ wrong answers
    boc_2: Mapped[str] = mapped_column(String(1000), nullable=True)
    boc_3: Mapped[str] = mapped_column(String(1000), nullable=True)
    boc_4: Mapped[str] = mapped_column(String(1000), nullable=True)
    formula: Mapped[str] = mapped_column(String(255), nullable=True)
    img: Mapped[str] = mapped_column(String(255), nullable=True)
    sound: Mapped[str] = mapped_column(String(255), nullable=True)
    boc_id: Mapped[float] = mapped_column(Float(10), nullable=True, default=0)
    box_id: Mapped[float] = mapped_column(Float(10), nullable=True, default=0)
    srs_interval: Mapped[float] = mapped_column(Integer, default=1)
    time_updated: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=dt.datetime.now(),
        onupdate=dt.datetime.now(),
    )
    times_asked: Mapped[int] = mapped_column(Integer, default=0)
    times_correct: Mapped[int] = mapped_column(Integer, default=0)
    times_correct_row: Mapped[int] = mapped_column(Integer, default=0)
    create_method: Mapped[str] = mapped_column(String(20), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    category: Mapped[str] = mapped_column(String(50), nullable=True)
    edited: Mapped[bool] = mapped_column(Boolean, default=False)
    diff_lvl: Mapped[float] = mapped_column(Float(10), default=1)
    subject: Mapped[str] = mapped_column(String(50), nullable=True)
    topic: Mapped[str] = mapped_column(String(100), nullable=True)
    custom_front: Mapped[str] = mapped_column(String(255), nullable=True)
    custom_back: Mapped[str] = mapped_column(String(255), nullable=True)
    language: Mapped[str] = mapped_column(String(50), nullable=True)
    len_option: Mapped[str] = mapped_column(String(50), nullable=True)
    qmin_option: Mapped[str] = mapped_column(String(50), nullable=True)
    qmax_option: Mapped[str] = mapped_column(String(50), nullable=True)
    fav: Mapped[bool] = mapped_column(Boolean, default=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "term": self.term,
            "content": self.content if self.content is not None else None,
            "boc_2": self.boc_2 if self.boc_2 is not None else None,
            "boc_3": self.boc_3 if self.boc_3 is not None else None,
            "boc_4": self.boc_4 if self.boc_4 is not None else None,
            "formula": self.formula if self.formula is not None else None,
            "img": self.img if self.img is not None else None,
            "sound": self.sound if self.sound is not None else None,
            "boc_id": self.boc_id if self.boc_id is not None else None,
            "box_id": self.box_id if self.box_id is not None else 0,
            "srs_interval": self.srs_interval if self.srs_interval is not None else None,
            "time_updated": self.time_updated.isoformat()
            if isinstance(self.time_updated, dt.datetime)
            else self.time_updated,
            "times_asked": self.times_asked if self.times_asked is not None else 0,
            "times_correct": self.times_correct if self.times_correct is not None else 0,
            "times_correct_row": self.times_correct_row
            if self.times_correct_row is not None
            else 0,
            "create_method": self.create_method if self.create_method is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "category": self.category if self.category is not None else None,
            "edited": self.edited if self.edited is not None else None,
            "diff_lvl": self.diff_lvl if self.diff_lvl is not None else None,
            "subject": self.subject if self.subject is not None else None,
            "topic": self.topic if self.topic is not None else None,
            "custom_front": self.custom_front if self.custom_front is not None else None,
            "custom_back": self.custom_back if self.custom_back is not None else None,
            "language": self.language if self.language is not None else None,
            "len_option": self.len_option if self.len_option is not None else None,
            "qmin_option": self.qmin_option if self.qmin_option is not None else None,
            "qmax_option": self.qmax_option if self.qmax_option is not None else None,
            "fav": self.fav if self.fav is not None else False,
        }

    def to_dict_public(self) -> dict:
        return {
            "id": self.id,
            "term": self.term,
            "content": self.content if self.content is not None else None,
            "boc_2": self.boc_2 if self.boc_2 is not None else None,
            "boc_3": self.boc_3 if self.boc_3 is not None else None,
            "boc_4": self.boc_4 if self.boc_4 is not None else None,
            "formula": self.formula if self.formula is not None else None,
            "img": self.img if self.img is not None else None,
            "sound": self.sound if self.sound is not None else None,
            "category": self.category if self.category is not None else None,
            "diff_lvl": self.diff_lvl if self.diff_lvl is not None else None,
            "subject": self.subject if self.subject is not None else None,
            "topic": self.topic if self.topic is not None else None,
            "custom_front": self.custom_front if self.custom_front is not None else None,
            "custom_back": self.custom_back if self.custom_back is not None else None,
            "language": self.language if self.language is not None else None,
        }
