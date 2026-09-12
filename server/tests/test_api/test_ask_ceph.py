# import json
# from pprint import pprint

# import pytest
# import httpx


# @pytest.mark.asyncio
# async def test_ask(mocked_app):
#     async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
#         response = await ac.post(
#             "/ask-ceph/wrong",
#             json={
#                 "cardId": 1,
#                 "question": "Why is this wrong?",
#                 "latestParagraph": "This is the latest paragraph.",
#             },
#         )
#         assert response.status_code == 200

#         result = await response.aread()
#         result_text = result.decode("utf-8")
#         assert result_text is not None

#         response = await ac.post(
#             "/ask-ceph/explain",
#             json={
#                 "cardId": 1,
#                 "question": "Why is this wrong?",
#                 "latestParagraph": "This is the latest paragraph.",
#             },
#         )

#         result = await response.aread()
#         result_text = result.decode("utf-8")
#         assert result_text is not None

#         response = await ac.post(
#             "/ask-ceph/question",
#             json={
#                 "cardId": 1,
#                 "question": "Why is this wrong?",
#                 "latestParagraph": "This is the latest paragraph.",
#             },
#         )

#         result = await response.aread()
#         result_text = result.decode("utf-8")
#         assert result_text is not None
