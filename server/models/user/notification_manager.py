import logging

from sqlalchemy import and_, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.models_ import (
    Notifications,
    User,
)

logger = logging.getLogger("App")


class Notification_Manager:
    @staticmethod
    async def get_notifications(db: AsyncSession, user: User) -> list[dict]:
        stmt = select(Notifications).where(Notifications.user_id == user.id)
        result = await db.execute(stmt)
        notifications = result.scalars().all()
        list_notifications = []
        for notification in notifications:
            list_notifications.append(notification.to_dict())
        return list_notifications

    @staticmethod
    async def mark_notifications_as_read(
        db: AsyncSession,
        user: User,
        notification_ids: list[int],
    ) -> None:
        stmt = (
            update(Notifications)
            .where(
                and_(
                    Notifications.user_id == user.id,
                    Notifications.id.in_(notification_ids),
                ),
            )
            .values(read=True)
        )
        await db.execute(stmt)

    @staticmethod
    async def delete_notifications(
        db: AsyncSession,
        user: User,
        notification_ids: list[int],
    ) -> None:
        stmt = delete(Notifications).where(
            and_(
                Notifications.user_id == user.id,
                Notifications.id.in_(notification_ids),
            ),
        )
        await db.execute(stmt)
        await db.commit()

    @staticmethod
    async def get_notification_by_id(db: AsyncSession, notification_id: int) -> Notifications:
        stmt = select(Notifications).where(Notifications.id == int(notification_id))
        result = await db.execute(stmt)
        return result.scalar_one()

    @staticmethod
    async def create_notification(
        r_client,
        db: AsyncSession,
        user: User,
        notification_type,
        ref_table,
        ref_id: int,
        message: str,
        share_id: str,
    ) -> None:
        new_notification = Notifications(
            user_id=user.id,
            notification_type=notification_type,
            ref_table=ref_table,
            ref_id=ref_id,
            message=message,
            share_id=share_id,
        )
        db.add(new_notification)
        await db.flush()
        key = f"newNotifs:{user.id}"
        await r_client.lpush(key, new_notification.id)
