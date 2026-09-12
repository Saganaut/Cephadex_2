import datetime as dt
import uuid

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from startup.setup_db import Base

HOURS_BEFORE_EXPIRATION = 168


class GroupInvite(Base):
    __tablename__ = "group_invite"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    group_name: Mapped[str] = mapped_column(String(255))
    group_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("group.id", ondelete="CASCADE"),
    )
    group = relationship("Group", foreign_keys=[group_id])
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
    )
    invited_by_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
    )
    invited_by_email: Mapped[str] = mapped_column(String(255), nullable=True)
    invited_by_username: Mapped[str] = mapped_column(String(20), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    time_updated: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=dt.datetime.now(),
        onupdate=dt.datetime.now(),
    )
    username: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(255))
    share_id: Mapped[str] = mapped_column(
        String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4()),
    )
    expire: Mapped[bool] = mapped_column(Boolean, default=True)
    hours_until_expire: Mapped[int] = mapped_column(
        Integer,
        default=HOURS_BEFORE_EXPIRATION,
    )  # type:ignore

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "group_name": self.group_name if self.group_name is not None else None,
            "group_id": self.group_id,
            "user_id": self.user_id,
            "invited_by_id": self.invited_by_id if self.invited_by_id is not None else None,
            "invited_by_email": self.invited_by_email
            if self.invited_by_email is not None
            else None,
            "invited_by_username": self.invited_by_username
            if self.invited_by_username is not None
            else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "time_updated": self.time_updated.isoformat()
            if isinstance(self.time_updated, dt.datetime)
            else self.time_updated,
            "username": self.username if self.username is not None else None,
            "email": self.email if self.email is not None else "not available",
            "share_id": self.share_id,
            "expire": self.expire,
            "hours_until_expire": self.hours_until_expire,
        }
