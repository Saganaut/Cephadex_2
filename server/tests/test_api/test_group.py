# import json
# from pprint import pprint

# import pytest
# import httpx


# @pytest.mark.asyncio
# async def test_get_all_groups_for_user(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/group/all")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "groups retrieved for user"
#         assert len(data["groups"]) == 1
#         assert data["groups"][0]["name"] == "Study Group"
#         assert (
#             data["groups"][0]["description"]
#             == "A group for collaborative study and sharing decks."
#         )
#         assert data["groups"][0]["groupType"] == "study"
#         assert data["groups"][0]["creatorId"] == 1
#         assert data["groups"][0]["img"] == "path/to/group/image.jpg"
#         assert data["groups"][0]["isPrivate"] is False
#         assert data["groups"][0]["fav"] is True


# @pytest.mark.asyncio
# async def test_create_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/group/create",
#             json={
#                 "name": "Study Group",
#                 "description": "A group for collaborative study and sharing decks.",
#                 "groupType": "study",
#                 "private": False,
#                 "creatorId": 1,
#             },
#         )
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Group succesfully created"
#         assert len(data["groups"]) == 1
#         assert data["groups"][0]["name"] == "Study Group"
#         assert (
#             data["groups"][0]["description"]
#             == "A group for collaborative study and sharing decks."
#         )
#         assert data["groups"][0]["groupType"] == "study"
#         assert data["groups"][0]["creatorId"] == 1
#         assert data["groups"][0]["isPrivate"] is False
#         assert data["groups"][0]["fav"] is False


# @pytest.mark.asyncio
# async def test_update_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.patch(
#             "/group/1",
#             json={
#                 "name": "Study Group",
#                 "description": "A group for collaborative study and sharing decks.",
#                 "groupType": "study",
#                 "private": False,
#             },
#         )
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Group succesfully updated"
#         assert len(data["groups"]) == 1
#         assert data["groups"][0]["name"] == "Study Group"
#         assert (
#             data["groups"][0]["description"]
#             == "A group for collaborative study and sharing decks."
#         )
#         assert data["groups"][0]["groupType"] == "study"
#         assert data["groups"][0]["creatorId"] == 1
#         assert data["groups"][0]["isPrivate"] is False
#         assert data["groups"][0]["fav"] is True


# @pytest.mark.asyncio
# async def test_delete_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.delete("/group/1")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Group deleted"


# @pytest.mark.asyncio
# async def test_get_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/group/1")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "group retrieved"
#         assert len(data["group"]) == 1


# @pytest.mark.asyncio
# async def test_save_deck_from_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post("/group/1/deck/1/import")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Deck imported successfully"
#         assert len(data["decks"]) == 1


# @pytest.mark.asyncio
# async def test_remove_deck_from_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.delete("/group/1/deck/1")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Deck removed from group successfully"


# @pytest.mark.asyncio
# async def test_add_deck_to_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post("/group/1/deck", json={"decks": [2]})
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Decks added to group successfully"
#         assert len(data["decks"]) == 1


# @pytest.mark.asyncio
# async def test_get_decks_for_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/group/1/deck")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Decks retrieved successfully"
#         assert len(data["decks"]) == 1


# @pytest.mark.asyncio
# async def test_remove_user_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.delete("/group/1/member/2")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "User removed successfully"


# @pytest.mark.asyncio
# async def test_update_member_permissions(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.patch(
#             "/group/1/permissions",
#             json={
#                 "permissionsToChange": [
#                     {"id": 2, "permissions": "write", "role": "admin"}
#                 ]
#             },
#         )
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Member permissions updated successfully"


# @pytest.mark.asyncio
# async def test_get_all_group_invites(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/group/invitation/all")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Group invites retrieved succesfuly"
#         assert len(data["groupInvites"]) == 1


# @pytest.mark.asyncio
# async def test_accept_group_invite(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post("/group/invitation/2/accept")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Group invite accepted"
#         assert len(data["groups"]) == 1


# @pytest.mark.asyncio
# async def test_invite_to_group(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/group/1/invite/",
#             json={
#                 "invitees": [
#                     {
#                         "id": 2,
#                         "email": "eaamail@ranaadom.com",
#                         "username": "testuser",
#                         "firstName": "test",
#                         "lastName": "user",
#                     }
#                 ],
#                 "emails": [],
#             },
#         )
#         data = response.json()
#         assert response.status_code == 200

#         assert data["status"] == "success"
#         assert data["message"] == "Users invited successfully"
#         assert len(data["invitedUsers"]) == 1


# @pytest.mark.asyncio
# async def test_delete_invitations(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.request(
#             "DELETE",
#             "/group/1/invited-users",
#             content=json.dumps(
#                 {
#                     "invites_to_delete": [
#                         {
#                             "id": 1,
#                             "group_name": "Study Group",
#                             "group_id": 1,
#                             "invitedById": 1,
#                             "invitedByEmail": "email@example.com",
#                             "timeCreated": "2022-01-01T00:00:00Z",
#                             "username": "testuser",
#                             "invitedByUsername": "testuser",
#                         }
#                     ]
#                 }
#             ),
#             headers={"Content-Type": "application/json"},
#         )
#         data = response.json()
#         assert response.status_code == 200

#         assert data["status"] == "success"
#         assert data["message"] == "Invitations deleted successfully"


# @pytest.mark.asyncio
# async def test_get_all_invited_users(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/group/2/invited-users")

#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Invited users retrieved"
#         assert len(data["groupInvites"]) == 1


# @pytest.mark.asyncio
# async def test_decline_group_invite(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.delete("/group/invitation/2/decline")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Group invite declined"
