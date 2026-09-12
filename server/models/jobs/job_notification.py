import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class JobNotification(Base):
    __tablename__ = "job_notification"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=True,
    )
    slug: Mapped[str] = mapped_column(String(128), nullable=False)
    state: Mapped[str] = mapped_column(String(10), nullable=False, default="queued")
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    cost: Mapped[int] = mapped_column(Integer, default=0)
    source_type: Mapped[str] = mapped_column(String(128), nullable=True)
    payload: Mapped[str] = mapped_column(String(500), nullable=True)
    error_details: Mapped[str] = mapped_column(String(256), nullable=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "slug": self.slug,
            "state": self.state if self.state is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "cost": self.cost if self.cost is not None else 0,
            "source_type": self.source_type if self.source_type is not None else None,
            "payload": self.payload if self.payload is not None else None,
            "error_details": self.error_details if self.error_details is not None else None,
        }
