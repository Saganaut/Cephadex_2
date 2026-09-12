import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import (
    delete,
)
from sqlalchemy.future import select

from config import Settings
from dependencies.db import GetDb
from dependencies.redis import GetRedisClient
from dependencies.settings import get_settings
from dependencies.user_dependencies import CurrentUser
from models.group.group_manager import GroupManager
from models.models_ import Group, GroupInvite, User, user_group_association
from models.send_email import Emailer
from routes.data_classes.group_schema import (
    AllInvitationsForUserResponse,
    DeleteInvitationsRequest,
    GroupDataResponse,
    GroupInviteResponse,
    GroupSchema,
    InvitedUsersDataResponse,
    InviteRequest,
)
from routes.data_classes.response import (
    LinkAndQrCodeResponse,
    StandardApiResponse,
)

shared_router = APIRouter()

logger = logging.getLogger("App")


## TODO: implement link and QR invitatin for group
@shared_router.get(
    "/link-and-qr/{group_id}",
    response_model=LinkAndQrCodeResponse,
    tags=["group"],
)
@shared_router.get("/all", response_model=GroupDataResponse, tags=["group"])
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


@shared_router.post(
    "/invitation/{group_id}/accept",
    response_model=GroupDataResponse,
    tags=["group"],
)
async def accept_group_invite(group_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    query = await db.execute(
        select(GroupInvite).filter_by(group_id=group_id, user_id=user.id),
    )
    group_invite = query.scalars().first()
    if group_invite is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group invite not found",
        )
    await GroupManager.accept_invitation_to_group(db, user.id, group_id)
    await db.commit()
    group = await GroupManager.retrieve_group(db, group_id)
    group = GroupSchema.model_validate(group.to_dict())
    return {"status": "success", "message": "Group invite accepted", "groups": [group]}


@shared_router.delete(
    "/invitation/{group_id}/decline",
    response_model=StandardApiResponse,
    tags=["group"],
)
async def decline_group_invite(group_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    query = await db.execute(
        select(GroupInvite).filter_by(group_id=group_id, user_id=user.id),
    )
    group_invite = query.scalars().first()
    if group_invite is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group invite not found",
        )
    await db.delete(group_invite)
    await db.commit()
    return {"status": "success", "message": "Group invite declined"}


@shared_router.get(
    "/invitation/all",
    response_model=AllInvitationsForUserResponse,
    tags=["group"],
)
async def get_all_group_invites(db: GetDb, user: CurrentUser):  # noqa: ANN201
    query = await db.execute(select(GroupInvite).filter_by(user_id=user.id))
    group_invites = query.scalars().all()
    group_invites = [group_invite.to_dict() for group_invite in group_invites]
    return {
        "status": "success",
        "message": "Group invites retrieved succesfuly",
        "group_invites": group_invites,
    }


@shared_router.get(
    "/{group_id}/invited-users",
    response_model=InvitedUsersDataResponse,
    tags=["group"],
)
async def get_all_invited_users(group_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201, ARG001
    invited = await GroupManager.get_invitations_for_group(db, group_id)
    return {
        "status": "success",
        "message": "Invited users retrieved",
        "groupInvites": invited,
    }


@shared_router.delete(
    "/{group_id}/invited-users",
    response_model=StandardApiResponse,
    tags=["group"],
)
async def delete_invitations(  # noqa: ANN201
    group_id: int,
    request: DeleteInvitationsRequest,
    db: GetDb,
    user: CurrentUser,
):
    group = await GroupManager.retrieve_group_and_load_users(db, group_id)
    if await GroupManager.check_group_permission(db, user.id, group, "write") is False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You do not have permission to invite users to this group",
        )
    invitations = request.invites_to_delete
    for invite in invitations:
        ## delete all rows with the given user id and group id
        stmt = delete(GroupInvite).where(GroupInvite.id == invite.id)
        await db.execute(stmt)

        await db.commit()
    return {
        "status": "success",
        "message": "Invitations deleted successfully",
    }


## TODO create a page for users to accept invitation
@shared_router.post(
    "/{group_id}/invite/",
    response_model=GroupInviteResponse,
    tags=["group"],
)
async def invite_to_group(  # noqa: ANN201
    group_id: int,
    invite_request: InviteRequest,
    db: GetDb,
    invitor: CurrentUser,
    r_client: GetRedisClient,
    settings: Settings = Depends(get_settings),
):
    group = await GroupManager.retrieve_group_and_load_users(db, group_id)
    if await GroupManager.check_group_permission(db, invitor.id, group, "write") is False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You do not have permission to invite users to this group",
        )
    group = await GroupManager.retrieve_group_and_load_users(db, group_id)
    invited_users = []
    if invite_request.invitees is not None:
        for invitee in invite_request.invitees:
            query = await db.execute(select(User).where(User.id == invitee.id))
            user = query.scalar()
            if user is None:
                continue
            if (await GroupManager.check_if_user_already_invited(db, user.id, group.id)) is True:
                continue
            invitation = await GroupManager.invite_user_to_group(
                r_client,
                db,
                user,
                group,
                invitor,
            )
            constructed_link = (
                f"{settings.app.front_end_url}/group/invitation/{group.id}/email?email={user.email}"
            )
            try:
                Emailer.send_email(
                    settings.email,
                    user.email,
                    user.username,
                    "group_invite",
                    f"{invitor.username} has invited you to join the group {group.name}",
                    sender=invitor.username,
                    link=constructed_link,
                )
            except Exception:
                logger.exception("Failed to send group invite notification email")
            if invitation is not None:
                invited_users.append(invitation.to_dict())
    if invite_request.emails is not None:
        for email in invite_request.emails:
            if (
                await GroupManager.check_if_user_already_invited(
                    db,
                    email.email,
                    group.id,
                    True,
                )
            ) is False:
                invitation = await GroupManager.invite_user_to_group_by_email(
                    db,
                    email.email,
                    group,
                    invitor,
                )
                constructed_link = f"""{settings.app.front_end_url}/group/invitation/
                {group.id}/email?email={email.email}"""
                try:
                    Emailer.send_email(
                        settings.email,
                        email.email,
                        None,
                        "group_invite",
                        f"{invitor.username} has invited you to join the group {group.name}",
                        sender=invitor.username,
                        link=constructed_link,
                    )
                except Exception:
                    logger.exception("Failed to send group invite notification email")
                invited_users.append(invitation.to_dict())
    await db.commit()
    return {
        "status": "success",
        "message": "Users invited successfully",
        "invitedUsers": invited_users,
    }
