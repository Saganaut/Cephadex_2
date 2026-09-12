import json
from pprint import pprint

import pytest
import httpx


@pytest.mark.asyncio
async def test_get_blog_post(mocked_app):
    async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
        response = await ac.get("/info/blog/latest")
        data = response.json()
        assert response.status_code == 200
        assert data["status"] == "success"
        assert data["message"] == "blog retrieved"
        assert len(data["blog"]) == 1
        assert data["avatar"] is None
        assert len(data["images"]) == 1


@pytest.mark.asyncio
async def test_get_all_blog_posts(mocked_app):
    async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
        response = await ac.get("/info/all-blogs")
        data = response.json()
        assert response.status_code == 200
        assert data["status"] == "success"
        assert data["message"] == "blogs retrieved"
        assert len(data["blogs"]) == 1
