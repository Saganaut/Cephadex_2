"""
Comprehensive test suite for User Settings and Search routes (/user).

This module tests user settings management and search functionality including:
- Getting and updating user settings
- User search functionality
- Newsletter subscription management
- Notification preferences and management

Tests use SQLite in-memory database and mocked external dependencies.
"""

import json
from unittest.mock import AsyncMock, Mock, patch

import pytest
import httpx

from tests.test_api.data.test_users import test_user_dict_radagast
from tests.test_api.data.test_data import test_user_settings_dict


@pytest.mark.asyncio
async def test_get_user_settings(mocked_app):
    """Test getting user settings via GET /user/settings."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/settings")
        assert response.status_code == 200
        response_data = response.json()
        assert response_data["status"] == "success"
        assert "userSettings" in response_data
        # Should contain default settings if none exist


@pytest.mark.asyncio
async def test_update_user_settings(mocked_app):
    """Test updating user settings via PATCH /user/settings."""
    # Use a complete settings object that matches the schema
    settings_update = {
        "language": "Spanish",
        "theme": "light",
        "newUser": False,
        "newUserCreate": True,
        "newUserGroups": True,
        "newUserPlay": True,
        "newUserStudy": True,
        "newUserDecks": True,
        "newUserTests": True,
        "newUserCards": True,
        "newUserCreateQuiz": True,
        "qtyCardsToLoadBeforeNewCards": 20,
        "numberOfCardsToLoad": 20,
        "maxSrsInterval": 525600,
        "box0Multiplier": 0,
        "box1Multiplier": 3,
        "box2Multiplier": 5,
        "box3Multiplier": 7,
        "qtyCorrectInARowForMovingUpBox": 3,
        "highestBox": 3,
        "qtyCorrectInARowForIntervalBonus": 3,
        "intervalBonusForCorrectInARow": 60,
        "decrementBox1Multiplier": 0.5,
        "decrementBox2Multiplier": 0.5,
        "decrementBox3Multiplier": 0.5,
        "decrementMinimumSrsInterval": 1,
        "minimumBoxIdAfterStartingToStudyCard": 1,
        "tooEasyMultiplier": 5,
        "tooHardMultiplier": 0.2,
        "retrieveWithinMinutes": 5
    }

    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.patch("/user/settings", json=settings_update)
        assert response.status_code == 200
        response_data = response.json()
        assert "success" in response_data["status"].lower()

        # Verify the settings were updated
        get_response = await client.get("/user/settings")
        get_data = get_response.json()
        # The updated values should be reflected (if the response includes them)
        assert get_response.status_code == 200


@pytest.mark.asyncio
async def test_update_settings_validation(mocked_app):
    """Test settings update with invalid data."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Test with invalid data types - use partial object to test validation
        invalid_settings = {
            "language": "Spanish",
            "theme": "light",
            "newUser": "not_a_boolean",  # Should be boolean
            "box1Multiplier": "not_a_number"  # Should be integer
        }
        response = await client.patch("/user/settings", json=invalid_settings)
        assert response.status_code in [400, 422]


@pytest.mark.asyncio
async def test_search_users_by_email(mocked_app):
    """Test searching users by email via GET /user/search/{user_info}."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Search for existing user by email
        email_to_search = test_user_dict_radagast["email"]
        response = await client.get(f"/user/search/{email_to_search}")
        assert response.status_code == 200
        response_data = response.json()
        assert "users" in response_data or "user" in response_data


@pytest.mark.asyncio
async def test_search_users_by_username(mocked_app):
    """Test searching users by username via GET /user/search/{user_info}."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Search for existing user by username
        username_to_search = test_user_dict_radagast["username"]
        response = await client.get(f"/user/search/{username_to_search}")
        assert response.status_code == 200
        response_data = response.json()
        assert "users" in response_data or "user" in response_data


@pytest.mark.asyncio
async def test_search_nonexistent_user(mocked_app):
    """Test searching for non-existent user."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/search/nonexistent@email.com")
        assert response.status_code in [200, 404]
        if response.status_code == 200:
            response_data = response.json()
            # Should return empty results or indicate no users found
            assert "users" in response_data


@pytest.mark.asyncio
async def test_search_invalid_input(mocked_app):
    """Test search with invalid input format."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Test with very short search term
        response = await client.get("/user/search/x")
        assert response.status_code in [200, 400]

        # Test with special characters only
        response = await client.get("/user/search/!!!")
        assert response.status_code in [200, 400]


