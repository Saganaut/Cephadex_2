import datetime as dt
import logging

from fastapi import (
    APIRouter,
)

from dependencies.db import GetDb
from dependencies.user_dependencies import CurrentUser
from models.models_ import (
    Subscriber,
)
from models.user.user_manager import UserManager
from routes.data_classes.response import StandardApiResponse
from routes.data_classes.user_schema import NewsletterRequest

logger = logging.getLogger("App")

newsletter_router = APIRouter()


@newsletter_router.post(
    "/newsletter",
    response_model=StandardApiResponse,
    tags=["newsletter"],
)
async def subscribe(db: GetDb, request: NewsletterRequest) -> dict:
    logger.info("entered newsletter post route")
    email = request.email
    existing_subscriber = await UserManager.check_subscriber_exists(db, email)
    if existing_subscriber:
        return {"status": "failure", "message": "You are already subscribed!"}

    subscriber = Subscriber(email=email, time_created=dt.datetime.now())
    db.add(subscriber)
    await db.commit()
    return {"status": "success", "message": "Subscription successful!"}


@newsletter_router.delete(
    "/newsletter",
    response_model=StandardApiResponse,
    tags=["newsletter"],
)
async def unsubscribe(db: GetDb, request: NewsletterRequest):  # noqa: ANN201
    email = request.email
    existing_subscriber = await UserManager.check_subscriber_exists(db, email)
    if existing_subscriber is not None:
        await db.delete(existing_subscriber)
        await db.commit()
        return {"status": "success", "message": "Unsubscribed!"}

    return {"status": "failure", "message": "You are not subscribed!"}


@newsletter_router.get(
    "/newsletter",
    response_model=StandardApiResponse,
    tags=["newsletter"],
)
async def check_subscription_for_user(db: GetDb, user: CurrentUser):  # noqa: ANN201
    email = user.email
    existing_subscriber = await UserManager.check_subscriber_exists(db, email)
    if existing_subscriber is not None:
        return {"status": "success", "message": "Subscribed"}
    return {"status": "success", "message": "Not subscribed"}
