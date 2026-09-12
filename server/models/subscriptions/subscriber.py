import datetime as dt

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class Subscriber(Base):
    __tablename__ = "subscriber"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=True)
    last_name: Mapped[str] = mapped_column(String(50), nullable=True)
    email: Mapped[str] = mapped_column(String(120), unique=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )

    def __repr__(self):
        return f"<Newsletter {self.email}>"

    async def subscribe(self, db: AsyncSession) -> None:
        db.add(self)
        await db.commit()

    async def unsubscribe(self, db: AsyncSession) -> None:
        await db.delete(self)
        await db.commit()

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
        }
