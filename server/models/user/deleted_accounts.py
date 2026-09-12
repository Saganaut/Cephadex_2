import datetime as dt

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class DeletedAccounts(Base):
    __tablename__ = "deleted_accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer)
    email: Mapped[str] = mapped_column(String(255))
    time_created: Mapped[dt.datetime] = mapped_column(DateTime)
    time_deleted: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=func.now(),
        server_default=func.now(),
    )
    reason: Mapped[str] = mapped_column(String(255))
    reason_details: Mapped[str] = mapped_column(String(500))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "email": self.email,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "time_updated": self.time_updated.isoformat()
            if isinstance(self.time_updated, dt.datetime)
            else self.time_updated,
            "reason": self.reason if self.reason is not None else None,
            "reason_details": self.reason_details if self.reason_details is not None else None,
        }
