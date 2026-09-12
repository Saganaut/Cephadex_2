import datetime as dt

from sqlalchemy import (  # Import the missing DateTime class
    DateTime,
    ForeignKey,
    Integer,
)
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class UserDeckLikes(Base):
    __tablename__ = "user_deck_likes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)  # type:ignore
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)  # type:ignore
    deck_id: Mapped[int] = mapped_column(Integer, ForeignKey("deck.id"), nullable=False)  # type:ignore
    created_at: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=dt.datetime.now(),
    )  # type:ignore
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=dt.datetime.now(),
        onupdate=dt.datetime.now(),
    )  # type:ignore

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "deck_id": self.deck_id,
            "created_at": self.created_at.isoformat()
            if isinstance(self.created_at, dt.datetime)
            else self.created_at,
            "updated_at": self.updated_at.isoformat()
            if isinstance(self.updated_at, dt.datetime)
            else self.updated_at,
        }
