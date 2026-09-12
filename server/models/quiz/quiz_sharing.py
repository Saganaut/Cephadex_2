import datetime as dt
import enum
import uuid

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Enum

from startup.setup_db import Base

## This doesn't replace the relational table "diMapped[str]ibution"
# but should be used in combination.
## diMapped[str]ibution shows takers of a quiz and should not be deleted unless the quiz is deleted
## rows in this table can be deleted when the quiz is taken or when the link expires
HOURS_BEFORE_EXPIRATION = 168


class QuizSharingType(enum.Enum):
    user = "user"
    guest = "guest"
    general = "general"
    graded = "graded"


class QuizSharing(Base):
    __tablename__ = "quiz_sharing"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=True,
    )
    user_email: Mapped[str] = mapped_column(String(255), nullable=True)
    quiz_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("test.id", ondelete="CASCADE"),
        nullable=False,
    )
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    share_id: Mapped[str] = mapped_column(
        String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4()),
    )
    expire: Mapped[bool] = mapped_column(Boolean, default=True)  # type:ignore
    hours_until_expire: Mapped[int] = mapped_column(
        Integer,
        default=HOURS_BEFORE_EXPIRATION,
    )
    type: Mapped[QuizSharingType] = mapped_column(
        Enum(QuizSharingType, name="quiz_sharing_type"),
        nullable=False,
    )
    can_retake: Mapped[bool] = mapped_column(Boolean, default=True)
    results_reported: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )  ## if true creator can see results

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id if self.user_id else None,
            "user_email": self.user_email if self.user_email else None,
            "quiz_id": self.quiz_id,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "share_id": self.share_id,
            "expire": self.expire,
            "hours_until_expire": self.hours_until_expire,
            "type": self.type.value,
            "can_retake": self.can_retake,
            "results_reported": self.results_reported,
        }
