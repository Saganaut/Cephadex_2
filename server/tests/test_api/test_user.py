# import json
# from pprint import pprint

# import pytest
# import httpx

# ##TODO figure out how to test file uploads to s3 and deletion of files from s3


# @pytest.mark.asyncio
# async def test_update_profile_picture(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/user/profile-picture",
#             files={"profile_pic": ("test.jpg", "some-image.jpg", "image/jpeg")},
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Picture updated!"
#         assert data["loggedIn"] == True
#         assert data["user"] is not None


# @pytest.mark.asyncio
# async def test_delete_profile_picture(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.delete("/user/profile-picture")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Picture deleted!"
#         assert data["loggedIn"] == True
#         assert data["user"] is not None


# @pytest.mark.asyncio
# async def test_feedback(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/user/feedback",
#             json={
#                 "userId": 1,
#                 "nameField": "test",
#                 "emailField": "email@email.com",
#                 "messageField": "test",
#                 "feedbackTypeField": "bug",
#             },
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Thank you for your feedback!"


# @pytest.mark.asyncio
# async def test_delete_account(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.request(
#             "DELETE",
#             "/user/account",
#             content=json.dumps(
#                 {
#                     "userId": 1,
#                     "delEmail": "Radagast@rhosgobel.com",
#                     "reason": "other",
#                     "otherReason": "I'm a wizard",
#                     "more": "I'm a wizard",
#                 },
#             ),
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Account deleted"


# @pytest.mark.asyncio
# async def test_disable_email_notifications(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.request("DELETE", "/user/email-notifications")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Notifications disabled"


# @pytest.mark.asyncio
# async def test_enable_email_notifications(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post("/user/email-notifications")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Notifications enabled"


# @pytest.mark.asyncio
# async def test_update_account(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.patch(
#             "/user/account",
#             json={
#                 "userId": 1,
#                 "username": "RadagastTheBrown",
#                 "email": "",
#                 "firstName": "Radagast",
#                 "lastName": "Brown",
#                 "accountType": "",
#                 "accountStatus": "free",
#                 "timezone": "America/New_York",  # Replace with the expected value
#                 "gender": "male",  # Replace with the expected value
#                 "role": "user",  # Replace with the expected value
#             },
#         )
#         data = response.json()
#         print(data)
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Account updated"


# @pytest.mark.asyncio
# async def test_update_user_data(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.patch("/user/data/quizzes")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "User data updated"
#         assert data["user"] is not None


# @pytest.mark.asyncio
# async def test_subscribe(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/user/newsletter", json={"email": "Saruman@Isengard.com"}
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Subscription successful!"


# @pytest.mark.isolated
# @pytest.mark.asyncio
# async def test_unsubscribe(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.request(
#             "DELETE",
#             "/user/newsletter",
#             content=json.dumps({"email": "Radagast@rhosgobel.com"}),
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Unsubscribed!"


# @pytest.mark.isolated
# @pytest.mark.asyncio
# async def test_unsubscribe_failed(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.request(
#             "DELETE",
#             "/user/newsletter",
#             content=json.dumps({"email": "Alatar@valinor.com"}),
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["message"] == "You are not subscribed!"
#         assert data["status"] == "failure"


# @pytest.mark.asyncio
# async def test_get_notifications(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/user/notifications")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Notifications retrieved"
#         assert len(data["notifications"]) == 1
#         assert data["notifications"][0]["id"] == 1


# @pytest.mark.asyncio
# async def test_update_notifications(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.patch(
#             "/user/notifications",
#             json={
#                 "id": 1,
#                 "user_id": 1,
#                 "notification_type": "test",
#                 "message": "Test notification",
#                 "time_created": "2022-01-01T00:00:00+00:00",
#                 "time_updated": "2022-01-01T00:00:00+00:00",
#                 "read": False,
#                 "ref_id": 1,
#                 "ref_table": "test",
#                 "share_id": "test",
#             },
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Notification updated"
#         assert data["notifications"] == []


