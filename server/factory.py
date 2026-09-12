import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.routing import APIRoute

from dependencies.settings import get_settings

# from redis import Redis
from routes import (
    webhooks,
)
from routes.admin import admin
from routes.ask_ceph import ask_ceph
from routes.create import create
from routes.deck import deck
from routes.game import game
from routes.group import group
from routes.info import info
from routes.quiz import quiz
from routes.study import study
from routes.user import user
from startup.setup_loggers import setup_app_logger, setup_payment_logger
from startup.setup_middlewares import setup_middlewares
from startup.setup_posthog import setup_post_hog
from startup.setup_redis import (
    setup_redis_client,
    setup_sync_redis_client,
)
from startup.setup_s3 import async_setup_s3_buckets

settings = get_settings()

# print(settings.__dict__)


def setup_routes(app: FastAPI) -> None:
    app.include_router(user.router)
    app.include_router(webhooks.router)
    app.include_router(quiz.router)
    app.include_router(study.router)
    app.include_router(deck.router)
    app.include_router(group.router)
    app.include_router(info.router)
    app.include_router(game.router)
    app.include_router(create.router)
    app.include_router(ask_ceph.router)
    app.include_router(admin.router)


def custom_generate_unique_id(route: APIRoute) -> str:
    """USE for SDK generation"""
    return f"{route.name}"


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    print("starting lifespan")  # noqa: T201
    app.state.redis_client = await setup_redis_client()
    app.state.sync_redis_client = setup_sync_redis_client()
    app.state.posthog = setup_post_hog()
    await async_setup_s3_buckets()
    yield
    await app.state.redis_client.close()
    app.state.sync_redis_client.close()

    # app.state.redis_pool = setup_redis_pool()
    # print("Redis pool created")
    # yield
    # await app.state.redis_pool.aclose()


def create_app() -> FastAPI:  # noqa: C901
    app = FastAPI(generate_unique_id_function=custom_generate_unique_id, lifespan=lifespan)
    setup_app_logger()

    print("Creating app")  # noqa: T201
    print("Logging level: " + settings.logging.level)  # noqa: T201

    log = logging.getLogger("App")

    log.info("STARTING APP...")
    setup_payment_logger()
    setup_middlewares(app)
    setup_routes(app)
    log.info(settings.app.model_dump_json(indent=2))
    log.info(settings.auth.model_dump_json(indent=2))
    log.info(settings.db.model_dump_json(indent=2))
    log.info(settings.redis.model_dump_json(indent=2))

    log.info(settings.app.debug)
    log.info(settings.cors)
    log.info(settings.app.environment)
    log.info(settings.app.app_url)
    log.info(settings.app.front_end_url)
    log.info(settings.app.upload_folder)
    log.info(settings.redis)
    log.info(settings.db)
    log.info(settings.aws.s3_uri)
    return app
