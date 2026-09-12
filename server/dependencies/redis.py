from typing import Annotated

from fastapi import Depends
from redis.asyncio import Redis
from starlette.requests import Request


async def get_redis_pool(request: Request):  # noqa: ANN201
    return request.app.state.redis_pool


GetRedisPool = Annotated[Redis, Depends(get_redis_pool)]


async def get_redis_client(request: Request) -> Redis:
    return request.app.state.redis_client


GetRedisClient = Annotated[Redis, Depends(get_redis_client)]
