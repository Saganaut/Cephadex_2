from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from startup.setup_db import Base


class PublicDeckData(Base):
    __tablename__ = "public_deck_data"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    deck_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("deck.id", ondelete="CASCADE"), nullable=False
    )
    likes: Mapped[int] = mapped_column(Integer, default=0)
    shares: Mapped[int] = mapped_column(Integer, default=0)
