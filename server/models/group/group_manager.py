import logging
import os
import shutil
import tempfile
from pathlib import Path
from typing import Optional, Union

from fastapi import HTTPException, UploadFile
from redis.asyncio import Redis as RedisAsync
from sqlalchemy import (
    delete,
    update,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from config import AWSSettings
from models.decks.deck.deck_manager import DeckManager
from models.helpers.helpers import Helpers
from models.models_ import (
    Deck,
    Group,
    GroupInvite,
    NotificationType,
    RefTableType,
    User,
)
from models.relational_tables.association_tables import user_group_association
from models.storage.s3 import StorageManager
from models.user.notification_manager import Notification_Manager
from routes.data_classes.deck_schema import DeckSchema
from routes.data_classes.group_schema import (
    GroupInviteSchema,
    GroupMemberSchema,
)

logger = logging.getLogger("App")


class GroupManager:
    def __init__(self):
        pass

    @staticmethod
    async def retrieve_group_from_deck_id_and_load_members(
        db: AsyncSession,
        deck_id: int,
    ) -> Group:
        result = await db.execute(
            select(Group)
            .join(Deck, Group.id == Deck.group_id)
            .where(Deck.id == deck_id)
            .options(selectinload(Group.users)),
        )
        group = result.scalars().first()
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        return group

    @staticmethod
    async def retrieve_group(db: AsyncSession, group_id: int) -> Group:
        result = await db.execute(select(Group).where(Group.id == group_id))
        group = result.scalars().first()
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        return group

    @staticmethod
    async def retrieve_group_and_load_decks(db: AsyncSession, group_id: int) -> Group:
        result = await db.execute(
            select(Group).where(Group.id == group_id).options(selectinload(Group.decks)),
        )
        group = result.scalars().first()
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        return group

    @staticmethod
    async def retrieve_group_and_load_users(db: AsyncSession, group_id: int) -> Group:
        result = await db.execute(
            select(Group).where(Group.id == group_id).options(selectinload(Group.users)),
        )
        group = result.scalars().first()
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        return group

    @staticmethod
    async def get_group(db: AsyncSession, group_id: int) -> Group:
        """Return a group from the database"""
        stmt = select(Group).where(Group.id == group_id)
        result = await db.execute(stmt)
        return result.scalars().first()

    @staticmethod
    async def delete_group(db: AsyncSession, group_id: int) -> bool:
        """Delete a group from the database"""
        stmt = delete(Group).where(Group.id == group_id)
        await db.execute(stmt)
        return True

    @staticmethod
    async def upload_group_img(
        group: Group,
        group_img: UploadFile,
        aws_settings: AWSSettings,
    ) -> Group:
        if group_img.filename and StorageManager.allowed_img_file(group_img.filename):
            filename = f"{group.id}_{Helpers.secure_filename(group_img.filename)}"
            temp_path = os.path.join(tempfile.gettempdir(), filename)  # noqa: PTH118

            with Path(temp_path).open("wb") as buffer:  # noqa: ASYNC230
                # with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(group_img.file, buffer)

            StorageManager.upload_to_s3("group_images", temp_path, filename)
            os.remove(temp_path)  # noqa: PTH107
            if group.img is not None:
                try:
                    StorageManager.delete_s3_object_in_folder(
                        "group_images",
                        group.img,
                    )
                except Exception:
                    logger.exception("Error deleting group image")
            s3_pic_bucket = f"{aws_settings.s3_uri}/group_images/"
            group.img = f"{s3_pic_bucket}{filename}"
            return group
        raise HTTPException(
            status_code=400,
            detail="Invalid file type for group image",
        )

    @staticmethod
    async def delete_group_img(group: Group, aws_settings: AWSSettings) -> Group:  # noqa: ARG004
        if group.img is not None:
            try:
                StorageManager.delete_s3_object_in_folder("group_images", group.img)
            except Exception:
                logger.exception("Error deleting group image ")
            group.img = None
            return group
        raise HTTPException(
            status_code=400,
            detail="Group does not have an image to delete",
        )

    @staticmethod
    async def create_group(db: AsyncSession, **kwargs: dict) -> Group:
        """Creates a group in the database"""
        group = Group(**kwargs)
        db.add(group)
        return group

    # Check permissions
    @staticmethod
    async def check_group_permission(
        db: AsyncSession,
        user_id: int,
        group: Group,
        permission: str = "read",
    ) -> bool:
        await db.refresh(group)
        """returns true if user has permission to read
        (or write if it is used as an argument) group"""
        stmt = select(user_group_association.c.permissions).where(
            user_group_association.c.user_id == user_id,
            user_group_association.c.group_id == group.id,
        )
        result = await db.execute(stmt)
        users_permissions = result.scalars().all()
        if "write" in users_permissions:
            return True

        return permission in users_permissions

    @staticmethod
    async def retrieve_group_and_load_decks_and_user_permission(
        db: AsyncSession,
        group_id: int,
        user_id: int,
    ) -> tuple[Group, str, str]:
        group = await GroupManager.retrieve_group_and_load_decks(db, group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        await db.refresh(group)
        stmt = select(user_group_association).where(
            user_group_association.c.user_id == user_id,
            user_group_association.c.group_id == group.id,
        )
        result = await db.execute(stmt)
        users_permissions = result.first()
        if users_permissions is None:
            raise HTTPException(
                status_code=404,
                detail="Unable to retrieve permissions for group",
            )
        permissions = users_permissions.permissions
        role = users_permissions.role
        return group, permissions, role

    @staticmethod
    async def get_group_members(
        db: AsyncSession,
        group_id: int,
    ) -> list[GroupMemberSchema]:
        query = (
            select(
                User.id,
                User.username,
                User.email,
                User.first_name,
                User.last_name,
                User.account_type,
                User.account_status,
                User.pic,
                User.contacted_email,
                User.subscription_plan,
                User.guest,
                User.active,
                user_group_association.c.role.label("group_role"),
                user_group_association.c.permissions,
            )
            .join(user_group_association, User.id == user_group_association.c.user_id)
            .where(user_group_association.c.group_id == group_id)
        )
        result = await db.execute(query)
        rows = result.all()
        return [GroupMemberSchema.model_validate(row._asdict()) for row in rows]

    @staticmethod
    async def update_member_permissions(
        db: AsyncSession,
        user_id: int,
        group: Group,
        permissions: str = "read",
        role: str = "member",
    ) -> bool:
        await db.refresh(group)
        stmt = (
            update(user_group_association)
            .where(
                user_group_association.c.user_id == user_id,
                user_group_association.c.group_id == group.id,
            )
            .values(permissions=permissions, role=role)
        )
        await db.execute(stmt)
        return True

    @staticmethod
    async def remove_user_from_group(
        db: AsyncSession,
        user_id: int,
        group_id: int,
    ) -> bool:
        delete_stmt = delete(user_group_association).where(
            user_group_association.c.user_id == user_id,
            user_group_association.c.group_id == group_id,
        )
        await db.execute(delete_stmt)
        return True

    @staticmethod
    async def add_user_to_group(db: AsyncSession, user_id: int, group_id: int) -> bool:
        stmt = user_group_association.insert().values(
            user_id=user_id,
            group_id=group_id,
            permissions="read",
            role="member",
        )
        await db.execute(stmt)
        return True

    @staticmethod
    async def accept_invitation_to_group(
        db: AsyncSession,
        user_id: int,
        group_id: int,
    ) -> bool:
        """Accepts an invitation to a group"""
        await GroupManager.delete_invitation_to_group(db, user_id, group_id)
        await GroupManager.add_user_to_group(db, user_id, group_id)
        return True

    @staticmethod
    async def delete_invitation_to_group(
        db: AsyncSession,
        user_id: int,
        group_id: int,
    ) -> bool:
        stmt = delete(GroupInvite).where(
            GroupInvite.user_id == user_id,
            GroupInvite.group_id == group_id,
        )
        await db.execute(stmt)
        return True

    @staticmethod
    async def get_decks_for_group(db: AsyncSession, group_id: int) -> list[DeckSchema]:
        stmt = select(Deck).where(Deck.group_id == group_id)
        result = await db.execute(stmt)
        results = result.scalars().unique().all()
        return [DeckSchema.model_validate(deck.to_dict()) for deck in results]

    @staticmethod
    async def add_deck_to_group(db: AsyncSession, deck_id: int, group_id: int) -> Deck:
        kwargs = {"group_id": group_id, "copied": True, "copy_source": deck_id}
        deck = await DeckManager.retrieve_deck_and_load_cards(db, deck_id)
        new_deck = await DeckManager.copy_deck(db, deck, **kwargs)
        await db.flush()
        new_deck = await DeckManager.retrieve_deck_and_load_cards(db, new_deck.id)
        if new_deck is None:
            raise HTTPException(
                status_code=404,
                detail="Error in adding deck to group, investigate",
            )
        new_cards = await DeckManager.copy_deck_cards(deck, new_deck)
        db.add_all(new_cards)
        new_deck.group_id = group_id
        return new_deck

    @staticmethod
    async def delete_deck_from_group(
        db: AsyncSession,
        deck_id: int,
        group_id: int,  # noqa: ARG004
    ) -> bool:
        stmt = delete(Deck).where(Deck.id == deck_id)
        await db.execute(stmt)
        return True

    @staticmethod
    async def invite_user_to_group(
        r_client: RedisAsync,
        db: AsyncSession,
        user: User,
        group: Group,
        invitor: User,
    ) -> Union[GroupInvite, None]:
        if user in group.users:
            return None
        new_invite = GroupInvite(
            group_name=group.name,
            invited_by_email=invitor.email,
            invited_by_id=invitor.id,
            user_id=user.id,
            username=user.username,
            group_id=group.id,
            invited_by_username=invitor.username,
            email=user.email,
        )
        db.add(new_invite)
        await db.flush()
        await Notification_Manager.create_notification(
            r_client,
            db,
            user,
            NotificationType.group_invite,
            RefTableType.group_invite,
            group.id,
            "You have been invited to a group",
            share_id=str(new_invite.id),
        )
        return new_invite

    @staticmethod
    async def check_if_user_already_invited(
        db: AsyncSession,
        user_id_or_email: Union[int, str],
        group_id: int,
        by_email: Optional[bool] = False,
    ) -> bool:
        if by_email is False:
            query = await db.execute(
                select(GroupInvite).where(
                    GroupInvite.user_id == user_id_or_email,
                    GroupInvite.group_id == group_id,
                ),
            )
        else:
            query = await db.execute(
                select(GroupInvite).where(
                    GroupInvite.email == user_id_or_email,
                    GroupInvite.group_id == group_id,
                ),
            )

        already_invited = query.scalar()
        return already_invited is not None

    @staticmethod
    async def invite_user_to_group_by_email(
        db: AsyncSession,
        email: str,
        group: Group,
        invitor: User,
    ) -> GroupInvite:
        logger.info("entered invite user to group")
        new_invite = GroupInvite(
            group_name=group.name,
            invited_by_email=invitor.email,
            invited_by_id=invitor.id,
            user_id=None,
            username=None,
            group_id=group.id,
            invited_by_username=invitor.username,
            email=email,
        )
        db.add(new_invite)
        await db.flush()
        return new_invite

    @staticmethod
    async def get_invitations_for_group(
        db: AsyncSession,
        group_id: int,
    ) -> list[GroupInviteSchema]:
        invited_users_query = select(GroupInvite).where(
            GroupInvite.group_id == group_id,
        )
        result = await db.execute(invited_users_query)
        invited_users = result.scalars().all()
        invited_list = []
        for user in invited_users:
            invite_data_dict = user.to_dict()

            invited_list.append(GroupInviteSchema.model_validate(invite_data_dict))
        return invited_list

    @staticmethod
    async def remove_deck_from_group(db: AsyncSession, deck_id: int) -> None:
        stmt = delete(Deck).where(Deck.id == deck_id)
        await db.execute(stmt)
