from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from dependencies.settings import get_settings
from models.models_ import UsageRecord, User

settings = get_settings()


class UsageRecordRepository:
    @staticmethod
    async def update_credit(
        db: AsyncSession,
        user: User,
        prev_record: UsageRecord,
        credit_to_add: int,
        operation_type: str,
        details: str | None,
    ) -> UsageRecord:
        usage_record = await UsageRecordRepository.add_new_usage_record(
            db,
            user,
            operation_type,
            credit_to_add,
            prev_record.remaining_count + credit_to_add,
            prev_record.limit_count,
            operation_details=details,
        )
        db.add(usage_record)
        await db.flush()
        user.remaining_credit = round(usage_record.remaining_count / settings.token.tokens_per_page)
        return usage_record

    @staticmethod
    async def remove_credit(
        db: AsyncSession,
        user: User,
        prev_record: UsageRecord,
        credit_to_remove: int,
        operation_type: str,
        details: str | None,
    ) -> UsageRecord:
        usage_record = await UsageRecordRepository.add_new_usage_record(
            db,
            user,
            operation_type,
            credit_to_remove,
            prev_record.remaining_count - credit_to_remove,
            prev_record.limit_count,
            operation_details=details,
        )
        await db.flush()
        user.remaining_credit = round(usage_record.remaining_count / settings.token.tokens_per_page)
        return usage_record

    @staticmethod
    async def get_latest_usage_record(db: AsyncSession, user: User) -> UsageRecord:
        result = await db.execute(
            select(UsageRecord)
            .filter(UsageRecord.user_id == user.id)
            .order_by(UsageRecord.date.desc())
            .limit(1),
        )
        return result.scalars().first()

    @staticmethod
    async def add_new_usage_record(
        db: AsyncSession,
        user: User,
        operation_type: str,
        operation_count: int,
        remaining_count: int,
        limit_count: int,
        operation_details: str | None = None,
        source_ip: str | None = None,
        time_period: str = "month",
    ) -> UsageRecord:
        usage_record = UsageRecord(
            user_id=user.id,
            operation_type=operation_type,
            operation_count=operation_count,
            remaining_count=remaining_count,
            limit_count=limit_count,
            operation_details=operation_details,
            source_ip=source_ip,
            time_period=time_period,
        )
        db.add(usage_record)
        return usage_record

    @staticmethod
    async def user_has_redeemed_pomo_code(
        db: AsyncSession,
        user: User,
        promo_code: str,
    ) -> bool:
        result = await db.execute(
            select(UsageRecord).filter(
                UsageRecord.user_id == user.id,
                UsageRecord.operation_details == promo_code,
            ),
        )
        return result.scalars().first() is not None
