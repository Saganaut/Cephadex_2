import datetime as dt

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.relational_tables.association_tables import questions
from startup.setup_db import Base


class Test(Base):
    __tablename__ = "test"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200))
    points: Mapped[int] = mapped_column((Integer), default=0)
    num_questions: Mapped[int] = mapped_column((Integer), default=0)
    category: Mapped[str] = mapped_column(String(50), nullable=True)
    subject: Mapped[str] = mapped_column(String(50), nullable=True)
    topic: Mapped[str] = mapped_column(String(50), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    due_date: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now() + dt.timedelta(days=7),
    )
    ## TODO: at some point come up with a better way of doing this,
    # there is a lot of orphaned quizzes
    creator: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    result_reveal: Mapped[bool] = mapped_column((Boolean), default=False)
    answer_reveal: Mapped[bool] = mapped_column((Boolean), default=False)
    time_limit: Mapped[int] = mapped_column((Integer), nullable=True)
    instructions: Mapped[str] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    shuffle: Mapped[bool] = mapped_column((Boolean), default=False)
    img: Mapped[str] = mapped_column(String(255), nullable=True)
    text: Mapped[str] = mapped_column(String(2550), nullable=True)
    deck_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("deck.id", ondelete="SET NULL"),
        nullable=True,
    )
    # share_id: Mapped[str] = mapped_column(String(255), nullable=True)  ##! deprecated
    fav: Mapped[bool] = mapped_column(Boolean, default=False)
    qty_questions: Mapped[int] = mapped_column(Integer, default=0)
    questions = relationship(
        "Question",
        secondary=questions,
        backref="quiz",
        lazy="select",
    )
    jeopardy: Mapped[bool] = mapped_column(Boolean, default=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "points": self.points if self.points is not None else 0,
            "num_questions": self.num_questions if self.num_questions is not None else 0,
            "category": self.category if self.category is not None else None,
            "subject": self.subject if self.subject is not None else None,
            "topic": self.topic if self.topic is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "due_date": self.due_date.isoformat()
            if isinstance(self.due_date, dt.datetime)
            else self.time_created,
            "creator": self.creator if self.creator is not None else None,
            "result_reveal": self.result_reveal if self.result_reveal is not None else False,
            "answer_reveal": self.answer_reveal if self.answer_reveal is not None else False,
            "time_limit": self.time_limit if self.time_limit is not None else None,
            "instructions": self.instructions if self.instructions is not None else None,
            "description": self.description if self.description is not None else None,
            "shuffle": self.shuffle if self.shuffle is not None else False,
            "img": self.img if self.img is not None else None,
            "text": self.text if self.text is not None else None,
            "deck_id": self.deck_id if self.deck_id is not None else None,
            "fav": self.fav if self.fav is not None else False,
            "qty_questions": self.qty_questions if self.qty_questions is not None else 0,
            "jeopardy": self.jeopardy if self.jeopardy is not None else False,
        }
