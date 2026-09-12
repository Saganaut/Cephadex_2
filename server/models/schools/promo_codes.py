import datetime as dt

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


##TODO: Ensure that the referral is a valid value for type in pg DB
class PromoCodes(Base):
    __tablename__ = "promo_codes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(10), nullable=False)
    type: Mapped[str] = mapped_column(String(10), nullable=False)  ## promo, school, referral
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    expiration_date: Mapped[dt.datetime] = mapped_column(DateTime, nullable=True)
    expired: Mapped[bool] = mapped_column(Boolean, default=False)
    school_id: Mapped[int] = mapped_column(Integer, ForeignKey("schools.id"), nullable=True)
    school_role: Mapped[str] = mapped_column(String(10), nullable=True)  ## admin, teacher, student
    promo_type: Mapped[str] = mapped_column(String(10), nullable=True)  ## credits
    times_used: Mapped[int] = mapped_column(Integer, default=0)
    max_uses: Mapped[int] = mapped_column(Integer, default=0)
    credits: Mapped[int] = mapped_column(Integer, default=0)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "code": self.code,
            "type": self.type,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else None,
            "expiration_date": self.expiration_date.isoformat()
            if isinstance(self.expiration_date, dt.datetime)
            else None,
            "expired": self.expired,
            "school_id": self.school_id,
            "school_role": self.school_role,
            "promo_type": self.promo_type,
            "times_used": self.times_used,
            "max_uses": self.max_uses,
            "credits": self.credits,
        }
