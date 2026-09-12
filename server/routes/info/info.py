import hashlib
import logging
from typing import Optional

from dependencies.db import get_db
from dependencies.posthog import GetPostHog
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from models.models_ import BlogPost, Images, User
from routes.data_classes.blog_schema import (
    BlogDataResponse,
    BlogPostSchema,
    BlogsDataResponse,
)
from sqlalchemy import select

router = APIRouter(
    prefix="/info",
    tags=["info"],
)

logger = logging.getLogger("App")


@router.get("/blog/{slug}", response_model=BlogDataResponse, tags=["blog"])
async def get_blog_post(posthog: GetPostHog, slug: Optional[str], db=Depends(get_db)):
    """takes either a blog slug or "latest" as a param"""
    if slug == "latest" or slug is None:
        post = await get_latest_post(db)
    else:
        post = await get_post_by_slug(slug, db)
    avatar_data = None
    if post:
        post_dict = post.to_dict()
        post_data = BlogPostSchema(**post_dict)
        post_data = post_data.model_dump(by_alias=True)
        if post.user_id:
            avatar_data = await add_avatar_to_post(post, db)
        image_data = await add_images_to_post(post, db)
        etag_value = f"blog-{slug}"
        etag_hash = hashlib.sha256(etag_value.encode()).hexdigest()
        response = {
            "status": "success",
            "message": "blog retrieved",
            "blog": [post_data],
            "avatar": avatar_data,
            "images": image_data,
        }
        headers = {
            "Cache-Control": "public, max-age=3600",
            "ETag": etag_hash,
        }
        return JSONResponse(content=response, headers=headers)
    posthog.capture("blog_post_viewed", {"slug": slug})
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")


@router.get("/all-blogs", response_model=BlogsDataResponse, tags=["blog"])
async def get_all_blog_posts(db=Depends(get_db)):
    """retursn all blogs in descending order of time created, does not include images"""
    query = await db.execute(select(BlogPost).order_by(BlogPost.time_created.desc()))
    blog_posts = query.scalars().all()
    posts_data = []
    etag_value = "blogs-all"
    etag_hash = hashlib.sha256(etag_value.encode()).hexdigest()
    for post in blog_posts:
        post_dict = post.to_dict()
        blog_post = BlogPostSchema(**post_dict)
        posts_data.append(blog_post.model_dump(by_alias=True))
    response = {
        "status": "success",
        "message": "blogs retrieved",
        "blogs": posts_data,
    }
    headers = {
        "Cache-Control": "public, max-age=3600",
        "ETag": etag_hash,
    }
    return JSONResponse(content=response, headers=headers)


async def get_latest_post(db):
    result = await db.execute(
        select(BlogPost).order_by(BlogPost.time_created.desc()).limit(1)
    )
    post = result.scalar()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Post not found"
        )
    return post


async def get_post_by_slug(slug, db):
    query = await db.execute(select(BlogPost).filter_by(slug=slug))
    post = query.scalar()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Post not found"
        )
    return post


async def add_images_to_post(post, db):
    # if "images" not in post or not isinstance(post["images"], list):
    #     post["images"] = []
    query = await db.execute(select(Images).filter_by(blog_id=post.id))
    images = query.scalars().all()
    images_data = []
    if images:
        for image in images:
            image_data = {
                "id": image.id,
                "name": image.name,
                "imageUrl": image.image_url,
                "thumbnailUrl": image.thumbnail_url,
                "blogId": image.blog_id,
                "type": image.type,
            }
            images_data.append(image_data)
    return images_data


async def add_avatar_to_post(post, db):
    query = await db.execute(select(User).filter_by(id=post.user_id))
    user = query.scalar()
    if user.pic:
        return user.pic


@router.get("/healthcheck", tags=["info"])
async def healthcheck(db=Depends(get_db)):
    try:
        await db.execute(select(User).limit(1))
        return {"status": "success", "message": "healthcheck passed"}
    except Exception:
        logger.exception("Healthcheck failed")
        raise HTTPException(status_code=500, detail="Healthcheck failed")
