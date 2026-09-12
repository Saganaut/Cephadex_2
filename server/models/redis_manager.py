import json
import logging
import re

from redis import Redis
from redis.asyncio import Redis as RedisAsync

logger = logging.getLogger("App")


class RedisManager:
    @staticmethod
    def check_if_cached(r: Redis, key: str):  # noqa: ANN205
        return r.exists(key)

    @staticmethod
    def retrieve_cached_data(r: Redis, key: str):  # noqa: ANN205
        """Not async"""
        return r.get(key)

    @staticmethod
    def cache_data(r: Redis, key: str, data, time: int = 3600):  # noqa: ANN205, ANN001
        r.set(key, data)
        r.expire(key, time)
        return True

    @staticmethod
    def decode_data(data):  # noqa: ANN205, ANN001
        return data.decode("utf-8")

    @staticmethod
    def create_key(raw_key: str) -> str:
        safe_key = re.sub(r"\W+", "_", raw_key)
        key = "".join(safe_key)
        return key.rstrip(":")

    @staticmethod
    def cache_json_data_non_async(
        r: Redis | RedisAsync,
        key: str,
        data: dict,
        time_exp: int | None = 3600,
    ) -> None:
        r.json().set(key, "$", data)
        if time_exp is None:
            return
        r.expire(key, time_exp)

    @staticmethod
    def retrieve_cached_json_data_non_async(r: Redis, key: str) -> dict | None:
        # logger.debug(
        #     "Retrieving cached json Redis client is type %s, key: %s",
        #     type(r),
        #     key,
        # )
        result = r.json().get(key, "$")
        if not result:
            return None
        return result[0]  # type: ignore

    @staticmethod
    async def cache_json_data(r: RedisAsync, key: str, data: dict, time_exp: int = 3600) -> None:
        try:
            await r.json().set(key, "$", data)  # type: ignore
            await r.expire(key, time_exp)
        except Exception:
            logger.exception("Error caching data")

    @staticmethod
    async def retrieve_cached_json_data(r: RedisAsync, key: str) -> dict | None:
        # logger.debug(
        #     "Retrieving cached json Redis client is type %s , key: %s ",
        #     type(r),
        #     key,
        # )
        result = await r.json().get(key, "$")  # type: ignore
        if not result:
            return None
        return result[0]

    @staticmethod
    async def push_to_list(r: RedisAsync, key: str, data: dict) -> None:
        await r.lpush(key, json.dumps(data))  # type: ignore

    @staticmethod
    async def delete_keys_by_pattern(r: RedisAsync, pattern: str) -> None:
        pattern_wild = pattern + "*"
        cursor = "0"
        while cursor != 0:  # This is a typical pattern to iterate over all keys
            cursor, keys = await r.scan(cursor=int(cursor), match=pattern_wild, count=100)
            if keys:
                await r.unlink(*keys)
