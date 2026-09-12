import logging

from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.future import select

from dependencies.db import GetDb
from dependencies.redis import get_redis_client
from dependencies.user_dependencies import CurrentUser, CurrentUserAndSettings
from models.models_ import (
    UserSettings,
)
from models.redis_manager import RedisManager
from routes.data_classes.response import StandardApiResponse
from routes.data_classes.user_schema import (
    UserSettingsDataResponse,
    UserSettingsSchema,
)

logger = logging.getLogger("App")
settings_router = APIRouter()


# TODO: Need to handle with UserAndSettings is None
@settings_router.get("/settings", response_model=UserSettingsDataResponse, tags=["account"])
async def get_user_settings(user_and_settings: CurrentUserAndSettings):  # noqa: ANN201
    user_settings_dict = user_and_settings[1].to_dict()
    user_settings_data = UserSettingsSchema.model_validate(user_settings_dict)
    return {
        "status": "success",
        "message": "Settings retrieved succesfully",
        "user_settings": user_settings_data,
    }


@settings_router.patch("/settings", response_model=StandardApiResponse, tags=["account"])
async def update_user_settings(  # noqa: ANN201
    settings: UserSettingsSchema,
    user: CurrentUser,
    db: GetDb,
    r_client=Depends(get_redis_client),
):
    result = await db.execute(select(UserSettings).filter_by(user=user.id))
    user_settings = result.scalars().first()
    if user_settings is not None:
        for field, value in settings.model_dump().items():
            if value is not None:
                setattr(user_settings, field, value)
        await db.commit()
        await RedisManager.cache_json_data(
            r_client,
            f"user_settings_{user.id}",
            user_settings.to_dict(),
            12000,
        )

        return {"status": "success", "message": "Settings updated!"}

    return {"status": "success", "message": "Settings not found!"}
