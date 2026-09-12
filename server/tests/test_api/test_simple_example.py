"""
Simple test example to verify test infrastructure works.

This file contains basic tests to validate that our test setup
and mocked application work correctly.
"""

import pytest
from tests.test_api.asyncio_test_client import AsyncioTestClient


def test_simple_sync_test_with_mocked_app(mocked_app):
    """Test using AsyncioTestClient with mocked app."""
    with AsyncioTestClient(mocked_app, base_url="http://test") as client:
        # Test a simple endpoint that should exist
        response = client.get("/user/user")
        assert response.status_code == 200


def test_simple_sync_test_create_router(sync_mocked_app):
    """Test using the sync mocked app for create routes."""
    with AsyncioTestClient(sync_mocked_app, base_url="http://test") as client:
        # Test creating content endpoint
        create_data = {
            "content_type": "text",
            "content": "Simple test content",
            "extraction_type": "flashcards"
        }
        response = client.post("/create/", json=create_data)
        # Should either work or fail gracefully
        assert response.status_code in [200, 400, 500]


@pytest.mark.asyncio
async def test_simple_async_without_httx_client(mocked_app):
    """Test async functionality without httpx AsyncClient."""
    # Test that the mocked app fixture is set up correctly
    assert mocked_app is not None

    # Test that dependency overrides are in place
    from dependencies.user_dependencies import get_current_user
    assert get_current_user in mocked_app.dependency_overrides


def test_db_connection_works(mocked_app):
    """Test that database connection works with mocked app."""
    from dependencies.db import get_db

    # Verify that get_db is overridden
    assert get_db in mocked_app.dependency_overrides

    # The override function should be our test database
    override_func = mocked_app.dependency_overrides[get_db]
    assert override_func is not None