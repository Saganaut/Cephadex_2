import logging

from fastapi import APIRouter

from dependencies.db import GetDb
from dependencies.redis import GetRedisClient
from dependencies.user_dependencies import CurrentUser
from models.user.notification_manager import Notification_Manager
from routes.data_classes.user_schema import (
    NotificationsResponse,
    NotificationsSchema,
)

logger = logging.getLogger("App")

notifications_router = APIRouter()


@notifications_router.get(
    "/notifications",
    response_model=NotificationsResponse,
    tags=["notifications"],
)
async def get_notifications(user: CurrentUser, db: GetDb):  # noqa: ANN201
    notifications = await Notification_Manager.get_notifications(db, user)

    return {
        "status": "success",
        "message": "Notifications retrieved",
        "notifications": notifications,
    }


@notifications_router.patch(
    "/notifications",
    response_model=NotificationsResponse,
    tags=["notifications"],
)
async def update_notifications(notification: NotificationsSchema, user: CurrentUser, db: GetDb):  # noqa: ANN201
    await Notification_Manager.mark_notifications_as_read(db, user, [notification.id])
    await db.commit()
    return {
        "status": "success",
        "message": "Notification updated",
        "notifications": [],
    }


@notifications_router.delete(
    "/notifications",
    response_model=NotificationsResponse,
    tags=["notifications"],
)
async def delete_notifications(notification: NotificationsSchema, user: CurrentUser, db: GetDb):  # noqa: ANN201
    await Notification_Manager.delete_notifications(db, user, [notification.id])
    await db.commit()
    return {
        "status": "success",
        "message": "Notification deleted",
        "notifications": [],
    }


@notifications_router.get(
    "/notifications/check-new",
    response_model=NotificationsResponse,
    tags=["notifications"],
)
async def check_new_notifications(user: CurrentUser, db: GetDb, r_client: GetRedisClient):  # noqa: ANN201
    key = f"newNotifs:{user.id}"
    notifications = await r_client.lrange(key, 0, -1)  ## type: ignore r_client is async redis,
    await r_client.delete(key)
    new_notifications = []
    if notifications:
        for id in notifications:  # noqa: A001
            notification = await Notification_Manager.get_notification_by_id(db, id)
            new_notifications.append(notification.to_dict())

    return {
        "status": "success",
        "message": "Notifications retrieved",
        "notifications": new_notifications,
    }
