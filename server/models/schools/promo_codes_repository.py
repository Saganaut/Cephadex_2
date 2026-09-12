import datetime as dt
import logging
import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.exceptions.user_exceptions import UserExceptions
from models.models_ import PromoCodes, User
from models.schools.data import ROLES, SCHOOL_ROLE_SUB_PLANS
from models.schools.referrals_repository import ReferralsRepository
from models.schools.school_role_repository import SchoolRoleRepository
from models.subscriptions.usage_record_repository import UsageRecordRepository

log = logging.getLogger("App")


class PromoCodesRepository:
    @staticmethod
    async def create_referral_code(db: AsyncSession, user: User, credits: int = 50) -> PromoCodes:
        code = await PromoCodesRepository.create_code(db)
        promo_code = PromoCodes(
            code=code,
            type="referral",
            school_id=None,
            school_role=None,
            expiration_date=None,
            max_uses=0,
            credits=credits,
            promo_type=None,
        )
        db.add(promo_code)
        await ReferralsRepository.create_referrer(db, code, user.id)
        await db.commit()
        return promo_code

    @staticmethod
    async def retrieve_all_non_school_codes(db: AsyncSession) -> list[PromoCodes]:
        result = await db.execute(
            select(PromoCodes).filter(PromoCodes.school_id == None),  # noqa: E711
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_promo_code_by_code(
        db: AsyncSession,
        code: str,
    ) -> PromoCodes:
        result = await db.execute(select(PromoCodes).filter(PromoCodes.code == code))
        return result.scalars().first()

    @staticmethod
    async def increment_use(promo_code: PromoCodes, db: AsyncSession) -> PromoCodes:
        promo_code.uses += 1
        await db.commit()
        return promo_code

    @staticmethod
    async def get_and_create_promo_codes_for_school(
        db: AsyncSession,
        school_id: int,
    ) -> list[PromoCodes]:
        codes = await PromoCodesRepository.retrieve_codes_by_school_id(db, school_id)
        return await PromoCodesRepository.check_all_codes_exist(db, codes, school_id)

    @staticmethod
    async def retrieve_codes_by_school_id(db: AsyncSession, school_id: int) -> list[PromoCodes]:
        int_id = int(school_id)
        result = await db.execute(
            select(PromoCodes)
            .filter(PromoCodes.school_id == int_id)
            .filter(PromoCodes.expired == False),  # noqa: E712
        )
        return list(result.scalars().all())

    @staticmethod
    async def check_all_codes_exist(
        db: AsyncSession,
        codes: list[PromoCodes],
        school_id: int,
    ) -> list[PromoCodes]:
        existing_roles = {code.school_role for code in codes}
        missing_roles = [role for role in ROLES if role not in existing_roles]
        for role in missing_roles:
            new_code = await PromoCodesRepository.make_new_promo_code(db, "school", school_id, role)
            codes.append(new_code)

        return codes

    @staticmethod
    async def make_new_promo_code(
        db: AsyncSession,
        p_type: str,  ## promo, school
        school_id: int | None = None,
        school_role: str | None = None,  ## admin, teacher, student
        max_uses: int = 0,
        credits_to_add: int = 0,
        expiration_date: dt.datetime | None = None,
        promo_details: str | None = None,
    ) -> PromoCodes:
        new_code = await PromoCodesRepository.create_code(db)
        promo_code = PromoCodes(
            code=new_code,
            type=p_type,
            school_id=school_id,
            school_role=school_role,
            expiration_date=expiration_date,
            max_uses=max_uses,
            credits=credits_to_add,
            promo_type=promo_details,
        )
        db.add(promo_code)
        await db.commit()
        return promo_code

    @staticmethod
    async def expire_promo_code(db: AsyncSession, code_id: str) -> PromoCodes:
        promo_code = await PromoCodesRepository.get_promo_code_by_code(db, code_id)
        promo_code.expired = True
        await db.commit()
        return promo_code

    @staticmethod
    async def create_code(db: AsyncSession) -> str:
        code_exists = True
        i = 0
        while code_exists is True:
            if i > 0:
                log.warning("Promo code already exists, generating new code. Iteration: %s", i)
            code = PromoCodesRepository.generate_code()
            code_exists = PromoCodesRepository.check_code_exists(db, code)
            i = +1
        return code

    @staticmethod
    def generate_code() -> str:
        return str(uuid.uuid4().hex)[:6]

    @staticmethod
    async def check_code_exists(db: AsyncSession, code: str) -> bool:
        result = await db.execute(select(PromoCodes).filter(PromoCodes.code == code))
        return result.scalars().first() is not None

    @staticmethod
    async def delete_promo_code(db: AsyncSession, promo_code: str) -> None:
        promo_code = await PromoCodesRepository.get_promo_code_by_code(db, promo_code)
        await db.delete(promo_code)

    @staticmethod
    async def get_promo_code(db: AsyncSession, code: str) -> PromoCodes:
        result = await db.execute(select(PromoCodes).filter(PromoCodes.code == code))
        return result.scalars().first()

    @staticmethod
    async def handle_promo_code(db: AsyncSession, user: User, promo_code: str) -> None:
        promo_code = await PromoCodesRepository.get_promo_code(db, promo_code)
        if promo_code is None:
            log.error("Promo code not found user: %s code: %s", user, promo_code)
            raise UserExceptions.InvalidPromoCodeError
        if promo_code.expired:
            log.error("Expired promo code being used: %s", promo_code)
            raise UserExceptions.ExpiredPromoCodeError
        if promo_code.max_uses != 0 and promo_code.times_used >= promo_code.max_uses:
            log.error("Promo code has been used too many times: %s", promo_code)
            raise UserExceptions.ExpiredPromoCodeError
        if promo_code.type in ["school", "referral"]:
            await PromoCodesRepository.handle_school_promo_code(db, user, promo_code)
        if promo_code.type == "promo":
            await PromoCodesRepository.handle_promo_promo_code(db, user, promo_code)
        # else:
        #     log.error("Promo code type not recognized: %s", promo_code)
        #     raise UserExceptions.InvalidPromoTypeError
        if promo_code.type == "referral":
            await ReferralsRepository.create_referral_entry(db, user, promo_code)
        promo_code.times_used += 1
        await db.commit()

    @staticmethod
    async def handle_school_promo_code(
        db: AsyncSession,
        user: User,
        promo_code: PromoCodes,
    ) -> None:
        await SchoolRoleRepository.create_new_school_role(
            db,
            user.id,
            promo_code.school_id,
            promo_code.school_role,
            SCHOOL_ROLE_SUB_PLANS[promo_code.school_role],
        )
        if user.subscription_plan < SCHOOL_ROLE_SUB_PLANS[promo_code.school_role]:
            user.subscription_plan = SCHOOL_ROLE_SUB_PLANS[promo_code.school_role]

    @staticmethod
    async def user_has_redeemed_promo_code(
        db: AsyncSession,
        user: User,
        promo_code: str,
    ) -> bool:
        return await UsageRecordRepository.user_has_redeemed_pomo_code(db, user, promo_code)

    @staticmethod
    async def handle_promo_promo_code(db: AsyncSession, user: User, promo_code: PromoCodes) -> None:
        if await PromoCodesRepository.user_has_redeemed_promo_code(db, user, promo_code.code):
            raise UserExceptions.AlreadyRedeemedPromoCodeError
        usage_record = await UsageRecordRepository.get_latest_usage_record(db, user)
        if usage_record is None:
            log.error("No usage record found for user %s", user.id)
        new_record = await UsageRecordRepository.update_credit(
            db,
            user,
            usage_record,
            promo_code.credits,
            promo_code.type,
            promo_code.code,
        )
        log.debug("NEW RECORD CREATED %s", new_record.to_dict())
        await db.commit()
