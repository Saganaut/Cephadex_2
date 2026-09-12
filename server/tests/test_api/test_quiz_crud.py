"""
Comprehensive test suite for Quiz CRUD operations (/quiz).

This module tests core quiz management endpoints including:
- Creating, reading, updating, and deleting quizzes
- Question management within quizzes
- Quiz favorites and sharing
- Taking quizzes and results
- Quiz assignment and collaboration

Tests use SQLite in-memory database and mocked external dependencies.
"""

import json
from unittest.mock import AsyncMock, Mock, patch

import pytest
import httpx

from tests.test_api.data.test_data import test_quiz_dict, test_question_dict


@pytest.mark.asyncio
async def test_get_all_created_quizzes(mocked_app):
    """Test getting all user-created quizzes via GET /quiz/created."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/quiz/created")
        assert response.status_code == 200
        response_data = response.json()
        assert "quizzes" in response_data
        assert isinstance(response_data["quizzes"], list)


@pytest.mark.asyncio
async def test_create_new_quiz(mocked_app):
    """Test creating a new quiz via POST /quiz/new."""
    quiz_data = {
        "title": "Test Quiz",
        "description": "A comprehensive test quiz",
        "time_limit": 30,
        "is_public": False,
        "randomize_questions": True
    }

    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/quiz/new", json=quiz_data)
        assert response.status_code == 201
        response_data = response.json()
        assert "quiz" in response_data
        assert response_data["quiz"]["title"] == quiz_data["title"]
        assert "id" in response_data["quiz"]


@pytest.mark.asyncio
async def test_create_quiz_validation():
    """Test quiz creation with invalid data."""
    from fastapi import FastAPI
    import httpx

    app = FastAPI()
    from routes.quiz.quiz import router as quiz_router
    app.include_router(quiz_router)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Test with invalid data
        invalid_quiz = {
            "title": "",  # Empty title
            "time_limit": -5  # Negative time limit
        }
        response = await client.post("/quiz/new", json=invalid_quiz)
        assert response.status_code in [400, 422]


@pytest.mark.asyncio
async def test_get_quiz_and_questions(mocked_app):
    """Test getting quiz with questions via GET /quiz/{quiz_id}."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a quiz first
        quiz_data = {"title": "Get Quiz Test", "description": "Test quiz for getting"}
        create_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = create_response.json()["quiz"]["id"]

        # Get the quiz
        response = await client.get(f"/quiz/{quiz_id}")
        assert response.status_code == 200
        response_data = response.json()
        assert "quiz" in response_data
        assert response_data["quiz"]["id"] == quiz_id


@pytest.mark.asyncio
async def test_get_nonexistent_quiz(mocked_app):
    """Test getting a non-existent quiz."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/quiz/99999")
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_quiz(mocked_app):
    """Test updating quiz information via PUT /quiz/{quiz_id}."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a quiz first
        quiz_data = {"title": "Original Quiz", "description": "Original description"}
        create_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = create_response.json()["quiz"]["id"]

        # Update the quiz
        update_data = {
            "title": "Updated Quiz Title",
            "description": "Updated description",
            "time_limit": 45
        }
        response = await client.put(f"/quiz/{quiz_id}", json=update_data)
        assert response.status_code == 200
        response_data = response.json()
        assert response_data["quiz"]["title"] == update_data["title"]


@pytest.mark.asyncio
async def test_delete_quiz(mocked_app):
    """Test deleting a quiz via DELETE /quiz/{quiz_id}."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a quiz first
        quiz_data = {"title": "Quiz to Delete", "description": "Will be deleted"}
        create_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = create_response.json()["quiz"]["id"]

        # Delete the quiz
        response = await client.delete(f"/quiz/{quiz_id}")
        assert response.status_code == 200
        response_data = response.json()
        assert "deleted" in response_data["message"].lower()

        # Verify quiz is deleted
        get_response = await client.get(f"/quiz/{quiz_id}")
        assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_toggle_favorite_quiz(mocked_app):
    """Test toggling quiz favorite status via POST /quiz/{quiz_id}/favorite."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a quiz first
        quiz_data = {"title": "Favorite Test Quiz", "description": "For favorite testing"}
        create_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = create_response.json()["quiz"]["id"]

        # Toggle favorite
        response = await client.post(f"/quiz/{quiz_id}/favorite")
        assert response.status_code == 200
        response_data = response.json()
        assert "favorite" in response_data or "liked" in response_data


