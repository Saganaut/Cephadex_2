import logging

from fastapi import APIRouter, HTTPException

from dependencies.db import GetDb
from dependencies.user_dependencies import CurrentUser
from models.group.group_manager import GroupManager
from routes.data_classes.group_schema import PermissionChangeRequest
from routes.data_classes.response import StandardApiResponse

logger = logging.getLogger("App")


permissions_router = APIRouter()


@permissions_router.patch(
    "/{group_id}/permissions",
    response_model=StandardApiResponse,
    tags=["group"],
)
async def update_member_permissions(  # noqa: ANN201
    db: GetDb,
    user: CurrentUser,
    group_id: int,
    request: PermissionChangeRequest,
):
    """Permissions values include "read" and "write",
    roles include "member", "admin", and "creator"
    """
    group = await GroupManager.retrieve_group_and_load_users(db, group_id)
    await GroupManager.check_group_permission(db, user.id, group, "write")
    for user_change in request.permissionsToChange:
        user_id = user_change.id
        await GroupManager.update_member_permissions(
            db,
            user_id,
            group,
            user_change.permissions,
            user_change.role,
        )
    await db.commit()
    return {"status": "success", "message": "Member permissions updated successfully"}


## TODO: make it so that the creator can't remove themselves?
@permissions_router.delete(
    "/{group_id}/member/{user_id}",
    response_model=StandardApiResponse,
    tags=["group"],
)
async def remove_user_group(group_id: int, user_id: int, db: GetDb, user: CurrentUser):  # noqa: ANN201
    group = await GroupManager.retrieve_group_and_load_users(db, group_id)
    await GroupManager.check_group_permission(db, user.id, group, "write")
    # TODO: Ensure this is an async function
    deleted = await GroupManager.remove_user_from_group(db, user_id, group_id)
    await db.commit()
    if deleted is True:
        return {"message": "User removed successfully", "status": "success"}

    raise HTTPException(status_code=404, detail="User or group not found")
