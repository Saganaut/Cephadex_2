import datetime as dt

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class StripeEvents(Base):
    __tablename__ = "stripe_events"
    id: Mapped[str] = mapped_column(Integer, primary_key=True, autoincrement=True)
    stripe_event_id: Mapped[str] = mapped_column(String(255), nullable=True)
    event_type: Mapped[str] = mapped_column(String(255), nullable=True)
    event_data = Column(Text, nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )

    stripe_customer_id: Mapped[str] = mapped_column(String(255), nullable=True)
    user_id: Mapped[str] = mapped_column(Integer, ForeignKey("user.id"))
    processed: Mapped[bool] = mapped_column(Boolean, default=False)
    processed_at: Mapped[dt.datetime] = mapped_column(DateTime, nullable=True)
    error_message: Mapped[str] = mapped_column(String(255), nullable=True)
