# import pytest
# import httpx


# @pytest.mark.asyncio
# async def test_get_cards_due(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         request_data = {
#             "deck_id": 1,
#             "batch_number": 0,
#             "cards": None,
#             "settings": None,
#         }
#         response = await ac.post("/study/1/cards-due", json=request_data)
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "cards due succesfully retrieved"
#         assert data["cards"][0]["deckId"] == 1
#         assert data["cards"][0]["batchNumber"] == 1
#         assert data["cards"][0]["uniqueId"] == 111
#         assert data["cards"][0]["term"] == "string"
#         assert data["cards"][0]["subject"] == "string"
