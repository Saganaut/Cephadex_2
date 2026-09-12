import datetime as dt
import enum

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Enum

from startup.setup_db import Base


class NotificationType(enum.Enum):
    group_invite = "group_invite"
    quiz_assigned = "quiz_assigned"
    deck_shared = "deck_shared"


class RefTableType(enum.Enum):
    deck_sharing = "deck_sharing"
    quiz_sharing = "quiz_sharing"
    group_invite = "group_invite"


class Notifications(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
    )
    notification_type: Mapped[NotificationType] = mapped_column(
        Enum(NotificationType, name="notifications_notification_type"),
    )
    ref_table: Mapped[RefTableType] = mapped_column(
        Enum(RefTableType, name="notifications_ref_table"),
        nullable=False,
    )
    ref_id: Mapped[int] = mapped_column(Integer)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=func.now(),
        server_default=func.now(),
    )
    time_updated: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=func.now(),
        onupdate=func.now(),
        server_default=func.now(),
    )
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    message = mapped_column(String(255), nullable=True)
    share_id = mapped_column(String(36), nullable=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "notification_type": self.notification_type,
            "ref_table": self.ref_table.value,
            "ref_id": self.ref_id,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "time_updated": self.time_updated.isoformat()
            if isinstance(self.time_updated, dt.datetime)
            else self.time_updated,
            "read": self.read,
            "message": self.message if self.message is not None else None,
            "share_id": self.share_id if self.share_id is not None else None,
        }
