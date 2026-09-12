import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class Referrers(Base):
    __tablename__ = "referrers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(10), nullable=False)
    referrer_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "code": self.code,
            "referrer_id": self.referrer_id,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else None,
        }
