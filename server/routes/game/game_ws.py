"""Websocket route for the game.

Raises
------
    KeyError: _description_

"""

import asyncio
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from redis.asyncio import Redis
from redis.asyncio.client import PubSub

from models.exceptions.game_exceptions import GameExceptions
from models.games.game_manager import GameManager
from models.helpers.log_decorators import log_decorator
from routes.data_classes.game_schema import (
    ConnectionStatus,
    GameStatus,
    RoundStatus,
)
from startup.setup_db import async_session

from .host_cache import host_cache
from .utils import (
    cleanup,
    handle_disconnection,
    handle_player_join,
    is_websocket_connected,
    redis_listener,
    send_game_expired,
    setup_redis_pubsub,
)

log = logging.getLogger("App")

game_ws_router = APIRouter()


@log_decorator
@game_ws_router.websocket("/{game_id}/{player_id}")
async def game_websocket_endpoint(websocket: WebSocket, game_id: int, player_id: int) -> None:
    r_client: Redis = websocket.app.state.redis_client
    await websocket.accept()
    async with async_session() as db:
        game = await GameManager.retrieve_game_from_db(db, game_id)
    game_manager = GameManager(r_client, game)
    try:
        await handle_game(websocket, player_id, game_manager, r_client)
    except WebSocketDisconnect:
        await handle_disconnection(game_manager, player_id, game_id, r_client)
    except asyncio.CancelledError:
        log.exception("Exception in game_websocket_endpoint")
        await handle_disconnection(game_manager, player_id, game_id, r_client)
    except Exception:
        log.exception("Unexpected exception in game_websocket_endpoint")
    finally:
        await cleanup(websocket, r_client)


async def handle_game(
    websocket: WebSocket,
    player_id: int,
    game_manager: GameManager,
    r_client: Redis,
) -> None:
    if game_manager.game.status == "ended":
        await send_game_expired(websocket)
        return
    await game_ws_handler(websocket, player_id, game_manager, r_client)


async def game_ws_handler(
    websocket: WebSocket,
    player_id: int,
    game_manager: GameManager,
    r_client: Redis,
) -> None:
    player = await game_manager.get_player(f"{game_manager.game.id}-{player_id}")
    redis_pubsub = await setup_redis_pubsub(r_client, websocket)
    player_username = await handle_player_join(player, game_manager.game.id, r_client)
    await redis_pubsub.subscribe(f"room:{game_manager.game.id}")
    await asyncio.gather(
        listen_to_redis(redis_pubsub, websocket, game_manager, player_id, r_client),
        listen_to_websocket(websocket, game_manager, player_id, player_username, r_client),
    )


async def listen_to_redis(  # noqa: ANN201
    redis_pubsub: PubSub,
    websocket: WebSocket,
    game_manager: GameManager,
    player_id: int,
    r_client: Redis,
):
    async for message in redis_listener(redis_pubsub):
        if message and await is_websocket_connected(websocket):
            # decoded_message = message["data"].decode()
            await handle_redis_message(
                message["data"],
                game_manager,
                player_id,
                r_client,
                websocket,
            )


async def listen_to_websocket(  # noqa: ANN201
    websocket: WebSocket,
    game_manager: GameManager,
    player_id: int,
    player_username: str,
    r_client: Redis,
):
    while True:
        try:
            data = await websocket.receive_json()
            if data:
                await handle_websocket_data(
                    data,
                    game_manager,
                    player_id,
                    player_username,
                    r_client,
                    websocket,
                )

        except Exception:  # noqa: PERF203
            log.exception("WebSocket exception")
            if await is_websocket_connected(websocket):
                await websocket.close(reason="Closing due to exception")
            break


