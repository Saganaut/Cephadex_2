from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class Question(Base):
    __tablename__ = "question"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(String(1000), nullable=False)
    term: Mapped[str] = mapped_column(String(1000), nullable=False)
    content: Mapped[str] = mapped_column(String(1000), nullable=False)
    boc_2: Mapped[str] = mapped_column(String(1000), nullable=True)
    boc_3: Mapped[str] = mapped_column(String(1000), nullable=True)
    boc_4: Mapped[str] = mapped_column(String(1000), nullable=True)
    formula: Mapped[str] = mapped_column(String(255), nullable=True)
    prompt_option: Mapped[str] = mapped_column(String(255), nullable=True)
    q_type: Mapped[str] = mapped_column(String(50), nullable=True)
    q_order: Mapped[int] = mapped_column(Integer, nullable=True)
    points: Mapped[int] = mapped_column(Integer, nullable=True, default=1)
    img: Mapped[str] = mapped_column(String(255), nullable=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "question": self.question,
            "term": self.term if self.term is not None else None,
            "content": self.content if self.content is not None else None,
            "boc_2": self.boc_2 if self.boc_2 is not None else None,
            "boc_3": self.boc_3 if self.boc_3 is not None else None,
            "boc_4": self.boc_4 if self.boc_4 is not None else None,
            "formula": self.formula if self.formula is not None else None,
            "prompt_option": self.prompt_option if self.prompt_option is not None else None,
            "q_type": self.q_type if self.q_type is not None else None,
            "q_order": self.q_order if self.q_order is not None else None,
            "points": self.points if self.points is not None else None,
            "img": self.img if self.img is not None else None,
        }
