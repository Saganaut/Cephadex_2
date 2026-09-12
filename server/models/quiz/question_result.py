import datetime as dt

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class QuestionResult(Base):
    __tablename__ = "question_result"

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
    question_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("question.id", ondelete="SET NULL"),
        nullable=True,
    )
    answer: Mapped[str] = mapped_column(String(1000))
    points: Mapped[int] = mapped_column((Integer), default=0)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )

    quiz_result_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("test_result.id", ondelete="CASCADE"),
    )
    correct: Mapped[bool] = mapped_column(Boolean, default=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "test_id": self.test_id,
            "taker": self.taker if self.taker is not None else None,
            "question_id": self.question_id if self.question_id else None,
            "answer": self.answer if self.answer is not None else None,
            "points": self.points if self.points is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "quiz_result_id": self.quiz_result_id if self.quiz_result_id is not None else None,
            "correct": self.correct if self.correct is not None else False,
        }