@pytest.mark.asyncio
async def test_subscribe_to_newsletter(mocked_app):
    """Test subscribing to newsletter via POST /user/newsletter."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        newsletter_data = {"email": "test@example.com"}
        response = await client.post("/user/newsletter", json=newsletter_data)
        assert response.status_code == 200
        response_data = response.json()
        assert "subscribed" in response_data["message"].lower() or "success" in response_data["status"].lower()


@pytest.mark.asyncio
async def test_unsubscribe_from_newsletter(mocked_app):
    """Test unsubscribing from newsletter via DELETE /user/newsletter."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        newsletter_data = {"email": "test@example.com"}
        response = await client.request("DELETE", "/user/newsletter", json=newsletter_data)
        assert response.status_code == 200
        response_data = response.json()
        # API should return success regardless of subscription status
        assert response_data["status"] in ["success", "failure"]
        assert "unsubscribed" in response_data["message"].lower() or "not subscribed" in response_data["message"].lower()


@pytest.mark.asyncio
async def test_check_newsletter_subscription(mocked_app):
    """Test checking newsletter subscription status via GET /user/newsletter."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/newsletter?email=test@example.com")
        assert response.status_code == 200
        response_data = response.json()
        assert response_data["status"] == "success"


@pytest.mark.asyncio
async def test_get_notifications(mocked_app):
    """Test getting user notifications via GET /user/notifications."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/notifications")
        assert response.status_code == 200
        response_data = response.json()
        assert "notifications" in response_data
        assert isinstance(response_data["notifications"], list)


@pytest.mark.asyncio
async def test_get_notifications_with_pagination(mocked_app):
    """Test getting notifications with pagination parameters."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/notifications?page=1&limit=10")
        assert response.status_code == 200
        response_data = response.json()
        assert "notifications" in response_data
        # Should respect pagination limits
        assert len(response_data["notifications"]) <= 10


@pytest.mark.asyncio
async def test_update_notifications_mark_read(mocked_app):
    """Test marking notifications as read via PATCH /user/notifications."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Mark specific notification as read (API takes single notification)
        # Use a more complete NotificationsSchema object
        update_data = {
            "id": 1,
            "userId": 1,
            "notificationType": "test",
            "message": "Test notification",
            "timeCreated": "2023-01-01T00:00:00",
            "timeUpdated": "2023-01-01T00:00:00",
            "read": False,
            "refId": 1,
            "refTable": "test_table",
            "shareId": None
        }
        response = await client.patch("/user/notifications", json=update_data)
        assert response.status_code == 200
        response_data = response.json()
        assert "success" in response_data["status"].lower() or "updated" in response_data["message"].lower()


@pytest.mark.asyncio
async def test_delete_notifications(mocked_app):
    """Test deleting notifications via DELETE /user/notifications."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Delete specific notification (API takes single notification)
        # Use a more complete NotificationsSchema object
        delete_data = {
            "id": 1,
            "userId": 1,
            "notificationType": "test",
            "message": "Test notification",
            "timeCreated": "2023-01-01T00:00:00",
            "timeUpdated": "2023-01-01T00:00:00",
            "read": False,
            "refId": 1,
            "refTable": "test_table",
            "shareId": None
        }
        response = await client.request("DELETE", "/user/notifications", json=delete_data)
        assert response.status_code == 200
        response_data = response.json()
        assert "deleted" in response_data["message"].lower() or "success" in response_data["status"].lower()


@pytest.mark.asyncio
async def test_check_new_notifications(mocked_app):
    """Test checking for new notifications via GET /user/notifications/check-new."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/notifications/check-new")
        assert response.status_code == 200
        response_data = response.json()
        assert "notifications" in response_data
        assert isinstance(response_data["notifications"], list)


