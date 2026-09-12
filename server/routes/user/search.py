from typing import Optional

from fastapi import APIRouter, Depends

from config import Settings
from dependencies.db import GetDb
from dependencies.settings import get_settings
from dependencies.user_dependencies import CurrentUser
from models.user.user_manager import UserManager
from routes.data_classes.response import StandardApiResponse

search_router = APIRouter()


class UserLookUpResponse(StandardApiResponse):
    users: Optional[list] = None


@search_router.get("/search/{user_info}", tags=["user"])
async def search_users(  # noqa: ANN201
    user_info: str,
    db: GetDb,
    user: CurrentUser,  # noqa: ARG001
    settings: Settings = Depends(get_settings),
):
    ## check if user info is an email
    users = await UserManager.get_users_by_query(
        db,
        user_info,
        settings.app.look_up_query_limit,
    )
    return {"status": "success", "message": "Users found", "users": users}
