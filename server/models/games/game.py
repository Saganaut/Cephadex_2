import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from startup.setup_db import Base


class Game(Base):
    __tablename__ = "game"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    creator: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )
    creator_username: Mapped[str] = mapped_column(String(20), default="Anonymous")
    current_flashcard_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("card.id", ondelete="SET NULL"),
        nullable=True,
    )
    deck_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("deck.id", ondelete="SET NULL"),
        nullable=True,
    )
    rounds: Mapped[int] = mapped_column(Integer, default=0)
    time_limit_answer: Mapped[int] = mapped_column(Integer, default=0)
    time_limit_vote: Mapped[int] = mapped_column(Integer, default=0)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    start_time: Mapped[dt.datetime] = mapped_column(DateTime, nullable=True)
    current_round: Mapped[int] = mapped_column(Integer, default=0)
    players = relationship("PlayerGame", backref="game")
    status: Mapped[str] = mapped_column(String(50))
    points_correct: Mapped[int] = mapped_column(Integer, default=2)
    points_deceiver: Mapped[int] = mapped_column(Integer, default=1)
    game_type: Mapped[str] = mapped_column(String(20), nullable=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "creator": self.creator if self.creator is not None else None,
            "creator_username": self.creator_username,
            "current_flashcard_id": self.current_flashcard_id
            if self.current_flashcard_id is not None
            else None,
            "deck_id": self.deck_id,
            "rounds": self.rounds if self.rounds is not None else None,
            "time_limit_answer": self.time_limit_answer
            if self.time_limit_answer is not None
            else None,
            "time_limit_vote": self.time_limit_vote if self.time_limit_vote is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "start_time": self.start_time.isoformat()
            if isinstance(self.start_time, dt.datetime)
            else self.start_time,
            "current_round": self.current_round if self.current_round is not None else 0,
            "status": self.status if self.status is not None else None,
            "points_correct": self.points_correct if self.points_correct is not None else None,
            "points_deceiver": self.points_deceiver if self.points_deceiver is not None else None,
            "game_type": self.game_type if self.game_type is not None else None,
        }
