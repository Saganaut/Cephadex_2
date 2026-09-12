import datetime as dt

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base

# ALTER TABLE deck_attributes
# MODIFY subject VARCHAR(50),
# MODIFY grade VARCHAR(50),
# MODIFY concepts VARCHAR(200);


class DeckAttributes(Base):
    __tablename__ = "deck_attributes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    deck_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("deck.id", ondelete="CASCADE"),
    )
    subject: Mapped[str] = mapped_column(String(50), nullable=True)
    grade: Mapped[str] = mapped_column(String(50), nullable=True)
    topic: Mapped[str] = mapped_column(String(100), nullable=True)
    sub_topic: Mapped[str] = mapped_column(String(100), nullable=True)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=True)
    concepts: Mapped[str] = mapped_column(String(200), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    language: Mapped[str] = mapped_column(String(50), nullable=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "deck_id": self.deck_id,
            "subject": self.subject if self.subject is not None else None,
            "grade": self.grade if self.grade is not None else None,
            "topic": self.topic if self.topic is not None else None,
            "sub_topic": self.sub_topic if self.sub_topic is not None else None,
            "difficulty": self.difficulty if self.difficulty is not None else None,
            "concepts": self.concepts if self.concepts is not None else None,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "language": self.language if self.language is not None else None,
        }