@pytest.mark.asyncio
async def test_add_question_to_quiz(mocked_app):
    """Test adding a question to quiz via POST /quiz/{quiz_id}/question/new."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a quiz first
        quiz_data = {"title": "Question Test Quiz", "description": "For question testing"}
        create_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = create_response.json()["quiz"]["id"]

        # Add a question
        question_data = {
            "question_text": "What is the capital of France?",
            "question_type": "multiple_choice",
            "correct_answer": "Paris",
            "options": ["London", "Paris", "Berlin", "Madrid"],
            "points": 10
        }
        response = await client.post(f"/quiz/{quiz_id}/question/new", json=question_data)
        assert response.status_code == 201
        response_data = response.json()
        assert "question" in response_data
        assert response_data["question"]["question_text"] == question_data["question_text"]


@pytest.mark.asyncio
async def test_update_single_question(mocked_app):
    """Test updating a single question via PATCH /quiz/{quiz_id}/question/{question_id}."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create quiz and question
        quiz_data = {"title": "Update Question Quiz", "description": "For question updating"}
        quiz_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = quiz_response.json()["quiz"]["id"]

        question_data = {
            "question_text": "Original Question",
            "question_type": "multiple_choice",
            "correct_answer": "A",
            "options": ["A", "B", "C", "D"]
        }
        question_response = await client.post(f"/quiz/{quiz_id}/question/new", json=question_data)
        question_id = question_response.json()["question"]["id"]

        # Update the question
        updated_question = {
            "question_text": "Updated Question Text",
            "correct_answer": "B",
            "points": 15
        }
        response = await client.patch(f"/quiz/{quiz_id}/question/{question_id}", json=updated_question)
        assert response.status_code == 200
        response_data = response.json()
        assert response_data["question"]["question_text"] == updated_question["question_text"]


@pytest.mark.asyncio
async def test_delete_quiz_question(mocked_app):
    """Test deleting a question from quiz via DELETE /quiz/{quiz_id}/question/{question_id}."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create quiz and question
        quiz_data = {"title": "Delete Question Quiz", "description": "For question deletion"}
        quiz_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = quiz_response.json()["quiz"]["id"]

        question_data = {
            "question_text": "Question to Delete",
            "question_type": "true_false",
            "correct_answer": "True"
        }
        question_response = await client.post(f"/quiz/{quiz_id}/question/new", json=question_data)
        question_id = question_response.json()["question"]["id"]

        # Delete the question
        response = await client.delete(f"/quiz/{quiz_id}/question/{question_id}")
        assert response.status_code == 200
        response_data = response.json()
        assert "deleted" in response_data["message"].lower()


@pytest.mark.asyncio
async def test_delete_multiple_questions(mocked_app):
    """Test deleting multiple questions via DELETE /quiz/{quiz_id}/questions."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create quiz with multiple questions
        quiz_data = {"title": "Multi Delete Quiz", "description": "For multiple question deletion"}
        quiz_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = quiz_response.json()["quiz"]["id"]

        question_ids = []
        for i in range(3):
            question_data = {
                "question_text": f"Question {i+1}",
                "question_type": "short_answer",
                "correct_answer": f"Answer {i+1}"
            }
            question_response = await client.post(f"/quiz/{quiz_id}/question/new", json=question_data)
            question_ids.append(question_response.json()["question"]["id"])

        # Delete multiple questions
        delete_data = {"question_ids": question_ids}
        response = await client.delete(f"/quiz/{quiz_id}/questions", json=delete_data)
        assert response.status_code == 200
        response_data = response.json()
        assert "deleted" in response_data["message"].lower()


@pytest.mark.asyncio
async def test_take_quiz_creator(mocked_app):
    """Test creator taking their own quiz via POST /quiz/{quiz_id}/take-quiz."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create quiz with questions
        quiz_data = {"title": "Take Quiz Test", "description": "For quiz taking"}
        quiz_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = quiz_response.json()["quiz"]["id"]

        # Add a question
        question_data = {
            "question_text": "Test Question",
            "question_type": "multiple_choice",
            "correct_answer": "A",
            "options": ["A", "B", "C", "D"]
        }
        await client.post(f"/quiz/{quiz_id}/question/new", json=question_data)

        # Take the quiz
        answers_data = {
            "answers": [{"question_id": 1, "answer": "A"}],
            "time_taken": 120
        }
        response = await client.post(f"/quiz/{quiz_id}/take-quiz", json=answers_data)
        assert response.status_code == 200
        response_data = response.json()
        assert "result" in response_data or "score" in response_data


@pytest.mark.asyncio
async def test_get_share_link_for_quiz(mocked_app):
    """Test getting quiz sharing link via GET /quiz/{quiz_id}/link."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a quiz first
        quiz_data = {"title": "Share Link Quiz", "description": "For sharing link test"}
        create_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = create_response.json()["quiz"]["id"]

        # Get share link
        response = await client.get(f"/quiz/{quiz_id}/link")
        assert response.status_code == 200
        response_data = response.json()
        assert "link" in response_data or "url" in response_data or "qr_code" in response_data


