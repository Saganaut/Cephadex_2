import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class Referrals(Base):
    __tablename__ = "referalls"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    refered_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    referrered_to_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "refered_by_id": self.refered_by_id,
            "referrered_to_id": self.referrered_to_id,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else None,
        }
