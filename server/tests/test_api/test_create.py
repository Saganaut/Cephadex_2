# import json
# import os
# from io import BytesIO

# import pytest
# from fastapi.testclient import TestClient


# @pytest.mark.parametrize(
#     "card_type",
#     [
#         "Definitions",
#         "Cloze",
#         "Mcq",
#         "Cloze",
#         "Translate",
#         "Rhyme",
#         "People",
#         "Comprehension",
#         "Vocab builder",
#         "Formulas",
#         "Custom",
#         "Explain",
#         "Discuss",
#     ],
# )
# def test_call_credit_counter_with_file(sync_mocked_app, card_type):
#     client = TestClient(sync_mocked_app)
#     file_content = b"This is a test file"
#     file = BytesIO(file_content)
#     file.name = "testfile.txt"
#     data = {
#         "cardTypeField": card_type,
#         "textField": "THIS IS TEXT",
#         "nameField": "test123",
#         "descriptionField": "test321",
#     }
#     data_as_json_string = json.dumps(data)

#     files = {
#         "file": (file.name, file, "text/plain"),
#         "data": (None, data_as_json_string, "application/json"),
#     }

#     response = client.post("/create/credit", files=files)

#     assert response.status_code == 200
#     response_data = response.json()
#     assert "status" in response_data
#     assert response_data["status"] == "success"
#     assert "credit" in response_data


# def create_test_payload(filename, client):
#     file_path = os.path.join(os.path.dirname(__file__), "..", "test_files", filename)
#     data = {
#         "cardTypeField": "Definitions",
#         "textField": "Sample text for testing",
#         "nameField": "testName",
#         "descriptionField": "testDescription",
#     }
#     data_as_json_string = json.dumps(data)
#     with open(file_path, "rb") as file:
#         files = {
#             "file": (filename, file, "application/octet-stream"),
#             "data": (None, data_as_json_string, "application/json"),
#         }
#         response = client.post("/create/credit", files=files)
#     return response


# @pytest.mark.parametrize(
#     "filename",
#     [
#         "pptx_sample.pptx",
#         "wav_sample_eng.wav",
#         "mp3_sample_eng.mp3",
#         "pdf_sample_150kB.pdf",
#         "pdf_ocr_sample.pdf",
#         "docx_sample_100kB.docx",
#     ],
# )
# def test_call_credit_counter_with_various_files(sync_mocked_app, filename):
#     client = TestClient(sync_mocked_app)
#     response = create_test_payload(filename, client)

#     assert response.status_code == 200
#     response_data = response.json()
#     assert "status" in response_data, f"Failed for {filename}"
#     assert response_data["status"] == "success", f"Failed for {filename}"
#     assert "credit" in response_data, f"Failed for {filename}"


# def test_call_credit_counter_custom(sync_mocked_app):
#     client = TestClient(sync_mocked_app)
#     file_content = b"This is a test file"
#     file = BytesIO(file_content)
#     file.name = "testfile.txt"
#     data = {
#         "cardTypeField": "Custom",
#         "textField": "THIS IS TEXT",
#         "nameField": "test123",
#         "descriptionField": "test321",
#         "languageField": "English",
#         "customTermField": "All the python functions",
#         "customContentField": "Explanations and examples",
#         "existingDeckField": 1,
#     }
#     data_as_json_string = json.dumps(data)

#     files = {
#         "file": (file.name, file, "text/plain"),
#         "data": (None, data_as_json_string, "application/json"),
#     }

#     response = client.post("/create/credit", files=files)

#     assert response.status_code == 200
#     response_data = response.json()
#     assert "status" in response_data
#     assert response_data["status"] == "success"
#     assert "credit" in response_data


# def test_call_credit_counter_with_link(sync_mocked_app):
#     client = TestClient(sync_mocked_app)
#     file_content = b"This is a test file"
#     file = BytesIO(file_content)
#     file.name = "testfile.txt"
#     data = {
#         "cardTypeField": "Mix",
#         "textField": "THIS IS TEXT",
#         "nameField": "test123",
#         "descriptionField": "test321",
#         "linkField": "https://en.wikipedia.org/wiki/Wikipedia:Very_short_featured_articles",
#     }
#     data_as_json_string = json.dumps(data)

#     files = {
#         "file": (file.name, file, "text/plain"),
#         "data": (None, data_as_json_string, "application/json"),
#     }

#     response = client.post("/create/credit", files=files)

#     assert response.status_code == 200
#     response_data = response.json()
#     assert "status" in response_data
#     assert response_data["status"] == "success"
#     assert "credit" in response_data


# def test_call_credit_counter_with_youtube_link(sync_mocked_app):
#     client = TestClient(sync_mocked_app)
#     file_content = b"This is a test file"
#     file = BytesIO(file_content)
#     file.name = "testfile.txt"
#     data = {
#         "cardTypeField": "Mix",
#         "textField": "THIS IS TEXT",
#         "nameField": "test123",
#         "descriptionField": "test321",
#         "linkField": "https://www.youtube.com/watch?v=JGz7Ou0Nwo8",
#     }
#     data_as_json_string = json.dumps(data)

#     files = {
#         "file": (file.name, file, "text/plain"),
#         "data": (None, data_as_json_string, "application/json"),
#     }

#     response = client.post("/create/credit", files=files)

#     assert response.status_code == 200
#     response_data = response.json()
#     assert "status" in response_data
#     assert response_data["status"] == "success"
#     assert "credit" in response_data