@pytest.mark.asyncio
async def test_assign_quiz(mocked_app):
    """Test assigning quiz to users via POST /quiz/{quiz_id}/assign."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a quiz first
        quiz_data = {"title": "Assignment Quiz", "description": "For assignment testing"}
        create_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = create_response.json()["quiz"]["id"]

        # Assign the quiz
        assignment_data = {
            "user_emails": ["student1@test.com", "student2@test.com"],
            "due_date": "2024-12-31T23:59:59",
            "message": "Please complete this quiz by the due date"
        }
        response = await client.post(f"/quiz/{quiz_id}/assign", json=assignment_data)
        assert response.status_code == 200
        response_data = response.json()
        assert "assigned" in response_data["message"].lower() or "success" in response_data["status"].lower()


@pytest.mark.asyncio
async def test_get_assigned_quizzes(mocked_app):
    """Test getting assigned quizzes via GET /quiz/assigned."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/quiz/assigned")
        # This endpoint is marked as deprecated in the API catalog
        assert response.status_code in [200, 410]  # 410 for Gone if deprecated


@pytest.mark.asyncio
async def test_get_shared_quizzes_for_user(mocked_app):
    """Test getting shared quizzes via GET /quiz/shared-quizzes."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/quiz/shared-quizzes")
        assert response.status_code == 200
        response_data = response.json()
        assert "quizzes" in response_data or "shared_quizzes" in response_data


@pytest.mark.asyncio
async def test_reject_quiz_assignment(mocked_app):
    """Test rejecting quiz assignment via DELETE /quiz/assigned/{quiz_id}/."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        quiz_id = 1  # Assuming quiz with ID 1 exists in test data

        response = await client.delete(f"/quiz/assigned/{quiz_id}/")
        assert response.status_code in [200, 404]  # 404 if no assignment exists


@pytest.mark.asyncio
async def test_quiz_question_types(mocked_app):
    """Test creating questions with different question types."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a quiz
        quiz_data = {"title": "Question Types Quiz", "description": "Testing different question types"}
        quiz_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = quiz_response.json()["quiz"]["id"]

        # Test different question types
        question_types = [
            {
                "question_text": "Multiple Choice Question",
                "question_type": "multiple_choice",
                "correct_answer": "B",
                "options": ["A", "B", "C", "D"]
            },
            {
                "question_text": "True or False Question",
                "question_type": "true_false",
                "correct_answer": "True"
            },
            {
                "question_text": "Short Answer Question",
                "question_type": "short_answer",
                "correct_answer": "Expected answer"
            }
        ]

        for question_data in question_types:
            response = await client.post(f"/quiz/{quiz_id}/question/new", json=question_data)
            assert response.status_code == 201
            assert response.json()["question"]["question_type"] == question_data["question_type"]


@pytest.mark.asyncio
async def test_quiz_operations_consistency(mocked_app):
    """Test that quiz operations maintain data consistency."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create quiz with questions
        quiz_data = {"title": "Consistency Test Quiz", "description": "For consistency testing"}
        quiz_response = await client.post("/quiz/new", json=quiz_data)
        quiz_id = quiz_response.json()["quiz"]["id"]

        # Add multiple questions
        for i in range(3):
            question_data = {
                "question_text": f"Consistency Question {i+1}",
                "question_type": "multiple_choice",
                "correct_answer": "A",
                "options": ["A", "B", "C", "D"]
            }
            question_response = await client.post(f"/quiz/{quiz_id}/question/new", json=question_data)
            assert question_response.status_code == 201

        # Get quiz with questions
        quiz_get_response = await client.get(f"/quiz/{quiz_id}")
        assert quiz_get_response.status_code == 200
        quiz_data_response = quiz_get_response.json()

        # Should contain the quiz and its questions
        assert "quiz" in quiz_data_response

        # Delete quiz should handle all questions
        delete_response = await client.delete(f"/quiz/{quiz_id}")
        assert delete_response.status_code == 200