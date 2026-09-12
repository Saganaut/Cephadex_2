import json
import logging
from typing import Annotated, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select

from dependencies.db import GetDb
from dependencies.posthog import GetPostHog
from dependencies.settings import AppSettings
from dependencies.user_dependencies import CurrentUser
from models.group.group_manager import GroupManager
from models.models_ import Group, user_group_association
from models.user.user_manager import UserManager
from routes.data_classes.group_schema import (
    CreateGroupDataRequest,
    GroupDataResponse,
    GroupFullDataResponse,
    GroupSchema,
    GroupSchemaWithPermissions,
)
from routes.data_classes.response import StandardApiResponse

group_main_router = APIRouter()
log = logging.getLogger("App")


@group_main_router.get("/all", response_model=GroupDataResponse, tags=["group"])
async def get_all_groups_for_user(db: GetDb, user: CurrentUser):  # noqa: ANN201
    """Return all groups that the user is a member of"""
    query = await db.execute(
        select(Group).join(user_group_association).filter_by(user_id=user.id),
    )
    groups = query.scalars().all()
    groups_data = [GroupSchema.model_validate(group.to_dict()) for group in groups]
    return {
        "status": "success",
        "message": "groups retrieved for user",
        "groups": groups_data,
    }


@group_main_router.post("/create", response_model=GroupDataResponse, tags=["group"])
async def create_group(  # noqa: ANN201
    request: CreateGroupDataRequest,
    db: GetDb,
    user: CurrentUser,
    posthog: GetPostHog,
):
    """Create a group with the given name and description"""
    kwargs = {
        "name": request.name,
        "description": request.description,
        "group_type": request.group_type,
        "is_private": request.private,
        "creator_id": user.id,
    }
    user = await UserManager.get_user_by_id(db, user.id)
    new_group = await GroupManager.create_group(db, **kwargs)
    await db.flush()
    new_group = await GroupManager.retrieve_group_and_load_users(db, new_group.id)
    new_group.users.append(user)

    await GroupManager.update_member_permissions(
        db,
        user.id,
        new_group,
        "write",
        role="creator",
    )
    await db.commit()

    group_data = GroupSchema.model_validate(new_group.to_dict())
    posthog.capture(
        user.id,
        "group_created",
        properties={"group_id": new_group.id},
    )
    return {
        "status": "success",
        "message": "Group succesfully created",
        "groups": [group_data],
    }


@group_main_router.patch(
    "/{group_id}",
    response_model=GroupDataResponse,
    tags=["group"],
)
async def update_group(  # noqa: ANN201
    group_id: int,
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
    request: Annotated[str, Form()],
    file: Optional[UploadFile] = File(None),
):
    request_dict = json.loads(request)
    """Update a group with the given name and description"""
    group = await GroupManager.retrieve_group(db, group_id)
    if group.creator_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not the creator of this group",
        )
    for field, value in request_dict.items():
        if value is not None:
            setattr(group, field, value)
    if file:
        group = await GroupManager.upload_group_img(group, file, settings.aws)
    await db.commit()
    group_data = GroupSchema.model_validate(group.to_dict())
    return {
        "status": "success",
        "message": "Group succesfully updated",
        "groups": [group_data],
    }


@group_main_router.delete(
    "/{group_id}/picture",
    response_model=StandardApiResponse,
    tags=["group"],
)
async def delete_group_picture(  # noqa: ANN201
    group_id: int,
    db: GetDb,
    user: CurrentUser,
    settings: AppSettings,
):
    """Delete the group picture"""
    group = await GroupManager.retrieve_group(db, group_id)
    if group.creator_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not the creator of this group",
        )
    group = await GroupManager.delete_group_img(group, settings.aws)
    await db.commit()
    return {"status": "success", "message": "Group picture deleted"}


@group_main_router.delete(
    "/{group_id}",
    response_model=StandardApiResponse,
    tags=["group"],
)
async def delete_group(db: GetDb, user: CurrentUser, group_id: int):  # noqa: ANN201
    """Delete a group if the user is the creator"""
    group = await GroupManager.retrieve_group(db, group_id)
    if group.creator_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not the creator of this group",
        )
    await db.delete(group)
    await db.commit()
    return {"status": "success", "message": "Group deleted"}


@group_main_router.get(
    "/{group_id}",
    response_model=GroupFullDataResponse,
    tags=["group"],
)
async def get_group(db: GetDb, user: CurrentUser, group_id: int):  # noqa: ANN201
    try:
        (
            group,
            permissions,
            role,
        ) = await GroupManager.retrieve_group_and_load_decks_and_user_permission(
            db,
            group_id,
            user.id,
        )
        await GroupManager.check_group_permission(db, user.id, group, "read")
        group_dict = group.to_dict()
        group_dict["permissions"] = permissions
        group_dict["role"] = role
        group = GroupSchemaWithPermissions.model_validate(group_dict)
        group_members = await GroupManager.get_group_members(db, group_id)

        invitations = await GroupManager.get_invitations_for_group(db, group_id)
        decks = await GroupManager.get_decks_for_group(db, group_id)
        group_data = {}
        group_data["group"] = group
        group_data["members"] = group_members
        group_data["invites"] = invitations
        group_data["decks"] = decks
        return {
            "status": "success",
            "message": "group retrieved",
            "group": [group_data],
        }
    except Exception:
        log.exception("error in get group")
