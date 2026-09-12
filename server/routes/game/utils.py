import asyncio
import datetime as dt
import logging
from time import sleep
from typing import Any, Callable, Tuple, Type, TypeVar

from fastapi import WebSocket
from redis.asyncio import Redis
from redis.asyncio.client import PubSub

from dependencies.user_dependencies import CurrentUser
from models.games.game_manager import GameManager
from models.models_ import Game
from routes.data_classes.game_schema import (
    CreateGameRequest,
    GameStatus,
    PlayerGameSchema,
    PlayerStatus,
)

log = logging.getLogger("App")


T = TypeVar("T")


def retry_redis_connection(func: Callable[[], T], max_retries: int = 3, delay: int = 1) -> T:
    for i in range(max_retries):
        try:
            return func()
        except Exception as e:  # noqa: PERF203, BLE001
            log.info("Retry %s/%s failed: %s", i + 1, max_retries, e)
            sleep(delay * 2**i)
    msg = "Unable to connect to Redis after retries"
    raise Exception(msg)  # noqa: TRY002


async def is_websocket_connected(websocket: WebSocket) -> bool:
    try:
        await websocket.send_text("ping")
        return True
    except RuntimeError:
        return False
    except Exception:
        log.exception("Unhandled exception in is_websocket_connected")
        return False


async def setup_redis_pubsub(r_client: Redis, websocket: WebSocket) -> PubSub:
    try:
        return retry_redis_connection(r_client.pubsub)
    except Exception:
        await websocket.send_json(
            {"type": "error", "data": {"message": "Error connecting to Redis"}},
        )
        log.exception("unable to connect to redis")
        await websocket.close(code=1006, reason="Redis connection error")
        raise


async def handle_player_join(player: PlayerGameSchema | None, game_id: int, r_client: Redis) -> str:
    if player:
        try:
            await r_client.publish(
                f"room:{game_id}",
                f"joined player {player.username} {player.player_id}",
            )
            return player.username
        except Exception:
            log.exception("Error in publishing player joined")
    return "Observer"


async def handle_disconnection(
    game_manager: GameManager,
    player_id: int,
    game_id: int,
    r_client: Redis,
) -> None:
    await game_manager.handle_disconnection(player_id)
    player = await game_manager.get_player(f"{game_id}-{player_id}")
    player_username = player.username if player else "unknown"
    await r_client.publish(f"room:{game_id}", f"disconnected player {player_username} {player_id}")


async def cleanup(websocket: WebSocket, r_client: Redis) -> None:
    try:
        await r_client.close()
    except Exception:
        log.exception("Error closing Redis connections")

    try:
        log.debug("Finally disconnected")
        await websocket.close(reason="Finally disconnected")
    except RuntimeError:
        # This exception is raised if the connection is already closed
        log.debug("WebSocket already closed")
    except Exception:
        log.exception("Error closing WebSocket")


async def send_game_expired(websocket: WebSocket) -> None:
    await websocket.send_json({"type": "gameExpired", "data": {}})
    log.debug("game has ended, closing WS connection")
    await websocket.close(reason="Game is ended")


async def retrieve_with_retries(
    callback: Callable[..., Any],
    key: str = "unknown function",
    max_retries: int = 3,
    initial_delay: int = 1,
    backoff_factor: float = 2.0,
    exceptions: Tuple[Type[BaseException], ...] = (Exception,),
) -> None:
    delay = initial_delay

    delay = initial_delay
    for attempt in range(1, max_retries + 1):
        try:
            result = await callback()
            if result:
                return result
            await asyncio.sleep(delay)
            delay *= backoff_factor

        except exceptions as e:  # noqa: PERF203
            if attempt == max_retries:
                msg = f"Failed after 3 retries, {key}"
                log.exception(msg)
                raise Exception from e  # noqa: TRY002

            await asyncio.sleep(delay)
            delay *= backoff_factor
    return None


async def redis_listener(redis_pubsub: PubSub):  # noqa: ANN201
    # await redis_pubsub.subscribe("test")
    while True:
        message = await redis_pubsub.get_message(ignore_subscribe_messages=True)
        if message:
            yield message
        else:
            await asyncio.sleep(0.01)


def turn_game_into_game_schema_dict(game: Game) -> dict:
    game_data = game.to_dict()
    game_data["current_question"] = None
    game_data["status"] = GameStatus.InLobby
    game_data["host"] = game_data["creator"]
    game_data["host_username"] = game_data["creator_username"]
    return game_data


def add_player_to_game_if_participate(
    game_data: dict,
    user: CurrentUser,
    request: CreateGameRequest,
    game: Game,
) -> dict:
    if request.participate is True:
        player = PlayerGameSchema(
            username=user.username,
            player_id=user.id,
            game_id=game.id,
            id=f"{game.id}-{user.id}",
            status=PlayerStatus.Waiting,
            is_host=True,
            is_player=True,
            game_type=request.game_type,
        )
    game_data["players"] = [(player.model_dump(by_alias=True))]
    return game_data


def create_new_game_from_request(request: CreateGameRequest, user: CurrentUser) -> Game:
    return Game(
        deck_id=request.deck_id,
        creator=user.id,
        creator_username=user.username,
        time_limit_answer=request.time_limit_answer,
        time_limit_vote=request.time_limit_vote,
        time_created=dt.datetime.now(),
        rounds=request.rounds,
        status="created",
        points_deceiver=request.points_deceiver,
        points_correct=request.points_correct,
        game_type=request.game_type,
    )
