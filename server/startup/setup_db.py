import logging

from sqlalchemy import create_engine, event
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker

from dependencies.settings import get_settings

logger = logging.getLogger("App")
settings = get_settings()

##TODO: Fix this when all logging is properly setup
# echo_enabled = settings.app.environment == "development"
echo_enabled = False

engine = create_async_engine(
    settings.db.async_sqlalchemy_database_uri,
    **settings.db.async_sqlalchemy_engine_options,
    echo=echo_enabled,
)
async_session = async_sessionmaker(engine, expire_on_commit=settings.db.expire_on_commit)

sync_engine = create_engine(
    settings.db.sqlalchemy_database_uri,
    **settings.db.sqlalchemy_engine_options,
)
session = sessionmaker(
    autocommit=settings.db.auto_commit,
    autoflush=settings.db.auto_flush,
    bind=sync_engine,
)


sync_engine = engine.sync_engine


@event.listens_for(sync_engine, "connect")
def receive_connect(dbapi_connection, connection_record):  # noqa: ANN001 ARG001 ANN201
    connection_info = f"New connection {id(dbapi_connection)}"
    logger.debug(connection_info)


@event.listens_for(sync_engine, "checkout")
def receive_checkout(dbapi_connection, connection_record, connection_proxy):  # noqa: ANN001 ARG001 ANN201
    logger.debug("Checked in connection %s", id(dbapi_connection))


@event.listens_for(sync_engine, "checkin")
def receive_checkin(dbapi_connection, connection_record):  # noqa: ANN001 ARG001 ANN201
    logger.debug("Checked in connection %s", id(dbapi_connection))


Base = declarative_base()
