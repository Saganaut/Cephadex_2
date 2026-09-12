import redis as redis
import redis.asyncio as redis_async
from dependencies.settings import get_settings

settings = get_settings()

async_pool = redis_async.ConnectionPool(
    host=settings.redis.host,
    port=settings.redis.port,
    password=settings.redis.password,
    max_connections=settings.redis.max_connections,
)

pool = redis.ConnectionPool(
    host=settings.redis.host,
    port=settings.redis.port,
    password=settings.redis.password,
    max_connections=settings.redis.max_connections,
)
