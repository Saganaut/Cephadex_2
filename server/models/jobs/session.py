from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import sessionmaker

from dependencies.settings import get_settings

settings = get_settings()
engine = create_async_engine(
    settings.db.async_sqlalchemy_database_uri,  # type: ignore
    **settings.db.async_sqlalchemy_engine_options,  # type: ignore
)
session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


sync_engine = create_engine(
    settings.db.sqlalchemy_database_uri,  # type: ignore
    **settings.db.sqlalchemy_engine_options,  # type: ignore
)
sync_session_factory = sessionmaker(
    bind=sync_engine,
    expire_on_commit=False,
)
