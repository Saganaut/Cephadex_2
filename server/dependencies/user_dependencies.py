import logging
from typing import Annotated, Union

from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
from redis.asyncio import Redis as RedisAsync
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from dependencies.db import get_db
from dependencies.redis import get_redis_client
from dependencies.settings import get_settings
from models.models_ import User, UserSettings
from models.redis_manager import RedisManager

log = logging.getLogger("App")

SUBSCRIPTION_PLAN_ADMIN = 7

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

settings = get_settings()


async def parse_jwt_data(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access token missing",
        )
    token = token.split(" ")[1] if token.startswith("Bearer ") else token
    try:
        payload = jwt.decode(
            token,
            settings.auth.secret_key,
            algorithms=[settings.auth.algorithm],
        )  # type: ignore
        user_id: str = payload.get("sub")  # type: ignore
        if user_id is None:
            return {"user_id": None}
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from e
    return {"user_id": user_id}


async def get_current_user(
    payload: dict = Depends(parse_jwt_data),
    db: AsyncSession = Depends(get_db),
    r_client: RedisAsync = Depends(get_redis_client),
) -> User:
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    try:
        user_data = await RedisManager.retrieve_cached_json_data(
            r_client,
            f"user_{user_id}",
        )
        if user_data:
            return User(**user_data)
    except Exception:
        log.exception("Error retrieving user data from cache")
    user = await get_user_by_id(user_id, db)
    if user is None:
        log.info("User not found, could not validate credentials")
        raise credentials_exception
    try:
        if user.guest is False or user.guest is None:
            await RedisManager.cache_json_data(
                r_client,
                f"user_{user_id}",
                user.to_dict(),
                180,
            )
    except Exception:
        log.exception("Error caching user data")
    return user


async def get_current_user_settings(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    r_client: RedisAsync = Depends(get_redis_client),
) -> tuple[User, UserSettings]:
    try:
        user_settings_data = await RedisManager.retrieve_cached_json_data(
            r_client,
            f"user_settings_{user.id}",
        )
        if user_settings_data:
            return user, UserSettings(**user_settings_data)
    except Exception:
        log.exception("Error retrieving user settings from cache")

    user_settings = await get_user_settings_by_user_id(user.id, db)
    try:
        await RedisManager.cache_json_data(
            r_client,
            f"user_settings_{user.id}",
            user_settings.to_dict(),
            12000,
        )
    except Exception:
        log.exception("Error caching user settings")
    return user, user_settings


async def get_user_by_id(user_id: str, db: AsyncSession = Depends(get_db)) -> User:
    int_id = int(user_id)
    result = await db.execute(select(User).filter_by(id=int_id))
    return result.scalars().first()


async def get_user_settings_by_user_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> UserSettings:
    result = await db.execute(select(UserSettings).filter_by(user=user_id))
    return result.scalars().first()


## THE following dependencies are alternatives to the above, if a user is NOT logged in they return
# "guest" instead of raising an error
async def parse_jwt_data_or_not(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        return {"user_id": None}
    token = token.split(" ")[1] if token.startswith("Bearer ") else token
    try:
        payload = jwt.decode(
            token,
            settings.auth.secret_key,
            algorithms=[settings.auth.algorithm],
        )  # type: ignore
        user_id: str = payload.get("sub")  # type: ignore
        if user_id is None:
            return {"user_id": None}
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        ) from e
    return {"user_id": user_id}


def check_user_is_admin(user: User) -> None:
    if user.subscription_plan < SUBSCRIPTION_PLAN_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access, only admins allowed",
        )


async def get_current_admin_user(user: User = Depends(get_current_user)):
    check_user_is_admin(user)
    return user


async def get_current_user_or_guest(
    payload: dict = Depends(parse_jwt_data_or_not),
    db: AsyncSession = Depends(get_db),
    r_client: RedisAsync = Depends(get_redis_client),
) -> Union[User, str]:
    user_id = payload.get("user_id")

    if user_id is None:
        return "guest"
    try:
        user_data = await RedisManager.retrieve_cached_json_data(
            r_client,
            f"user_{user_id}",
        )
        if user_data:
            return User(**user_data)
    except Exception:
        log.exception("Error retrieving user data from cache")
    try:
        user = await get_user_by_id(user_id, db)
        if user is None:
            raise credentials_exception
    except JWTError as e:
        raise credentials_exception from e
    try:
        if user.guest is False:
            await RedisManager.cache_json_data(
                r_client,
                f"user_{user_id}",
                user.to_dict(),
                120,
            )
    except Exception:
        log.exception("Error caching user data")
    return user


CurrentUserAndSettings = Annotated[
    tuple[User, UserSettings],
    Depends(get_current_user_settings),
]


CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentUserOrGuest = Annotated[User, Depends(get_current_user_or_guest)]
AdminUser = Annotated[User, Depends(get_current_admin_user)]
