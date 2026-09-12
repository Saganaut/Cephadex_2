import redis as sync_redis
import redis.asyncio as aioredis
from fastapi import Request
from redis.asyncio import Redis

from dependencies.settings import get_settings
from models.helpers.log_decorators import log_decorator

settings = get_settings()


async def setup_redis_client() -> Redis:
    redis_client = Redis(
        host=settings.redis.host,
        port=settings.redis.port,
        password=settings.redis.password,
        decode_responses=True,
    )

    await redis_client.ping()
    return redis_client


def setup_sync_redis_client() -> sync_redis.Redis:
    return sync_redis.Redis(
        host=settings.redis.host,
        port=settings.redis.port,
        password=settings.redis.password,
        decode_responses=True,
    )


@log_decorator
def setup_redis_pool() -> aioredis.ConnectionPool:
    return aioredis.ConnectionPool(
        host=settings.redis.host,
        port=settings.redis.port,
        password=settings.redis.password,
        max_connections=settings.redis.max_connections,
        socket_connect_timeout=settings.redis.socket_connection_timout,
        socket_timeout=settings.redis.socket_timeout,
    )


def get_redis_pool(request: Request) -> aioredis.ConnectionPool:
    return request.app.state.redis_pool
