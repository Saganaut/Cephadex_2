import datetime as dt
from typing import Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from startup.setup_db import Base


## TO DO what happens to group if creator deletes account
class Group(Base):
    __tablename__ = "group"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    group_type: Mapped[str] = mapped_column(String(255), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    time_updated: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
        onupdate=lambda: dt.datetime.now(),
    )
    creator_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "user.id",
            ondelete="SET NULL",
        ),  ## !TODO CHECK IF THIS WILL CAUSE PROBLEMS
        nullable=True,
    )
    img: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_private: Mapped[bool] = mapped_column(Boolean, default=False)
    fav: Mapped[bool] = mapped_column(Boolean, default=False)
    decks = relationship("Deck", back_populates="group")
    # creator = relationship("User", foreign_keys=[creator_id])

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description if self.description is not None else None,
            "group_type": self.group_type if self.group_type is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "time_updated": self.time_updated.isoformat()
            if isinstance(self.time_updated, dt.datetime)
            else self.time_updated,
            "creator_id": self.creator_id,
            "img": self.img if self.img is not None else None,
            "is_private": self.is_private if self.is_private is not None else False,
            "fav": self.fav if self.fav is not None else False,
        }
