"""
Comprehensive test suite for AI-powered endpoints.

This module tests AI-related endpoints including:
- Ask Ceph chatbot (/ask-ceph)
- Content creation from files/URLs (/create)
- AI-powered flashcard generation
- Credit calculation and usage

Tests use mocked AI services and external dependencies.
"""

import io
import json
from unittest.mock import AsyncMock, Mock, patch

import pytest
import httpx


@pytest.mark.asyncio
async def test_ask_ceph_question_type(mocked_app):
    """Test asking Ceph AI a question via POST /ask-ceph/question."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        question_data = {
            "question": "What is the capital of France?",
            "context": "geography",
            "deck_id": 1
        }

        with patch("routes.ask_ceph.ask_ceph.call_ai_service") as mock_ai:
            mock_ai.return_value = {
                "answer": "The capital of France is Paris.",
                "confidence": 0.95,
                "sources": []
            }

            response = await client.post("/ask-ceph/question", json=question_data)
            assert response.status_code == 200
            response_data = response.json()
            assert "answer" in response_data
            assert "Paris" in response_data["answer"]


@pytest.mark.asyncio
async def test_ask_ceph_wrong_type(mocked_app):
    """Test asking Ceph to explain what's wrong via POST /ask-ceph/wrong."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        wrong_data = {
            "user_answer": "Berlin",
            "correct_answer": "Paris",
            "question": "What is the capital of France?",
            "card_id": 1
        }

        with patch("routes.ask_ceph.ask_ceph.call_ai_service") as mock_ai:
            mock_ai.return_value = {
                "explanation": "Berlin is the capital of Germany, not France. Paris is the correct capital of France.",
                "tip": "Remember that major European cities are often confused."
            }

            response = await client.post("/ask-ceph/wrong", json=wrong_data)
            assert response.status_code == 200
            response_data = response.json()
            assert "explanation" in response_data or "answer" in response_data


@pytest.mark.asyncio
async def test_ask_ceph_explain_type(mocked_app):
    """Test asking Ceph to explain an answer via POST /ask-ceph/explain."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        explain_data = {
            "question": "What is photosynthesis?",
            "answer": "The process by which plants make food using sunlight",
            "card_id": 1
        }

        with patch("routes.ask_ceph.ask_ceph.call_ai_service") as mock_ai:
            mock_ai.return_value = {
                "explanation": "Photosynthesis is a complex biological process where plants convert light energy into chemical energy...",
                "details": "The process involves chlorophyll, carbon dioxide, and water."
            }

            response = await client.post("/ask-ceph/explain", json=explain_data)
            assert response.status_code == 200
            response_data = response.json()
            assert "explanation" in response_data or "answer" in response_data


@pytest.mark.asyncio
async def test_ask_ceph_cephadex_type(mocked_app):
    """Test asking Ceph about Cephadex platform via POST /ask-ceph/cephadex."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        cephadex_data = {
            "question": "How do I create a new deck?",
            "context": "platform_help"
        }

        with patch("routes.ask_ceph.ask_ceph.call_ai_service") as mock_ai:
            mock_ai.return_value = {
                "answer": "To create a new deck, click the 'New Deck' button and fill in the required information.",
                "steps": ["Navigate to decks page", "Click New Deck", "Enter deck details"]
            }

            response = await client.post("/ask-ceph/cephadex", json=cephadex_data)
            assert response.status_code == 200
            response_data = response.json()
            assert "answer" in response_data