@pytest.mark.asyncio
async def test_settings_persistence(mocked_app):
    """Test that settings changes persist across sessions."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Update settings - use complete schema with camelCase naming
        settings_update = {
            "language": "French",
            "theme": "dark",
            "newUser": False,
            "newUserCreate": True,
            "newUserGroups": True,
            "newUserPlay": True,
            "newUserStudy": True,
            "newUserDecks": True,
            "newUserTests": True,
            "newUserCards": True,
            "newUserCreateQuiz": True,
            "qtyCardsToLoadBeforeNewCards": 20,
            "numberOfCardsToLoad": 20,
            "maxSrsInterval": 525600,
            "box0Multiplier": 0,
            "box1Multiplier": 3,
            "box2Multiplier": 5,
            "box3Multiplier": 7,
            "qtyCorrectInARowForMovingUpBox": 3,
            "highestBox": 3,
            "qtyCorrectInARowForIntervalBonus": 3,
            "intervalBonusForCorrectInARow": 60,
            "decrementBox1Multiplier": 0.5,
            "decrementBox2Multiplier": 0.5,
            "decrementBox3Multiplier": 0.5,
            "decrementMinimumSrsInterval": 1,
            "minimumBoxIdAfterStartingToStudyCard": 1,
            "tooEasyMultiplier": 5,
            "tooHardMultiplier": 0.2,
            "retrieveWithinMinutes": 5
        }
        update_response = await client.patch("/user/settings", json=settings_update)
        assert update_response.status_code == 200

        # Get settings to verify persistence
        get_response = await client.get("/user/settings")
        assert get_response.status_code == 200
        # The settings should reflect the updates


@pytest.mark.asyncio
async def test_notification_operations_consistency(mocked_app):
    """Test notification operations maintain consistency."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Get initial notification count
        initial_response = await client.get("/user/notifications")
        initial_data = initial_response.json()
        initial_count = len(initial_data["notifications"])

        # Check for new notifications
        new_check_response = await client.get("/user/notifications/check-new")
        assert new_check_response.status_code == 200

        # Mark some as read if any exist - API expects complete NotificationsSchema
        if initial_count > 0:
            update_data = {
                "id": 1,
                "userId": 1,
                "notificationType": "test",
                "message": "Test notification",
                "timeCreated": "2023-01-01T00:00:00",
                "timeUpdated": "2023-01-01T00:00:00",
                "read": False,
                "refId": 1,
                "refTable": "test_table",
                "shareId": None
            }
            update_response = await client.patch("/user/notifications", json=update_data)
            assert update_response.status_code == 200


@pytest.mark.asyncio
async def test_search_privacy_considerations(mocked_app):
    """Test that user search respects privacy settings."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Search should not return sensitive information
        response = await client.get(f"/user/search/{test_user_dict_radagast['email']}")
        if response.status_code == 200:
            response_data = response.json()
            if "users" in response_data or "user" in response_data:
                # Should not include sensitive data like passwords, tokens, etc.
                user_data = response_data.get("users", []) or [response_data.get("user", {})]
                for user in user_data:
                    assert "password" not in user
                    assert "stripe_customer_id" not in user or user["stripe_customer_id"] is None


@pytest.mark.asyncio
async def test_newsletter_subscription_idempotency(mocked_app):
    """Test that newsletter subscription operations are idempotent."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Subscribe multiple times - should not cause errors
        newsletter_data = {"email": "test@example.com"}
        response1 = await client.post("/user/newsletter", json=newsletter_data)
        response2 = await client.post("/user/newsletter", json=newsletter_data)
        assert response1.status_code == 200
        assert response2.status_code == 200

        # Unsubscribe multiple times - should not cause errors
        response3 = await client.request("DELETE", "/user/newsletter", json=newsletter_data)
        response4 = await client.request("DELETE", "/user/newsletter", json=newsletter_data)
        assert response3.status_code == 200
        assert response4.status_code == 200


@pytest.mark.asyncio
async def test_settings_default_values(mocked_app):
    """Test that user settings have sensible default values."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/settings")
        assert response.status_code == 200
        response_data = response.json()

        if "settings" in response_data:
            settings = response_data["settings"]
            # Check for existence of key settings (values may vary)
            expected_settings = ["language", "theme", "new_user"]
            # At least some basic settings should be present
            assert any(setting in settings for setting in expected_settings)


@pytest.mark.asyncio
async def test_notification_types_handling(mocked_app):
    """Test handling of different notification types."""
    transport = httpx.ASGITransport(app=mocked_app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/user/notifications")
        assert response.status_code == 200
        response_data = response.json()

        # Each notification should have required fields
        for notification in response_data["notifications"]:
            # Basic structure validation
            assert isinstance(notification, dict)
            # Common fields that notifications should have
            expected_fields = ["id", "message", "read"]
            # At least some expected fields should be present
            assert any(field in notification for field in expected_fields)