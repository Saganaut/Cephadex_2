import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class Images(Base):
    __tablename__ = "images"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    blog_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("blog_post.id"),
        nullable=True,
    )  # Corrected this line
    name: Mapped[str] = mapped_column(String(50), nullable=True)
    type: Mapped[str] = mapped_column(String(50), nullable=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    thumbnail_url: Mapped[str] = mapped_column(String(255), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "blog_id": self.blog_id if self.blog_id is not None else None,
            "name": self.name if self.name is not None else None,
            "type": self.type if self.type is not None else None,
            "image_url": self.image_url if self.image_url is not None else None,
            "thumbnail_url": self.thumbnail_url if self.thumbnail_url is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
        }
