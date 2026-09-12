import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

config = ConfigDict(
    populate_by_name=True,
    alias_generator=to_camel,
    from_attributes=True,
    arbitrary_types_allowed=True,
)


class BlogPostSchema(BaseModel):
    model_config = config

    id: int
    title: str
    slug: str
    content: str
    summary: str
    author_name: Optional[str] = Field(None)
    tags: Optional[str] = None
    thumbnail: Optional[str] = None
    time_created: str
    updated: Optional[str] = Field(
        None,
    )
    views: Optional[int] = None
    user_id: Optional[int] = Field(None)
    category: Optional[str] = None
    user_id: Optional[int] = Field(None)


class ImagesSchema(BaseModel):
    model_config = config

    id: Optional[int]
    blog_id: Optional[int] = Field(None, description="Blog id", alias="blogId")
    name: Optional[str] = None
    type: Optional[str] = None
    image_url: str = Field(None, description="Image url", alias="imageUrl")
    thumbnail_url: Optional[str] = Field(
        None, description="Thumbnail url", alias="thumbnailUrl"
    )
    time_created: str = Field(
        None,
    )


class BlogSchemaFull(BlogPostSchema):
    model_config = config

    avatar: Optional[str] = None
    images: Optional[list[ImagesSchema]] = []


class BlogDataResponse(BaseModel):
    model_config = config

    status: str
    message: str
    blog: list[BlogSchemaFull]
    avatar: Optional[str] = None
    images: Optional[list[ImagesSchema]] = []


class BlogsDataResponse(BaseModel):
    model_config = config
    status: str
    message: str
    blogs: list[BlogSchemaFull]
