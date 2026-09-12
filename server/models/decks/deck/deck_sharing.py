import datetime as dt
import enum
import uuid

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String

# from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Enum

from startup.setup_db import Base

HOURS_BEFORE_EXPIRATION = 168
EXPIRE_OR_NOT = True


class DeckSharingType(enum.Enum):
    user = "user"
    guest = "guest"
    general = "general"


class DeckSharing(Base):
    __tablename__ = "deck_sharing"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=True,
    )
    user_email: Mapped[str] = mapped_column(String(255), nullable=True)
    deck_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("deck.id", ondelete="CASCADE"),
        nullable=False,
    )
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    share_id: Mapped[str] = mapped_column(
        String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4()),
    )
    expire: Mapped[bool] = mapped_column(Boolean, default=EXPIRE_OR_NOT)  # type:ignore
    hours_until_expire: Mapped[int] = mapped_column(
        Integer,
        default=HOURS_BEFORE_EXPIRATION,
    )  # type:ignore
    type: Mapped[DeckSharingType] = mapped_column(
        Enum(DeckSharingType, name="deck_sharing_type"),
        nullable=False,
    )  # type:ignore

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id if self.user_id else None,
            "user_email": self.user_email if self.user_email else None,
            "deck_id": self.deck_id,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "share_id": self.share_id,
            "expire": self.expire,
            "hours_until_expire": self.hours_until_expire,
            "type": self.type.value,
        }
