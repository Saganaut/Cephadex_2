import datetime as dt

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class TestResult(Base):
    __tablename__ = "test_result"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    test_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("test.id", ondelete="SET NULL"),
        nullable=True,
    )
    taker: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    taker_name: Mapped[str] = mapped_column(String(100), nullable=True)
    taker_username: Mapped[str] = mapped_column(String(20), nullable=True)
    creator: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    creator_username: Mapped[str] = mapped_column(String(20), nullable=True)
    due_date: Mapped[dt.datetime] = mapped_column(DateTime, nullable=True)
    start_time: Mapped[int] = mapped_column(DateTime)
    end_time: Mapped[dt.datetime] = mapped_column(DateTime)
    points: Mapped[int] = mapped_column((Integer), default=0)
    correct: Mapped[int] = mapped_column((Integer), default=0)
    blank: Mapped[int] = mapped_column((Integer), default=0)
    graded: Mapped[bool] = mapped_column(Boolean, default=False)
    private: Mapped[bool] = mapped_column(Boolean, default=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "test_id": self.test_id,
            "taker": self.taker,
            "creator": self.creator if self.creator is not None else None,
            "due_date": self.due_date.isoformat() if self.due_date is not None else None,
            "start_time": self.start_time.isoformat()
            if isinstance(self.start_time, dt.datetime)
            else self.start_time,
            "end_time": self.end_time.isoformat() if self.end_time is not None else None,
            "points": self.points if self.points is not None else 0,
            "correct": self.correct if self.correct is not None else False,
            "blank": self.blank if self.blank is not None else 0,
            "graded": self.graded if self.graded is not None else False,
            "private": self.private if self.private is not None else False,
            "taker_name": self.taker_name if self.taker_name is not None else None,
            "taker_username": self.taker_username if self.taker_username is not None else None,
            "creator_username": self.creator_username
            if self.creator_username is not None
            else None,
        }