# @pytest.mark.asyncio
# async def test_delete_notifications(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.request(
#             "DELETE",
#             "/user/notifications",
#             content=json.dumps(
#                 {
#                     "id": 1,
#                     "user_id": 1,
#                     "notification_type": "test",
#                     "message": "Test notification",
#                     "time_created": "2022-01-01T00:00:00+00:00",
#                     "time_updated": "2022-01-01T00:00:00+00:00",
#                     "read": False,
#                     "ref_id": 1,
#                     "ref_table": "test",
#                     "share_id": "test",
#                 },
#             ),
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Notification deleted"
#         assert data["notifications"] == []


# @pytest.mark.asyncio
# async def test_search_users(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/user/search/gandalf")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Users found"
#         assert data["users"] is not None


# @pytest.mark.asyncio
# async def test_get_user_settings(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/user/settings")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Settings retrieved succesfully"
#         assert data["userSettings"] == {
#             "language": "English",
#             "theme": "dark",
#             "newUser": True,
#             "newUserStudy": True,
#             "newUserDecks": True,
#             "newUserTests": True,
#             "newUserCards": True,
#             "srsSettings1": 0,
#             "srsSettings2": 0,
#             "srsSettings3": 0,
#             "srsSettings4": 0,
#         }


# @pytest.mark.asyncio
# async def test_update_settings(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.patch(
#             "/user/settings",
#             json={
#                 "language": "English",
#                 "theme": "Dark",
#                 "new_user": True,
#                 "new_user_study": True,
#                 "new_user_decks": True,
#                 "new_user_tests": True,
#                 "new_user_cards": True,
#                 "srs_settings_1": 5,
#                 "srs_settings_2": 10,
#                 "srs_settings_3": 15,
#                 "srs_settings_4": 20,
#             },
#         )
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Settings updated!"


# @pytest.mark.asyncio
# async def test_check_user_status(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/user/auth/status/")
#         assert response.status_code == 200
#         data = response.json()
#         print(data)
#         assert data["status"] == "success"
#         assert data["loggedIn"] is True
#         assert data["user"]["id"] == 1


# @pytest.mark.asyncio
# async def test_get_user(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/user/user")
#         assert response.status_code == 200
#         data = response.json()
#         print(data)
#         assert data["status"] == "success"
#         assert data["loggedIn"] is True
#         assert data["user"]["id"] == 1


# @pytest.mark.asyncio
# async def test_check_username(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/user/check-username/BilboBaggins")
#         assert response.status_code == 200
#         assert response.json() == {"usernameTaken": False}

#         response = await ac.get("/user/check-username/RadagastTheBrown")
#         assert response.status_code == 200
#         assert response.json() == {"usernameTaken": True}


# @pytest.mark.asyncio
# async def test_logout(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         cookies = {"access_token": "test_token"}
#         ac.cookies.update(cookies)
#         response = await ac.delete("/user/auth/logout")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["loggedIn"] is False


# @pytest.mark.asyncio
# async def test_sign_up(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         # Create a mock SignUpRequest
#         request_data = {
#             "email": "test@example.com",
#             "username": "test_user",
#             "role": "test_role",
#             "firstName": "Test",
#             "lastName": "User",
#             "token": "test_token",
#             "picture": None,
#             "userTimezone": None,
#             "agreeTandC": True,
#             "newsletter": True,
#             "howDidYouHearAboutUs": "test_source",
#             "whatDoYouWantToDo": "test_action",
#             "externalType": "google",
#         }

#         # Send a POST request to the sign-up endpoint
#         response = await ac.post("/user/sign-up", json=request_data)

#         # Check the response
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Registration successful!"
#         assert data["user"]["email"] == request_data["email"]
#         assert data["user"]["username"] == request_data["username"]
#         assert data["user"]["firstName"] == request_data["firstName"]
#         assert data["user"]["lastName"] == request_data["lastName"]

#         # Check if the access_token cookie has been set
#         assert "access_token" in ac.cookies
