from sqlalchemy.ext.asyncio import AsyncSession

from models.models_ import Referrers
from models.schools.promo_codes import PromoCodes


class ReferralsRepository:
    @staticmethod
    async def create_referrer(db: AsyncSession, code: str, referrer_id: int) -> Referrers:
        referrer = Referrers(
            code=code,
            referrer_id=referrer_id,
        )
        db.add(referrer)
        return referrer

    ##TODO: Implement this method
    @staticmethod
    async def create_referral_entry(db: AsyncSession, promoCode: PromoCodes, user_id: int):
        pass
