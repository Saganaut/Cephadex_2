import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class DocRows(Base):
    __tablename__ = "doc_rows"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
    )
    deck_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("deck.id", ondelete="SET NULL"),
        nullable=True,
    )
    file_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("deck_files.id", ondelete="CASCADE"),
        nullable=True,
    )
    page: Mapped[int] = mapped_column(Integer)
    chunk: Mapped[int] = mapped_column(Integer)
    slug: Mapped[str] = mapped_column(String(255))
    text: Mapped[str] = mapped_column(String(500))
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "deck_id": self.deck_id,
            "file_id": self.file_id,
            "page": self.page,
            "chunk": self.chunk,
            "slug": self.slug,
            "text": self.text,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
        }
