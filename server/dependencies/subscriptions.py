import logging
from typing import Annotated

from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from dependencies.db import get_db
from dependencies.redis import get_redis_client
from models.redis_manager import RedisManager
from models.subscriptions.subscription_plan import SubscriptionPlan


class SubSchema(BaseModel):
    id: int
    name: str
    description: str
    limit_count: int
    limit_time_period: str
    price: float
    duration: int
    stripe_id: str


class StripePlans(BaseModel):
    free: SubSchema
    premium_yearly: SubSchema
    premium_monthly: SubSchema
    basic_yearly: SubSchema
    basic_monthly: SubSchema
    admin: SubSchema


async def get_subscriptions(
    db: AsyncSession = Depends(get_db),
    r_client=Depends(get_redis_client),
):
    try:
        subscription_plans = await RedisManager.retrieve_cached_json_data(
            r_client,
            "subscription_plans",
        )
        if subscription_plans:
            return StripePlans(**subscription_plans)
    except Exception as e:
        logging.exception(f"Error fetching subscription plans from cache: {e}")

    result = await db.execute(select(SubscriptionPlan))
    subscription_plans = result.scalars().all()
    print(f"{subscription_plans=}")
    plans_dict = {}
    for plan in subscription_plans:
        key = plan.name.lower().replace(" ", "_")
        plans_dict[key] = {
            "id": plan.id,
            "name": plan.name,
            "description": plan.description,
            "limit_count": plan.limit_count,
            "limit_time_period": plan.limit_time_period,
            "price": plan.price,
            "duration": plan.duration,
            "stripe_id": plan.stripe_id,
        }
    stripe_plans = StripePlans(**plans_dict)
    await RedisManager.cache_json_data(
        r_client,
        "subscription_plans",
        stripe_plans.model_dump(),
        360000,
    )
    return stripe_plans


StripeSubPlans = Annotated[StripePlans, Depends(get_subscriptions)]
