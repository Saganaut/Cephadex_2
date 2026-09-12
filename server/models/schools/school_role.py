import datetime as dt

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class SchoolRole(Base):
    __tablename__ = "school_role"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    school_id: Mapped[int] = mapped_column(Integer, ForeignKey("schools.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(10), nullable=False)  ## admin, teacher, student
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    sub_plan: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("subscription_plans.id"),
        nullable=False,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "school_id": self.school_id,
            "role": self.role,
            "time_created": self.time_created,
            "deleted": self.deleted,
            "sub_plan": self.sub_plan,
        }
