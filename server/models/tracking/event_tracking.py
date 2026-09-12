import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class EventTracking(Base):
    __tablename__ = "event_tracking"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    type: Mapped[dt.datetime] = mapped_column(String(64), nullable=False)
    data: Mapped[dt.datetime] = mapped_column(String(500), nullable=True)
    details: Mapped[dt.datetime] = mapped_column(String(500), nullable=True)
    result: Mapped[dt.datetime] = mapped_column(String(30), nullable=True)
    ref_table: Mapped[dt.datetime] = mapped_column(String(30), nullable=True)
    ref_row_id: Mapped[int] = mapped_column(Integer, nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=dt.datetime.now(),
    )
    time_updated: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=dt.datetime.now(),
        nullable=True,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user": self.user,
            "event_type": self.type,
            "event_data": self.data,
            "event_details": self.details if self.details is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "time_updated": self.time_updated.isoformat()
            if isinstance(self.time_updated, dt.datetime)
            else self.time_updated,
            "result": self.result if self.result is not None else None,
            "ref_table": self.ref_table if self.ref_table is not None else None,
            "ref_row_id": self.ref_row_id if self.ref_row_id is not None else None,
        }
