import datetime as dt

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class DeckFiles(Base):
    __tablename__ = "deck_files"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    file_name: Mapped[str] = mapped_column(String(100))
    file_path: Mapped[str] = mapped_column(String(255), nullable=True)
    file_type: Mapped[str] = mapped_column(String(50), nullable=True)
    file_size: Mapped[int] = mapped_column((Integer), nullable=True)
    text_string: Mapped[str] = mapped_column((Text), nullable=True)
    create_type: Mapped[str] = mapped_column((String(50)), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    fav: Mapped[bool] = mapped_column(Boolean, default=False)
    slug: Mapped[str] = mapped_column(String(30), nullable=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.file_name,
            "file_path": self.file_path if self.file_path is not None else None,
            "file_type": self.file_type if self.file_type is not None else None,
            "file_size": self.file_size if self.file_size is not None else None,
            "text_string": self.text_string if self.text_string is not None else None,
            "create_type": self.create_type if self.create_type is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,  # converting time to Mapped[str]ing
            "fav": self.fav if self.fav is not None else False,
            "slug": self.slug if self.slug is not None else None,
        }
