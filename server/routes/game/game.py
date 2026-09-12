"""HTTP routes for game

Raises
------
HTTPException: _description_
HTTPException: _description_

Returns
-------
_type_: _description_

"""

import logging

from fastapi import APIRouter, Depends, HTTPException
from redis.asyncio import Redis

from config import Settings
from dependencies.db import GetDb
from dependencies.posthog import GetPostHog
from dependencies.redis import GetRedisClient, get_redis_client
from dependencies.settings import get_settings
from dependencies.user_dependencies import CurrentUser, CurrentUserOrGuest
from models.decks.deck.deck_manager import DeckManager
from models.exceptions.game_exceptions import GameExceptions
from models.games.game_manager import GameManager
from models.helpers.helpers import Helpers
from models.helpers.log_decorators import log_decorator
from models.redis_manager import RedisManager
from routes.data_classes.game_schema import (
    CreateGameRequest,
    GameSchema,
    GameStatus,
    NewGameDataResponse,
)
from routes.game.game_responses import (
    authenticate_response,
    game_ended_response,
    game_started_response,
    lobby_response,
)

# from .flex import flex_router
from .game_ws import game_ws_router
from .host_cache import host_cache
from .utils import (
    add_player_to_game_if_participate,
    create_new_game_from_request,
    turn_game_into_game_schema_dict,
)

router = APIRouter(
    prefix="/game",
    tags=["game"],
)

# router.include_router(flex_router, prefix="")
router.include_router(game_ws_router, prefix="")

log = logging.getLogger("App")


@log_decorator
@router.post("/", response_model=NewGameDataResponse, tags=["game"])
async def create_new_flex_game(  # noqa: ANN201
    request: CreateGameRequest,
    db: GetDb,
    user: CurrentUser,
    r_client: GetRedisClient,
    posthog: GetPostHog,
    settings: Settings = Depends(get_settings),
):
    deck = await DeckManager.retrieve_deck(db, request.deck_id)
    DeckManager.check_permission(deck, user)
    game = create_new_game_from_request(request, user)
    db.add(game)
    await db.flush()
    link = f"{settings.app.front_end_url}/game/{request.game_type}/join/{game.id}"
    img_str = Helpers.create_qr_code(link, settings.app.image_folder_path)
    game_data = turn_game_into_game_schema_dict(game)
    host_cache[game.id] = game.creator
    game_data = add_player_to_game_if_participate(game_data, user, request, game)
    game_model = GameSchema(**game_data).model_dump(by_alias=True)
    await RedisManager.cache_json_data(r_client, f"game:{game.id}", game_model)
    await db.commit()
    posthog.capture(user.id, "game_created", {"game_id": game.id})
    return {
        "status": "success",
        "message": "Game created",
        "link": link,
        "qrCode": img_str,
        "game": game_model,
    }


@log_decorator
@router.get("/{game_id}", response_model=NewGameDataResponse, tags=["game"])
async def get_game(  # noqa: ANN201
    game_id: int,
    db: GetDb,
    user: CurrentUserOrGuest,  # noqa: ARG001
    r_client: Redis = Depends(get_redis_client),
):
    game = await GameManager.retrieve_game_from_db(db, game_id)
    game_manager = GameManager(r_client, game)
    game = game_manager.get_game_from_cache()
    game_data = game_manager.game.model_dump(by_alias=True)
    return {
        "status": "success",
        "message": "game",
        "link": "",
        "qrCode": "",
        "game": game_data,
    }


@log_decorator
@router.post("/join/{game_id}", response_model=NewGameDataResponse, tags=["game"])
async def join_game(  # noqa: ANN201
    game_id: int,
    db: GetDb,
    user: CurrentUserOrGuest,
    r_client: Redis = Depends(get_redis_client),
    settings: Settings = Depends(get_settings),
):
    log.debug("Joining game with user %s", user)
    try:
        game = await GameManager.retrieve_game_from_db(db, game_id)
        game_manager = GameManager(r_client, game)
        game = await game_manager.get_game_from_cache()
        host_cache[game.id] = game_manager.game.host
        link = f"{settings.app.front_end_url}/game/{game.game_type}/join/{game.id}"
        img_str = Helpers.create_qr_code(link, settings.app.image_folder_path)
        if game.host is None:
            log.debug("game creator is none, assigning new creator")
            await game_manager.assign_new_host_randomly()
            game = await game_manager.get_game_from_cache()

        # game_data = None
        if game.status == GameStatus.Ended:
            return game_ended_response(game, link)
        if user == "guest":
            return authenticate_response(game, link)

        player = await game_manager.get_player(f"{game.id}-{user.id}")

        if player is None:
            await game_manager.add_player_to_game(user)

        if game.status == GameStatus.InLobby:
            await game_manager.add_player_to_game(user)
            # await db.flush()
            return lobby_response(game, link, img_str)

        if player and game.status != GameStatus.InLobby:
            results = []
            if game_manager.game.current_round > 0:
                results = await game_manager.get_all_round_results_for_round()
            return game_started_response(game, link, results)
    except ConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail=("Error connecting to Redis"),
        ) from e
    except GameExceptions.PlayerNotFoundError:
        log.exception("Player not found UNHANDLED")
    except Exception as e:
        log.exception("Error in join_game")
        raise HTTPException(
            status_code=500,
            detail="Unexpected error while joining game",
        ) from e
