"""
Working test example using httpx.AsyncClient correctly.

This demonstrates the proper way to test FastAPI routes with the current setup.
"""

import pytest
import httpx
import asyncio


@pytest.mark.asyncio
async def test_user_endpoint_with_proper_httpx(mocked_app):
    """Test user endpoint using httpx.AsyncClient with transport."""
    transport = httpx.ASGITransport(app=mocked_app)

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/user")
        assert response.status_code == 200
        response_data = response.json()
        assert "user" in response_data


@pytest.mark.asyncio
async def test_deck_creation_with_proper_httpx(mocked_app):
    """Test deck creation using proper httpx.AsyncClient."""
    transport = httpx.ASGITransport(app=mocked_app)

    deck_data = {
        "name": "Test Deck",
        "description": "A test deck for validation"
    }

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/deck/", json=deck_data)
        assert response.status_code in [200, 201]


@pytest.mark.asyncio
async def test_user_settings_with_proper_httpx(mocked_app):
    """Test user settings endpoints."""
    transport = httpx.ASGITransport(app=mocked_app)

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Get settings
        response = await client.get("/user/settings")
        assert response.status_code == 200

        # Update settings
        settings_data = {"language": "English", "theme": "dark"}
        update_response = await client.patch("/user/settings", json=settings_data)
        assert update_response.status_code == 200


@pytest.mark.asyncio
async def test_study_cards_endpoint(mocked_app):
    """Test study system endpoint."""
    transport = httpx.ASGITransport(app=mocked_app)

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        deck_id = 1  # Assuming this exists in test data
        response = await client.post(f"/study/{deck_id}/cards-due")
        assert response.status_code in [200, 404]  # 404 if deck doesn't exist


@pytest.mark.asyncio
async def test_notifications_endpoint(mocked_app):
    """Test notifications endpoint."""
    transport = httpx.ASGITransport(app=mocked_app)

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/notifications")
        assert response.status_code == 200
        response_data = response.json()
        assert "notifications" in response_data
        assert isinstance(response_data["notifications"], list)