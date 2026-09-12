import logging

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.models_ import SchoolRole, User

log = logging.getLogger("App")


class SchoolRoleRepository:
    @staticmethod
    async def get_school_role_by_id(
        db: AsyncSession,
        role_id: int,
    ) -> SchoolRole:
        result = await db.execute(select(SchoolRole).filter(SchoolRole.id == role_id))
        return result.scalars().first()

    @staticmethod
    async def create_new_school_role(
        db: AsyncSession,
        user_id: int,
        school_id: int,
        role: str,
        sub_plan: int,
    ) -> SchoolRole:
        new_role = SchoolRole(
            user_id=user_id,
            school_id=school_id,
            role=role,
            sub_plan=sub_plan,
        )
        db.add(new_role)
        await db.commit()
        return new_role

    @staticmethod
    async def delete_school_role(
        db: AsyncSession,
        role_id: int,
    ) -> None:
        role = await SchoolRoleRepository.get_school_role_by_id(db, role_id)
        role.deleted = True
        await db.commit()

    @staticmethod
    async def get_joined_role_and_user_by_school(
        db: AsyncSession,
        school_id: int,
    ) -> list[tuple[SchoolRole, User]]:
        result = await db.execute(
            select(User, SchoolRole)
            .join(User, SchoolRole.user_id == User.id)
            .filter(SchoolRole.school_id == school_id),
        )
        return list(result.scalars().all())