@pytest.mark.asyncio
async def test_ask_ceph_files_type(mocked_app):
    """Test asking Ceph about files via POST /ask-ceph/files."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        files_data = {
            "question": "Summarize this document",
            "file_id": 1,
            "file_content": "This is a sample document about artificial intelligence..."
        }

        with patch("routes.ask_ceph.ask_ceph.call_ai_service") as mock_ai:
            mock_ai.return_value = {
                "summary": "This document discusses artificial intelligence concepts and applications.",
                "key_points": ["AI definition", "Applications", "Future implications"]
            }

            response = await client.post("/ask-ceph/files", json=files_data)
            assert response.status_code == 200
            response_data = response.json()
            assert "answer" in response_data or "summary" in response_data


@pytest.mark.asyncio
async def test_ask_ceph_invalid_type(mocked_app):
    """Test asking Ceph with invalid question type."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/ask-ceph/invalid_type", json={"question": "test"})
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_ask_ceph_empty_question(mocked_app):
    """Test asking Ceph with empty question."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        empty_data = {"question": ""}

        response = await client.post("/ask-ceph/question", json=empty_data)
        assert response.status_code in [400, 422]


@pytest.mark.asyncio
async def test_create_content_from_text(mocked_app):
    """Test content creation from text via POST /create/."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        create_data = {
            "content_type": "text",
            "content": "Photosynthesis is the process by which plants make food using sunlight, water, and carbon dioxide.",
            "extraction_type": "flashcards",
            "deck_name": "Biology Basics",
            "num_cards": 3
        }

        with patch("routes.create.create.process_content") as mock_process:
            mock_process.return_value = {
                "cards": [
                    {"question": "What is photosynthesis?", "answer": "Process by which plants make food"},
                    {"question": "What do plants need for photosynthesis?", "answer": "Sunlight, water, CO2"}
                ],
                "deck_id": 1
            }

            response = await client.post("/create/", json=create_data)
            assert response.status_code == 200
            response_data = response.json()
            assert "cards" in response_data or "deck_id" in response_data


@pytest.mark.asyncio
async def test_create_content_from_url(mocked_app):
    """Test content creation from URL via POST /create/."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        create_data = {
            "content_type": "url",
            "url": "https://example.com/article-about-science",
            "extraction_type": "notes",
            "deck_name": "Science Articles"
        }

        with patch("routes.create.create.extract_from_url") as mock_extract:
            mock_extract.return_value = {
                "content": "Article content about scientific concepts...",
                "title": "Science Article"
            }

            with patch("routes.create.create.process_content") as mock_process:
                mock_process.return_value = {
                    "notes": "Key points from the science article...",
                    "deck_id": 1
                }

                response = await client.post("/create/", json=create_data)
                assert response.status_code == 200
                response_data = response.json()
                assert "notes" in response_data or "deck_id" in response_data


@pytest.mark.asyncio
async def test_create_content_from_file(mocked_app):
    """Test content creation from uploaded file via POST /create/."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a mock PDF file
        pdf_content = b"Mock PDF content with educational material"
        files = {
            "file": ("document.pdf", io.BytesIO(pdf_content), "application/pdf")
        }

        data = {
            "extraction_type": "flashcards",
            "deck_name": "PDF Study Deck",
            "num_cards": "5"
        }

        with patch("routes.create.create.extract_from_file") as mock_extract:
            mock_extract.return_value = {
                "content": "Extracted text from PDF document...",
                "file_type": "pdf"
            }

            with patch("routes.create.create.process_content") as mock_process:
                mock_process.return_value = {
                    "cards": [
                        {"question": "Q1", "answer": "A1"},
                        {"question": "Q2", "answer": "A2"}
                    ],
                    "deck_id": 1
                }

                response = await client.post("/create/", files=files, data=data)
                assert response.status_code == 200
                response_data = response.json()
                assert "cards" in response_data or "deck_id" in response_data


@pytest.mark.asyncio
async def test_create_content_invalid_file_type(mocked_app):
    """Test content creation with unsupported file type."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create an unsupported file type
        files = {
            "file": ("document.xyz", io.BytesIO(b"unsupported content"), "application/xyz")
        }

        data = {
            "extraction_type": "flashcards",
            "deck_name": "Test Deck"
        }

        response = await client.post("/create/", files=files, data=data)
        assert response.status_code in [400, 415]  # Bad request or unsupported media type


@pytest.mark.asyncio
async def test_calculate_credit_cost(mocked_app):
    """Test calculating credit cost for extraction via POST /create/credit."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        credit_data = {
            "content_type": "text",
            "content_length": 1000,
            "extraction_type": "flashcards",
            "num_cards": 10
        }

        with patch("routes.create.create.calculate_credit_cost") as mock_calculate:
            mock_calculate.return_value = {
                "estimated_cost": 25,
                "base_cost": 20,
                "complexity_multiplier": 1.25
            }

            response = await client.post("/create/credit", json=credit_data)
            assert response.status_code == 200
            response_data = response.json()
            assert "cost" in response_data or "estimated_cost" in response_data


