import datetime as dt

from sqlalchemy import DateTime, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class CachedResponse(Base):
    __tablename__ = "cached_response"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    input_type: Mapped[str] = mapped_column(String(64), nullable=True)
    input_data: Mapped[str] = mapped_column(Text, nullable=True)
    input_text: Mapped[str] = mapped_column(Text, nullable=True)
    output_type: Mapped[str] = mapped_column(String(64), nullable=True)
    output_data: Mapped[str] = mapped_column(Text, nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=dt.datetime.now(),
    )
    time_accessed: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=dt.datetime.now(),
    )
    accessed_count: Mapped[dt.datetime] = mapped_column(Integer, default=0)
    subject: Mapped[str] = mapped_column(String(64), nullable=True)
    topic: Mapped[str] = mapped_column(String(64), nullable=True)
    subtopic: Mapped[str] = mapped_column(String(64), nullable=True)
    concepts: Mapped[str] = mapped_column(String(256), nullable=True)
    difficulty: Mapped[str] = mapped_column(String(64), default=False)

    __table_args__ = (UniqueConstraint("input_type", "output_type", name="uix_cached_response"),)
