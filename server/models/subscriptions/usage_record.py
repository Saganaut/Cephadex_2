import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class UsageRecord(Base):
    __tablename__ = "usage_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    operation_type: Mapped[str] = mapped_column(String(50), nullable=False)
    operation_details: Mapped[str] = mapped_column(
        String(50),
        nullable=True,
        default="None",
    )
    operation_count: Mapped[int] = mapped_column(Integer, nullable=False)
    remaining_count: Mapped[int] = mapped_column(Integer, nullable=False)
    time_period: Mapped[str] = mapped_column(String(50), nullable=False)
    limit_count: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[dt.datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=dt.datetime.now(),
    )
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="active")
    source_ip: Mapped[str] = mapped_column(String(50), nullable=True, default="n/a")
    payment_status: Mapped[str] = mapped_column(String(50), default="unpaid")
    remaining_pictures: Mapped[int] = mapped_column(Integer, nullable=True, default=0)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "operation_type": self.operation_type,
            "operation_details": self.operation_details,
            "operation_count": self.operation_count,
            "remaining_count": self.remaining_count,
            "time_period": self.time_period,
            "limit_count": self.limit_count,
            "date": self.date.isoformat() if isinstance(self.date, dt.datetime) else self.date,
            "status": self.status if self.status else None,
            "source_ip": self.source_ip if self.source_ip else None,
            "payment_status": self.payment_status if self.payment_status else None,
        }