async def handle_redis_message(  # noqa: C901, PLR0912, PLR0915
    message: str,
    game_manager: GameManager,
    player_id: int,
    r_client: Redis,
    websocket: WebSocket,
) -> None:
    match message:
        case "all answers submitted":
            if player_id == host_cache[game_manager.game.id]:
                if game_manager.game.game_type == "flex":
                    await game_manager.change_game_status(new_status=GameStatus.Voting)
                elif game_manager.game.game_type == "classic":
                    await game_manager.set_if_answer_is_correct_for_game_two()
                    await game_manager.change_game_status(GameStatus.PostAnswering)
                await r_client.publish(f"room:{game_manager.game.id}", "answers ready")

        case "all votes submitted":
            if player_id == host_cache[game_manager.game.id]:
                await game_manager.count_votes()
                await r_client.publish(f"room:{game_manager.game.id}", "votes counted")
        case "start game":
            updated_game = await game_manager.start_game()
            game_data = updated_game.model_dump(by_alias=True)

            players_data = []
            for player in updated_game.players:
                player_data = player.model_dump(by_alias=True)
                players_data.append(player_data)
            await websocket.send_json(
                {"type": "startGame", "data": {"game": game_data, "players": players_data}},
            )
        case "start round":
            game = await game_manager.get_game_from_cache()
            if game.current_question is None:
                raise GameExceptions.QuestionNotFoundError(str(game.id))
            current_question = game.current_question.model_dump(by_alias=True)
            await websocket.send_json(
                {
                    "type": "startRound",
                    "data": {
                        "round": {
                            "id": f"{game.id}-{game.current_round}",
                            "gameId": game_manager.game.id,
                            "roundId": game.current_round,
                            "question": current_question,
                            "results": [],
                            "status": RoundStatus.AwaitingAnswers,
                        },
                        "timeLimit": game.time_limit_answer,
                        "gameStatus": game.status,
                    },
                },
            )

        case _:
            if message.startswith("answer submitted"):
                await websocket.send_json(
                    {
                        "type": "answerSubmitted",
                        "data": {
                            "gameId": game_manager.game.id,
                            "playerId": message.split(" ")[4],
                            "username": message.split(" ")[5],
                        },
                    },
                )
            elif message.startswith("vote submitted"):
                await websocket.send_json(
                    {
                        "type": "voteSubmitted",
                        "data": {
                            "gameId": game_manager.game.id,
                            "playerId": message.split(" ")[4],
                            "username": message.split(" ")[5],
                        },
                    },
                )
            elif message.startswith("removed player"):
                await websocket.send_json(
                    {
                        "type": "removedPlayer",
                        "data": {
                            "gameId": game_manager.game.id,
                            "username": message.split(" ")[2],
                            "playerId": message.split(" ")[3],
                        },
                    },
                )

            elif message.startswith("joined player"):
                player_id_id = message.split(" ")[3]
                player = await game_manager.change_player_connection_status(
                    f"{game_manager.game.id}-{player_id_id}",
                    ConnectionStatus.Connected,
                )
                game_data = game_manager.game.model_dump(by_alias=True)
                players_data = []
                for player in game_manager.game.players:
                    player_data = player.model_dump(by_alias=True)
                    players_data.append(player_data)
                await websocket.send_json(
                    {
                        "type": "joinedPlayer",
                        "data": {
                            "username": message.split(" ")[2],
                            "playerId": player_id_id,
                            "game": game_data,
                            "players": players_data,
                        },
                    },
                )

            elif message.startswith("disconnected player"):
                await websocket.send_json(
                    {
                        "type": "disconnectedPlayer",
                        "data": {
                            "username": message.split(" ")[2],
                            "playerId": message.split(" ")[3],
                        },
                    },
                )

            elif message == "answers ready":
                answers = await game_manager.get_all_round_results_for_round()
                answers_data = []
                for answer in answers:
                    answer_answer = answer.model_dump(by_alias=True)
                    answers_data.append(answer_answer)
                await websocket.send_json(
                    {
                        "type": "answersReady",
                        "data": {
                            "gameId": game_manager.game.id,
                            "roundId": game_manager.game.current_round,
                            "results": answers_data,
                            "gameStatus": game_manager.game.status,
                        },
                    },
                )

            elif message == "votes counted":
                try:
                    results = await game_manager.get_all_round_results_for_round()
                    round_id = results[0].round
                    results_data = [answer.model_dump(by_alias=True) for answer in results]
                    await websocket.send_json(
                        {
                            "type": "votesCounted",
                            "data": {
                                "gameId": game_manager.game.id,
                                "roundId": round_id,
                                "results": results_data,
                                "gameStatus": game_manager.game.status,
                            },
                        },
                    )
                except Exception:
                    log.exception("error in votes counted")

            elif message == "end game":
                results = []
                game_manager.game.status = GameStatus.Ended
                for player in game_manager.game.players:
                    results.append(player.model_dump(by_alias=True))
                await websocket.send_json(
                    {
                        "type": "endGame",
                        "data": {
                            "gameId": game_manager.game.id,
                            "results": results,
                            "game": game_manager.game.model_dump(by_alias=True),
                        },
                    },
                )

            elif message.startswith("new host"):
                host_cache[game_manager.game.id] = int(message.split(" ")[3])
                await websocket.send_json(
                    {
                        "type": "newHost",
                        "data": {
                            "gameId": game_manager.game.id,
                            "username": message.split(" ")[2],
                            "playerId": message.split(" ")[3],
                        },
                    },
                )
                if player_id == host_cache[game_manager.game.id]:
                    await websocket.send_json(
                        {
                            "type": "becomeHost",
                            "data": {
                                "username": message.split(" ")[2],
                                "playerId": message.split(" ")[3],
                            },
                        },
                    )

            elif message.startswith("leave game"):
                player_to_remove = message.split(" ")[3]
                await websocket.send_json(
                    {
                        "type": "leaveGame",
                        "data": {
                            "gameId": game_manager.game.id,
                            "username": message.split(" ")[2],
                            "playerId": message.split(" ")[3],
                        },
                    },
                )
                if player_id == host_cache[game_manager.game.id]:
                    await game_manager.remove_player_from_game(player_to_remove)

            elif message.startswith("message"):
                await websocket.send_json(
                    {
                        "type": "messageResponse",
                        "data": {
                            "content": message.split(" ")[1],
                        },
                    },
                )
            await asyncio.sleep(0.01)


