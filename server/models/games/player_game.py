from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class PlayerGame(Base):
    __tablename__ = "player_game"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    player_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
    )
    username: Mapped[str] = mapped_column(String(64))
    game_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("game.id", ondelete="CASCADE"),
    )
    game_type: Mapped[str] = mapped_column(String(20), nullable=True)
    turns_as_main_player: Mapped[int] = mapped_column(Integer, default=0)
    points: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(50), nullable=True)
    times_correct: Mapped[int] = mapped_column(Integer, default=0)
    times_deceiver: Mapped[int] = mapped_column(Integer, default=0)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "player_id": self.player_id,
            "username": self.username if self.username is not None else "anonymous",
            "game_id": self.game_id if self.game_id is not None else None,
            "turns_as_main_player": self.turns_as_main_player
            if self.turns_as_main_player is not None
            else 0,
            "points": self.points if self.points is not None else 0,
            "status": self.status if self.status is not None else None,
            "times_correct": self.times_correct if self.times_correct is not None else 0,
            "times_deceiver": self.times_deceiver if self.times_deceiver is not None else 0,
        }
