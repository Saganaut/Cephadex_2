# import json
# import logging

# import pytest
# from data.test_cards import test_card_dict
# import httpx


# @pytest.mark.asyncio
# async def test_copy_public_deck(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.post("/deck/public/1")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "Deck copied" in response_data["message"]
#         assert "decks" in response_data
#         assert len(response_data["decks"]) == 1
#         assert response_data["decks"][0]["id"] == 3
#         assert response_data


# @pytest.mark.asyncio
# async def test_get_cards_for_public_deck(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.get("/deck/public/1/cards")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "retrieved cards for public deck" in response_data["message"]
#         assert "cards" in response_data


# @pytest.mark.asyncio
# async def test_toggle_like_deck(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.post("/deck/1/like")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "Deck like succesfully toggled" in response_data["message"]
#         assert "liked" in response_data
#         assert response_data["liked"] == False


# @pytest.mark.asyncio
# async def test_search_public_decks(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.get("/deck/public-decks/search/?search_query=deck")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "public decks retrieved" in response_data["message"]
#         assert "decks" in response_data
#         assert "totalPages" in response_data


# @pytest.mark.asyncio
# async def test_get_deck_csv(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.get("/deck/1/csv")
#         assert response.status_code == 200
#         assert response.headers["content-type"] == "text/csv; charset=utf-8"
#         assert response.headers["content-disposition"] == 'attachment; filename="1.csv"'


# @pytest.mark.asyncio
# async def test_get_files(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.get("/deck/1/files")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "files retrieved" in response_data["message"]


# @pytest.mark.asyncio
# async def test_download_file_as_pdf(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.get("/deck/1/file/1/pdf")
#         assert response.status_code == 200
#         assert response.headers["content-type"] == "application/pdf"
#         assert (
#             response.headers["content-disposition"] == "attachment; filename=file.pdf"
#         )


# @pytest.mark.asyncio
# async def test_get_file(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.get("/deck/1/file/1")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "file retrieved succesfully" in response_data["message"]
#         assert response_data["files"][0]["id"] == 1
#         assert response_data["files"][0]["name"] == "example.pdf"
#         assert response_data["files"][0]["filePath"] == "/path/to/example.pdf"
#         assert response_data["files"][0]["fileType"] == "pdf"
#         assert response_data["files"][0]["fileSize"] == 1024
#         assert (
#             response_data["files"][0]["textString"]
#             == "This is an example of text content within the file."
#         )
#         assert response_data["files"][0]["createType"] == "manual"
#         assert response_data["files"][0]["fav"] is False


# @pytest.mark.asyncio
# async def test_delete_file(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.delete("/deck/1/file/1")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "File deleted" in response_data["message"]


# @pytest.mark.asyncio
# async def test_edit_card(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.put("/deck/1/card/1", json=test_card_dict)
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "Card updated" in response_data["message"]


# @pytest.mark.asyncio
# async def test_get_deck(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.get("/deck/1")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "Deck retrieved" in response_data["message"]


# @pytest.mark.asyncio
# async def test_delete_deck(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.delete("/deck/1")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert response_data["message"] == "Deck deleted"


# @pytest.mark.asyncio
# async def test_delete_card(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.delete("/deck/1/card/1")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"


# @pytest.mark.asyncio
# async def test_get_cards_for_deck(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.get("/deck/1/cards")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"


# @pytest.mark.asyncio
# async def test_toggle_favorite_deck(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.post("/deck/1/favorite")
#         assert response.status_code == 200


# @pytest.mark.asyncio
# async def test_toggle_favorite_card(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.patch("/deck/1/favorite/")

#     assert response.status_code == 200
#     response_data = response.json()
#     assert response_data["status"] == "success"
#     assert response_data["message"] == "Deck favorite toggled"


# @pytest.mark.asyncio
# async def test_create_new_card(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         card_data = {
#             "term": "Test card",
#             "content": "Test content",
#             "boc_2": "test boc 2",
#             "boc_3": "test boc 3",
#             "boc_4": "test boc 4",
#             "category": "test category",
#             "formula": "test formula",
#             "subject": "test subject",
#             "topic": "test topic",
#         }
#         response = await client.post("/deck/1/card/", json=card_data)

#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "Card created" in response_data["message"]


# @pytest.mark.asyncio
# async def test_create_deck(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         deck_data = {
#             "name": "test deck",
#             "description": "description",
#             "tags": "tags",
#             "public": False,
#             "category": "string",
#             "subject": "string",
#             "topic": "string",
#             "img": "string",
#         }
#         response = await client.post("/deck/", json=deck_data)

#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "Deck created" in response_data["message"]


# @pytest.fixture
# def test_deck_data():
#     return {"description": "Updated description", "public": 1}


# @pytest.mark.asyncio
# async def test_update_deck(mocked_app, test_deck_data):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         deck_id = 1
#         form_data = {
#             "data": json.dumps(test_deck_data),
#         }
#         response = await client.put(f"/deck/{deck_id}", data=form_data)

#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert response_data["message"] == "Deck updated"
#         assert len(response_data["decks"]) == 1
#         assert response_data["decks"][0]["description"] == test_deck_data["description"]


# @pytest.mark.asyncio
# async def test_refresh_data(mocked_app):
#     transport = httpx.ASGITransport(app=mocked_app)
#     async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#         response = await client.patch("/deck/data/1")
#         assert response.status_code == 200
#         response_data = response.json()
#         assert response_data["status"] == "success"
#         assert "Deck refreshed" in response_data["message"]


# @pytest.mark.asyncio
# async def test_create_deck_no_name(mocked_app):
#     try:
#         transport = httpx.ASGITransport(app=mocked_app)
#         async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
#             deck_data = {
#                 "description": "ww",
#                 "tags": "aaa",
#                 "public": False,
#                 "category": "straaaing",
#                 "subject": "striaaang",
#                 "topic": "strawawaing",
#                 "img": "stawaring",
#             }
#             response = await client.post("/deck/", json=deck_data)
#             assert response.status_code == 422
#     except Exception as e:
#         logging.error(f"An error occurred: {e}")
#         raise