async def handle_websocket_data(  # noqa: C901, PLR0912, PLR0915
    message_data: dict,
    game_manager: GameManager,
    player_id: int,
    player_username: str,
    r_client: Redis,
    websocket: WebSocket,
) -> None:
    try:
        match message_data["type"]:
            case "ping":
                await websocket.send_json({"type": "pong"})
            case "startGame":
                if player_id == host_cache[game_manager.game.id]:
                    await game_manager.start_game()
                    await r_client.publish(f"room:{game_manager.game.id}", "start game")
            case "startRound":
                if player_id == host_cache[game_manager.game.id]:
                    await game_manager.increment_round()
                    async with async_session() as db:
                        await game_manager.get_new_question(db)
                    await game_manager.create_round_entry_for_players()
                    await r_client.publish(f"room:{game_manager.game.id}", "start round")
            case "joinedPlayer":
                await r_client.publish(
                    f"room:{game_manager.game.id}",
                    f"joined player {player_username} {player_id}",
                )
            case "endGame":
                if player_id == host_cache[game_manager.game.id]:
                    async with async_session() as db:
                        await game_manager.end_game(db)
                    await r_client.publish(f"room:{game_manager.game.id}", "end game")
            case "endAnswers":
                if player_id == host_cache[game_manager.game.id]:
                    await r_client.publish(f"room:{game_manager.game.id}", "all answers submitted")
            case "endVotes":
                if player_id == host_cache[game_manager.game.id]:
                    await game_manager.count_votes()
                    await r_client.publish(f"room:{game_manager.game.id}", "all votes submitted")
            case "removePlayer":
                if player_id == host_cache[game_manager.game.id]:
                    username, user_id = await game_manager.remove_player_from_game(
                        message_data["playerId"],
                    )
                    await r_client.publish(
                        f"room:{game_manager.game.id}",
                        f"removed player {username} {user_id}",
                    )
            case "submitAnswer":
                await game_manager.submit_answer(message_data["answer"], player_id)
                await r_client.publish(
                    f"room:{game_manager.game.id}",
                    f"answer submitted player id {player_id} {player_username}",
                )
                if await game_manager.check_if_all_answers_submitted() is True:
                    await r_client.publish(f"room:{game_manager.game.id}", "all answers submitted")
            case "submitVote":
                await game_manager.submit_vote(
                    message_data["vote"]["voteId"],
                    message_data["vote"]["voteText"],
                    player_id,
                )
                await r_client.publish(
                    f"room:{game_manager.game.id}",
                    f"vote submitted player id {player_id} {player_username}",
                )
                if await game_manager.check_if_all_votes_submitted() is True:
                    await r_client.publish(f"room:{game_manager.game.id}", "all votes submitted")
            case "messageRequest":
                if player_id == host_cache[game_manager.game.id]:
                    await r_client.publish(
                        f"room:{game_manager.game.id}",
                        f"message {message_data['content']}",
                    )
            case "leaveGame":
                if player_id == host_cache[game_manager.game.id]:
                    await game_manager.remove_player_from_game(
                        f"{game_manager.game.id}-{player_id}",
                    )
                    user_id, username = await game_manager.assign_new_host_randomly()
                    host_cache[game_manager.game.id] = user_id
                    await r_client.publish(
                        f"room:{game_manager.game.id}",
                        f"new host {username} {user_id}",
                    )
                await r_client.publish(
                    f"room:{game_manager.game.id}",
                    f"leave game {player_username} {player_id}",
                )
        await asyncio.sleep(0.01)
    except GameExceptions.CardNotFoundError:
        await websocket.send_json(
            {
                "type": "error",
                "data": {
                    "message": """Unable to find a suitable card in the deck. If you are playing in
                    classic mode ensure that the deck contains either multiple choice
                    or true false questions.""",
                },
            },
        )
