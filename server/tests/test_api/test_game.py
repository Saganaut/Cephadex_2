# import json

# import httpx
# import pytest
# from fastapi import FastAPI, WebSocketDisconnect
# from fastapi.testclient import TestClient
# from fastapi.websockets import WebSocket
# from httpx import AsyncClient
# from tests.test_api.asyncio_test_client import AsyncioTestClient


# @pytest.mark.asyncio
# async def test_create_new_flex_game(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         request_data = {
#             "deckId": 1,
#             "gameType": "flex",
#             "rounds": 1,
#             "timeLimitAnswer": None,
#             "timeLimitVote": None,
#             "participate": True,
#             "pointsCorrect": 2,
#             "pointsDeceiver": 1,
#         }
#         response = await ac.post("/game/flex", json=request_data)
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Game created"
#         assert data["game"]["deckId"] == 1
#         assert data["link"] is not None
#         assert data["qrCode"] is not None


# @pytest.mark.asyncio
# async def test_get_game(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         game_id = 1
#         response = await ac.get(f"/game/flex/{game_id}")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "game"
#         assert data["game"]["id"] == game_id
#         assert data["game"]["creatorUsername"] == "RadagastTheBrown"
#         assert data["game"]["currentRound"] == 1
#         assert data["game"]["players"][0]["username"] == "RadagastTheBrown"


# @pytest.mark.asyncio
# async def test_game_websocket_endpoint(mocked_app):
#     client = TestClient(mocked_app)
#     async with client.websocket_connect("/game/1/1") as websocket:
#         data = await websocket.receive_text()
#         assert data == "ping"
#         await websocket.send_text("ping")
#         data = await websocket.receive_text()
#         assert data == "ping"
#         await websocket.close()


# @pytest.fixture(scope="session")
# async def user(shared_event_loop, async_mocked_app):
#     async with AsyncioTestClient(
#         app=async_mocked_app, event_loop=shared_event_loop
#     ) as client:
#         async with client.websocket_connect("/ws/") as websocket:
#             yield websocket


# @pytest.mark.asyncio
# async def test_game_websocket_endpoint(shared_event_loop, mocked_app):
#     # Use TestClient for setting up WebSocket connection

#     async with AsyncioTestClient(
#         app=mocked_app, event_loop=shared_event_loop
#     ) as client:
#         async with client.websocket_connect("/game/1/1") as websocket:
#             websocket.send_text("ping")
#             data = websocket.receive_text()
#             assert data == "ping"


# @pytest.mark.asyncio
# async def test_async_websocket():
#     async with httpx.AsyncClient() as client:
#         async with client.websocket("ws://testserver/ws/path") as ws:
#             await ws.send_json(
#                 {"type": "newHost", "username": "user", "playerId": "123"}
#             )
#             message = await ws.receive_json()
#             assert message == {"expected": "response"}


# def test_websocket_endpoint():
#     app = FastAPI()
#     client = TestClient(app)
#     with client.websocket_connect("/game/1/1/") as websocket:
#         websocket.send_json({"type": "newHost", "username": "user", "playerId": "123"})
#         data = websocket.receive_json()
#         assert data == {"expected": "response"}
