# import json
# import datetime as dt, timezone
# from pprint import pprint

# import pytest
# import httpx


# @pytest.mark.asyncio
# async def test_get_all_created_quizzes(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/quiz/created")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Quizzes retrieved"
#         assert len(data["quizzes"]) == 1
#         assert data["quizzes"][0]["id"] == 1


# @pytest.mark.asyncio
# async def test_toggle_favorite_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post("/quiz/1/favorite")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "quiz fav toggled"


# @pytest.mark.asyncio
# async def test_delete_quiz_question(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.delete("/quiz/1/question/1")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Question deleted"


# @pytest.mark.asyncio
# async def test_delete_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.delete("/quiz/1")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Quiz deleted"


# @pytest.mark.asyncio
# async def test_create_new_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/quiz/new",
#             json={
#                 "quiz": {
#                     "name": "string",
#                     "numQuestions": 0,
#                     "points": 0,
#                     "category": "string",
#                     "subject": "string",
#                     "topic": "string",
#                     "timeCreated": "2022-12-31T23:59:59",
#                     "dueDate": "2022-12-31T23:59:59",
#                     "resultReveal": False,
#                     "answerReveal": False,
#                     "timeLimit": 0,
#                     "instructions": "string",
#                     "description": "string",
#                     "shuffle": False,
#                     "img": "string",
#                     "text": "string",
#                     "deckId": 0,
#                     "shareId": "string",
#                     "fav": False,
#                     "questions": [
#                         {
#                             "id": 0,
#                             "question": "string",
#                             "term": "string",
#                             "content": "string",
#                             "boc2": "string",
#                             "boc3": "string",
#                             "boc4": "string",
#                             "formula": "string",
#                             "promptOption": "string",
#                             "qType": "string",
#                             "qOrder": 0,
#                             "points": 0,
#                             "img": "string",
#                         }
#                     ],
#                     "jeopardy": False,
#                 },
#                 "questions": [
#                     {
#                         "question": "string",
#                         "term": "string",
#                         "content": "string",
#                         "boc2": "string",
#                         "boc3": "string",
#                         "boc4": "string",
#                         "formula": "string",
#                         "promptOption": "string",
#                         "qType": "string",
#                         "qOrder": 0,
#                         "points": 0,
#                     }
#                 ],
#             },
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "quiz created"
#         assert data["quizzes"][0]["id"] == 2


# @pytest.mark.asyncio
# async def test_update_one_question(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.patch(
#             "/quiz/1/question/1",
#             json={
#                 "id": 1,
#                 "question": "Updated question",
#                 "term": "Updated term",
#                 "content": "Updated content",
#                 "boc_2": "Updated boc_2",
#                 "boc_3": "Updated boc_3",
#                 "boc_4": "Updated boc_4",
#                 "formula": "Updated formula",
#                 "prompt_option": "Updated prompt_option",
#                 "q_type": "Updated q_type",
#                 "q_order": 2,
#                 "points": 10,
#                 "img": "Updated img",
#             },
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Question updated"


# @pytest.mark.asyncio
# async def test_add_question_to_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/quiz/1/question/new",
#             json={
#                 "id": 1,
#                 "question": "New question",
#                 "term": "New term",
#                 "content": "New content",
#                 "boc_2": "New boc_2",
#                 "boc_3": "New boc_3",
#                 "boc_4": "New boc_4",
#                 "formula": "New formula",
#                 "prompt_option": "New prompt_option",
#                 "q_type": "New q_type",
#                 "q_order": 2,
#                 "points": 10,
#                 "img": "New img",
#             },
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Question added"


# @pytest.mark.asyncio
# async def test_update_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.put(
#             "/quiz/1",
#             json={
#                 "id": 1,
#                 "name": "Updated quiz",
#                 "description": "Updated description",
#                 "category": "Updated category",
#                 "subject": "Updated subject",
#                 "topic": "Updated topic",
#                 "num_questions": 1,
#                 "points": 10,
#                 "deck_id": 1,
#             },
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Quiz updated"
#         assert data["quizzes"][0]["id"] == 1
#         assert data["quizzes"][0]["name"] == "Updated quiz"
#         assert data["quizzes"][0]["description"] == "Updated description"
#         assert data["quizzes"][0]["category"] == "Updated category"
#         assert data["quizzes"][0]["subject"] == "Updated subject"
#         assert data["quizzes"][0]["topic"] == "Updated topic"


# @pytest.mark.asyncio
# async def test_get_quiz_and_questions(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/quiz/1")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "quiz retrieved"
#         assert len(data["quizzes"]) == 1
#         assert len(data["questions"]) == 1
#         assert data["quizzes"][0]["id"] == 1
#         assert data["questions"][0]["id"] == 1


# ## ! Likely no longer necessary the since this is moved to the front
# # @pytest.mark.asyncio
# # async def test_download_quiz_as_pdf(mocked_app):
# #     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
# #         response = await ac.get("/quiz/1/pdf")
# #         assert response.status_code == 200
# #         assert response.headers["Content-Type"] == "application/pdf"
# #         assert (
# #             response.headers["Content-Disposition"]
# #             == "attachment; filename=output_1.pdf"
# #         )
# #         assert response.content is not None
# #         assert len(response.content) > 0
# #         assert response.content[:4] == b"%PDF"


# @pytest.mark.asyncio
# async def test_delete_questions_from_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.request(
#             "DELETE",
#             "/quiz/1/questions",
#             content=json.dumps({"ids": [1]}),
#             headers={"Content-Type": "application/json"},
#         )
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Questions deleted from quiz"


