import datetime as dt
import uuid
from typing import Union

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, backref, mapped_column, relationship

from models.relational_tables.association_tables import (
    distribution,
    user_group_association,
)
from startup.setup_db import Base


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(20), nullable=True, unique=True)
    email: Mapped[str] = mapped_column(String(50), nullable=False)
    first_name: Mapped[str] = mapped_column(String(50), nullable=True)
    last_name: Mapped[str] = mapped_column(String(50), nullable=True)
    external_id: Mapped[str] = mapped_column(String(255), nullable=True)
    external_type: Mapped[str] = mapped_column(String(20), nullable=True)
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    time_accessed: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
        onupdate=lambda: dt.datetime.now(),
    )
    account_type: Mapped[str] = mapped_column(String(20), nullable=True, default="free")
    account_status: Mapped[str] = mapped_column(
        String(10),
        nullable=True,
        default="free",
    )
    account_expiration: Mapped[dt.datetime] = mapped_column(DateTime, nullable=True)
    account_expiration_reason: Mapped[str] = mapped_column(String(50), nullable=True)
    pic: Mapped[str] = mapped_column(String(255), nullable=True)
    contacted_email: Mapped[bool] = mapped_column(Boolean, default=False)
    subscription_plan: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("subscription_plans.id"),
        nullable=False,
        default=1,
    )
    subscription_start_date: Mapped[dt.datetime] = mapped_column(DateTime, nullable=True)
    subscription_end_date: Mapped[dt.datetime] = mapped_column(DateTime, nullable=True)
    latest_roll_over: Mapped[dt.datetime] = mapped_column(DateTime, nullable=True)
    role: Mapped[str] = mapped_column(String(50), nullable=True)
    stripe_customer_id: Mapped[str] = mapped_column(String(255), nullable=True)
    guest: Mapped[bool] = mapped_column(Boolean, default=False)
    used_trial: Mapped[bool] = mapped_column(Boolean, default=False)
    fs_uniquifier: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4()),
    )
    quantity_decks: Mapped[int] = mapped_column(Integer, default=0)
    quantity_cards: Mapped[int] = mapped_column(Integer, default=0)
    quantity_quizzes: Mapped[int] = mapped_column(Integer, default=0)
    quantity_files: Mapped[int] = mapped_column(Integer, default=0)
    quantity_groups: Mapped[int] = mapped_column(Integer, default=0)
    quantity_decks_public: Mapped[int] = mapped_column(Integer, default=0)
    quantity_cards_mastered: Mapped[int] = mapped_column(Integer, default=0)
    quantity_cards_learning: Mapped[int] = mapped_column(Integer, default=0)
    quantity_cards_due: Mapped[int] = mapped_column(Integer, default=0)
    quantity_cards_new: Mapped[int] = mapped_column(Integer, default=0)
    remaining_credit: Mapped[int] = mapped_column(Integer, default=0)
    roll_over_date: Mapped[dt.datetime] = mapped_column(DateTime, nullable=True)
    hear_about_us: Mapped[str] = mapped_column(String(100), nullable=True)
    want_to_do: Mapped[str] = mapped_column(String(100), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    test = relationship("Test", secondary=distribution, backref="taker", lazy="select")
    groups = relationship(
        "Group",
        secondary=user_group_association,
        backref="users",
        lazy="select",
    )
    decks = relationship("Deck", backref=backref("user", lazy="select"))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            # "email_confirmed_at": None,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "external_id": self.external_id,
            "external_type": self.external_type,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "time_accessed": self.time_accessed.isoformat()
            if isinstance(self.time_accessed, dt.datetime)
            else self.time_accessed,
            "account_type": self.account_type,
            "account_status": self.account_status,
            "account_expiration": self.account_expiration.isoformat()
            if isinstance(self.account_expiration, dt.datetime)
            else self.account_expiration,
            "account_expiration_reason": self.account_expiration_reason
            if self.account_expiration_reason
            else None,
            "pic": self.pic,
            "contacted_email": self.contacted_email,
            "subscription_plan": self.subscription_plan,
            "subscription_start_date": self.subscription_start_date.isoformat()
            if isinstance(self.subscription_start_date, dt.datetime)
            else self.subscription_start_date,
            "subscription_end_date": self.subscription_end_date.isoformat()
            if isinstance(self.subscription_end_date, dt.datetime)
            else None,
            "latest_roll_over": self.latest_roll_over.isoformat()
            if isinstance(self.latest_roll_over, dt.datetime)
            else self.latest_roll_over,
            "role": self.role,
            "stripe_customer_id": self.stripe_customer_id,
            "guest": self.guest if self.guest is not None else False,
            "used_trial": self.used_trial if self.used_trial is not None else False,
            "active": self.active if self.active is not None else True,
            "hear_about_us": self.hear_about_us if self.hear_about_us is not None else None,
            "want_to_do": self.want_to_do if self.want_to_do is not None else None,
            "quantity_quizzes": self.quantity_quizzes if self.quantity_quizzes else 0,
            "quantity_decks": self.quantity_decks if self.quantity_quizzes else 0,
            "quantity_files": self.quantity_files,
            "quantity_cards": self.quantity_cards,
            "quantity_groups": self.quantity_groups,
            "quantity_decks_public": self.quantity_decks_public,
            "quantity_cards_mastered": self.quantity_cards_mastered,
            "quantity_cards_learning": self.quantity_cards_learning,
            "quantity_cards_due": self.quantity_cards_due,
            "quantity_cards_new": self.quantity_cards_new,
            "remaining_credit": self.remaining_credit,
            "roll_over_date": self.roll_over_date.isoformat()
            if isinstance(self.roll_over_date, dt.datetime)
            else self.roll_over_date,
        }

    def __init__(self, **data: Union[str, dt.datetime]) -> None:
        if "time_created" in data and isinstance(data["time_created"], str):
            data["time_created"] = dt.datetime.fromisoformat(data["time_created"])
        if "time_accessed" in data and isinstance(data["time_accessed"], str):
            data["time_accessed"] = dt.datetime.fromisoformat(data["time_accessed"])
        if "account_expiration" in data and isinstance(data["account_expiration"], str):
            data["account_expiration"] = dt.datetime.fromisoformat(
                data["account_expiration"],
            )
        if "subscription_start_date" in data and isinstance(
            data["subscription_start_date"],
            str,
        ):
            data["subscription_start_date"] = dt.datetime.fromisoformat(
                data["subscription_start_date"],
            )
        if "subscription_end_date" in data and isinstance(
            data["subscription_end_date"],
            str,
        ):
            data["subscription_end_date"] = dt.datetime.fromisoformat(
                data["subscription_end_date"],
            )
        if "latest_roll_over" in data and isinstance(data["latest_roll_over"], str):
            data["latest_roll_over"] = dt.datetime.fromisoformat(data["latest_roll_over"])
        if "roll_over_date" in data and isinstance(data["roll_over_date"], str):
            data["roll_over_date"] = dt.datetime.fromisoformat(data["roll_over_date"])
        super().__init__(**data)

    @classmethod
    def from_dict(cls, data: dict) -> "User":
        instance = cls()
        for key, value in data.items():
            if hasattr(instance, key):
                if key == "time_created" and isinstance(value, str):
                    setattr(instance, key, dt.datetime.fromisoformat(value))
                else:
                    setattr(instance, key, value)
        return instance
