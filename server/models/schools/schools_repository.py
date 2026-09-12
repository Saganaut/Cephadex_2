from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.models_ import Schools


class SchoolsRepository:
    @staticmethod
    async def get_school_by_id(
        db: AsyncSession,
        school_id: int,
    ) -> Schools:
        result = await db.execute(select(Schools).filter(Schools.id == school_id))
        return result.scalars().first()

    @staticmethod
    async def retrieve_all_schools(
        db: AsyncSession,
    ) -> list[Schools]:
        result = await db.execute(select(Schools))
        return list(result.scalars().all())

    @staticmethod
    async def create_new_school(
        db: AsyncSession,
        name: str,
        main_contact: str,
        email: str,
        phone: str,
        address: str,
        city: str,
        country: str,
        postal_code: str,
        website: str,
        stripe_id: str,
    ) -> Schools:
        new_school = Schools(
            name=name,
            main_contact=main_contact,
            email=email,
            phone=phone,
            address=address,
            city=city,
            country=country,
            postal_code=postal_code,
            website=website,
            stripe_id=stripe_id,
        )
        db.add(new_school)
        await db.commit()
        return new_school

    @staticmethod
    async def update_school_info(
        db: AsyncSession,
        school_id: int,
        updates: dict[str, Any],
    ) -> Schools:
        school = await SchoolsRepository.get_school_by_id(db, school_id)
        for field, value in updates.items():
            if value is not None and hasattr(school, field):
                setattr(school, field, value)
        await db.commit()
        return school


    