# @pytest.mark.asyncio
# async def test_take_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/quiz/1/take-quiz",
#             json={
#                 "quizId": 1,
#                 "startTime": "2022-12-31T23:59:59.000000Z",
#                 "endTime": "2022-12-31T23:59:59.000000Z",
#                 "questionAnswers": [
#                     {"testId": 1, "taker": 1, "questionId": 1, "answer": "string"}
#                 ],
#             },
#         )

#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Quiz taken"
#         assert data["quizResultId"] == 2
#         assert data["userType"] == "user"
#         assert data["userId"] == 1


# @pytest.mark.asyncio
# async def test_get_shared_quizzes_for_user(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get(
#             "/quiz/shared-quizzes",
#             headers={"Authorization": "Bearer test_token"},
#         )
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Quizzes retrieved"
#         assert len(data["quizzes"]) == 1


# @pytest.mark.asyncio
# async def test_get_share_link_for_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/quiz/1/link")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "quiz link retrieved"


# @pytest.mark.asyncio
# async def test_assign_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/quiz/1/assign", json={"emails": ["Cephadex@Cephadex2.com"]}
#         )
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "quiz assigned"


# @pytest.mark.asyncio
# async def test_get_assigned_quizzes(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/quiz/assigned")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Quizzes retrieved"
#         assert len(data["quizzes"]) == 1


# @pytest.mark.asyncio
# async def test_reject_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.delete("/quiz/assigned/1/")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Rejected quiz asisgnment"


# @pytest.mark.asyncio
# async def test_get_my_results(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/quiz/results/my-results")
#         data = response.json()
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Quiz results retrieved"
#         assert len(data["quizAndResults"]) > 0
#         assert data["quizAndResults"][0]["id"] == 1
#         assert data["quizAndResults"][0]["results"][0]["id"] == 1


# @pytest.mark.asyncio
# async def test_get_assigned_results(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/quiz/results/assigned-results")
#         data = response.json()
#         pprint(data)
#         assert response.status_code == 200
#         assert data["status"] == "success"
#         assert data["message"] == "Quiz results retrieved"
#         assert len(data["quizAndResults"]) > 0
#         assert data["quizAndResults"][0]["id"] == 1
#         assert data["quizAndResults"][0]["results"][0]["id"] == 1


# @pytest.mark.asyncio
# async def test_get_quiz_result(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/quiz/result/1/")
#         assert response.status_code == 200
#         data = response.json()
#         assert data["status"] == "success"
#         assert data["message"] == "Quiz results retrieved"
#         assert data["quiz"] is not None
#         assert data["quizResult"] is not None
#         assert data["gradedResults"] is not None
#         assert data["taker"] is not None
#         assert data["points"] is not None
#         assert data["correct"] is not None
#         assert data["userType"] is not None
#         assert data["userId"] is not None


# @pytest.mark.asyncio
# async def test_grade_quiz_manually(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         data = {
#             "quizResult": {
#                 "id": 1,
#                 "testId": 1,
#                 "taker": 1,  # Assuming there's a user with ID 2
#                 "creator": 1,  # Assuming the creator's user ID is 1
#                 "dueDate": "2022-12-31T23:59:59",
#                 "startTime": "2022-12-31T23:59:59",
#                 "endTime": "2022-12-31T23:59:59",
#                 "points": 99,
#                 "correct": 9,
#                 "blank": 9,
#                 "graded": True,
#                 "private": False,
#             },
#             "questionResults": [
#                 {
#                     "id": 1,
#                     "testId": 1,
#                     "taker": 1,
#                     "timeCreated": "2022-12-31T23:59:59",
#                     "questionId": 1,
#                     "answer": "Edited answer",
#                     "points": 2,
#                     "quizResultId": 1,
#                     "correct": True,
#                 }
#             ],
#         }
#         response = await ac.post("/quiz/1/result/1/grade", json=data)
#         data = response.json()
#         print(data)
#         assert data["status"] == "success"
#         assert data["quizResults"][0]["points"] == 99
#         assert data["questionResults"][0]["points"] == 2


# @pytest.mark.asyncio
# async def test_take_shared_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         data = {
#             "quizId": 1,
#             "startTime": "2022-12-31T23:59:59.00Z",
#             "endTime": "2022-12-31T23:59:59.00Z",
#             "questionAnswers": [
#                 {
#                     "testId": 1,
#                     "taker": 1,
#                     "questionId": 1,
#                     "answer": "The answer provided by the user for the question.",
#                 }
#             ],
#         }

#         response = await ac.post(
#             "/quiz/shared/24ffe1de-185c-425b-9173-ffd7064c2231/take-quiz", json=data
#         )
#         data = response.json()
#         print(data)
#         assert data["status"] == "success"
#         assert data["quizResultId"] == 3
#         assert data["userId"] == 1


# @pytest.mark.asyncio
# async def test_get_shared_quiz_and_questions(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/quiz/shared/24ffe1de-185c-425b-9173-ffd7064c2231")
#         data = response.json()
#         print(data)

#         assert data["status"] == "success"
#         assert data["quizzes"][0]["id"] == 1


# @pytest.mark.asyncio
# async def test_get_shared_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get(
#             "/quiz/shared-quiz/24ffe1de-185c-425b-9173-ffd7064c2231"
#         )
#         data = response.json()

#         assert data["status"] == "success"
#         assert data["data"]["quiz"]["id"] == 1
#         assert data["data"]["share"]["id"] == 1
#         assert data["data"]["results"][0]["id"] == 1


# @pytest.mark.asyncio
# async def test_get_user_results_for_quiz(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.get("/quiz/1/results")
#         data = response.json()
#         print(data)
#         assert data["status"] == "success"