@pytest.mark.asyncio
async def test_create_content_insufficient_credits(mocked_app):
    """Test content creation with insufficient user credits."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        create_data = {
            "content_type": "text",
            "content": "Large amount of content that requires many credits...",
            "extraction_type": "flashcards",
            "num_cards": 100  # Requires many credits
        }

        with patch("routes.create.create.check_user_credits") as mock_credits:
            mock_credits.return_value = False  # Insufficient credits

            response = await client.post("/create/", json=create_data)
            assert response.status_code in [400, 402, 403]  # Payment required or forbidden


@pytest.mark.asyncio
async def test_ai_service_error_handling(mocked_app):
    """Test handling of AI service errors."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        question_data = {"question": "Test question"}

        with patch("routes.ask_ceph.ask_ceph.call_ai_service") as mock_ai:
            mock_ai.side_effect = Exception("AI service unavailable")

            response = await client.post("/ask-ceph/question", json=question_data)
            assert response.status_code == 500


@pytest.mark.asyncio
async def test_create_content_validation():
    """Test content creation input validation."""
    from fastapi import FastAPI
    import httpx

    app = FastAPI()
    from routes.create.create import router as create_router
    app.include_router(create_router)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Test with missing required fields
        invalid_data = {
            "content_type": "text"
            # Missing content and other required fields
        }

        response = await client.post("/create/", json=invalid_data)
        assert response.status_code in [400, 422]


@pytest.mark.asyncio
async def test_ask_ceph_rate_limiting(mocked_app):
    """Test Ask Ceph rate limiting (if implemented)."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        question_data = {"question": "Test question for rate limiting"}

        with patch("routes.ask_ceph.ask_ceph.call_ai_service") as mock_ai:
            mock_ai.return_value = {"answer": "Test answer"}

            # Make multiple rapid requests
            responses = []
            for i in range(5):
                response = await client.post("/ask-ceph/question", json=question_data)
                responses.append(response)

            # Most should succeed, but rate limiting might kick in
            success_count = sum(1 for r in responses if r.status_code == 200)
            assert success_count >= 1  # At least one should succeed


@pytest.mark.asyncio
async def test_create_content_large_file(mocked_app):
    """Test content creation with large file."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a large mock file
        large_content = b"x" * (5 * 1024 * 1024)  # 5MB file
        files = {
            "file": ("large_document.pdf", io.BytesIO(large_content), "application/pdf")
        }

        data = {
            "extraction_type": "notes",
            "deck_name": "Large Document"
        }

        with patch("routes.create.create.extract_from_file") as mock_extract:
            mock_extract.return_value = {"content": "Extracted content", "file_type": "pdf"}

            response = await client.post("/create/", files=files, data=data)
            # Should either succeed or fail gracefully with size limits
            assert response.status_code in [200, 400, 413]


@pytest.mark.asyncio
async def test_concurrent_ai_requests(mocked_app):
    """Test concurrent AI requests handling."""
    import asyncio

    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        question_data = {"question": "Concurrent test question"}

        with patch("routes.ask_ceph.ask_ceph.call_ai_service") as mock_ai:
            mock_ai.return_value = {"answer": "Concurrent answer"}

            # Make concurrent requests
            async def make_ai_request():
                return await client.post("/ask-ceph/question", json=question_data)

            tasks = [make_ai_request() for _ in range(3)]
            responses = await asyncio.gather(*tasks)

            # All should complete successfully
            for response in responses:
                assert response.status_code == 200


@pytest.mark.asyncio
async def test_ai_response_consistency(mocked_app):
    """Test consistency of AI responses."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        question_data = {"question": "What is 2+2?"}

        with patch("routes.ask_ceph.ask_ceph.call_ai_service") as mock_ai:
            mock_ai.return_value = {"answer": "4", "confidence": 1.0}

            response1 = await client.post("/ask-ceph/question", json=question_data)
            response2 = await client.post("/ask-ceph/question", json=question_data)

            assert response1.status_code == 200
            assert response2.status_code == 200

            # Responses should have consistent structure
            data1 = response1.json()
            data2 = response2.json()
            assert "answer" in data1
            assert "answer" in data2