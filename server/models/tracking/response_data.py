import datetime as dt

from sqlalchemy import Boolean, DateTime, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class ResponseData(Base):
    __tablename__ = "response_data"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prompt: Mapped[str] = mapped_column(Text)
    response: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        index=True,
        default=dt.datetime.now(),
    )
    success: Mapped[bool] = mapped_column(Boolean)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "prompt": self.prompt,
            "response": self.response,
            "content": self.content,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "success": self.success,
        }
