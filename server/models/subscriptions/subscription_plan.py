from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from startup.setup_db import Base


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    description: Mapped[str] = mapped_column(String(50))
    limit_count: Mapped[int] = mapped_column(Integer, nullable=False)
    limit_time_period: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="month",
    )
    price: Mapped[float] = mapped_column(Float, nullable=False)
    duration: Mapped[int] = mapped_column(Integer, default=31)
    users = relationship("User", backref="subscription_plan_id")
    stripe_id: Mapped[str] = mapped_column(String(50), nullable=False)

    def __repr__(self):
        return f"<SubscriptionPlan {self.id}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "limit_count": self.limit_count,
            "limit_time_period": self.limit_time_period,
            "price": self.price,
            "duration": self.duration,
            "stripe_id": self.stripe_id,
        }
