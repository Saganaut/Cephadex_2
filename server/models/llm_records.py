import datetime as dt

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class LlmRecords(Base):
    __tablename__ = "llm_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prompt: Mapped[str] = mapped_column(String(5000), nullable=True)
    sys_instruct: Mapped[str] = mapped_column(String(1000), nullable=True)
    response: Mapped[str] = mapped_column(String(5000), nullable=True)
    model: Mapped[str] = mapped_column(String(50), nullable=True)
    temperature: Mapped[float] = mapped_column(Float, nullable=True)
    response_format: Mapped[str] = mapped_column(String(50), nullable=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=True)
    type: Mapped[str] = mapped_column(String(20), nullable=True)
    subtype: Mapped[str] = mapped_column(String(20), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    version: Mapped[float] = mapped_column(Float, default=0.1)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "prompt": self.prompt,
            "sys_instruct": self.sys_instruct,
            "response": self.response,
            "model": self.model,
            "temperature": self.temperature,
            "response_format": self.response_format,
            "rating": self.rating,
            "type": self.type,
            "subtype": self.subtype,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "version": self.version,
        }
