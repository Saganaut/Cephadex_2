import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class BlogPost(Base):
    __tablename__ = "blog_post"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100))
    slug: Mapped[str] = mapped_column(String(100))
    content: Mapped[str] = mapped_column(Text)
    summary: Mapped[str] = mapped_column(Text)
    author_name: Mapped[str] = mapped_column(String(100), nullable=True)
    tags: Mapped[str] = mapped_column(String(100), nullable=True)
    thumbnail: Mapped[str] = mapped_column(String(100), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    time_updated: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
        onupdate=lambda: dt.datetime.now(),
    )
    views: Mapped[int] = mapped_column(Integer, default=0)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    category: Mapped[str] = mapped_column(String(100), nullable=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "content": self.content if self.content is not None else None,
            "summary": self.summary if self.summary is not None else None,
            "author_name": self.author_name if self.author_name is not None else None,
            "tags": self.tags if self.tags is not None else None,
            "thumbnail": self.thumbnail if self.thumbnail is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "time_updated": self.time_updated.isoformat()
            if isinstance(self.time_updated, dt.datetime)
            else self.time_updated,
            "views": self.views if self.views is not None else 0,
            "user_id": self.user_id if self.user_id is not None else None,
        }
