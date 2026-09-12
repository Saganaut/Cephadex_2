import logging
from unittest.mock import Mock

import pytest
from tests.test_api.data.test_users import test_user_dict_radagast
from dotenv import load_dotenv
from fakeredis import FakeAsyncRedis
from fastapi import FastAPI
from tests.test_api.populate_redis import preload_game_data
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from dependencies.db import get_db, get_db_sync
from dependencies.posthog import get_post_hog
from dependencies.redis import get_redis_client
from dependencies.subscriptions import StripePlans, get_subscriptions
from dependencies.user_dependencies import get_current_user, get_current_user_or_guest
from models.models_ import Base, User
from routes.ask_ceph.ask_ceph import router as ask_ceph_router
from routes.create.create import router as create_router
from routes.deck.deck import router as deck_router
from routes.deck.main_deck import main_deck_router
from routes.game.game import router as game_router
from routes.group.group import router as group_router
from routes.info.info import router as info_router
from routes.quiz.main_quiz import main_quiz_router
from routes.quiz.quiz import router as quiz_router
from routes.study.study import router as study_router
from routes.user.user import router as user_router
from routes.webhooks import router as webhook_router
from tests.test_api.populate_db import populate_db

load_dotenv()
TEST_DB_URI = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    TEST_DB_URI,
    echo=False,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
async_session_maker = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

mock_posthog = Mock()

sync_engine = create_engine(
    TEST_DB_URI,
    echo=False,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


session_maker = sessionmaker(bind=sync_engine, expire_on_commit=False)


async def override_get_post_hog() -> Mock:
    return mock_posthog


async def override_get_current_user() -> User:
    return User(**test_user_dict_radagast)


async def override_get_current_user_or_guest() -> User:
    return User(id=1, username="testuser", email="test@example.com", guest=False)  # type: ignore


async def create_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


def create_sync_db():
    with sync_engine.begin() as conn:
        conn.execute(Base.metadata.create_all(bind=sync_engine))


def drop_sync_db():
    with sync_engine.begin() as conn:
        conn.execute(Base.metadata.drop_all(bind=sync_engine))


def override_sync_get_db():
    create_sync_db()
    try:
        with session_maker() as db:
            yield db
    finally:
        drop_sync_db()
        sync_engine.dispose()


async def drop_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db():
    await create_db()
    try:
        async with async_session_maker() as db:
            await populate_db(db)
            yield db
    finally:
        logging.warning("Dropping database")
        await drop_db()
        logging.warning("Database dropped")
        await engine.dispose()


async def override_get_redis():
    # Create a fresh Redis client for each test to avoid event loop conflicts
    redis_client = FakeAsyncRedis(decode_responses=True)
    try:
        await preload_game_data(redis_client)
        yield redis_client
    finally:
        await redis_client.flushall()


async def override_get_subscriptions() -> StripePlans:
    # result = await db.execute(select(SubscriptionPlan))
    # subscription_plans = result.scalars().all()
    subscription_plans = {
        "free": {
            "id": 1,
            "name": "free",
            "description": "free account",
            "limit_count": 40000,
            "limit_time_period": "month",
            "price": 0.0,
            "duration": 31,
            "stripe_id": "0",
        },
        "premium_yearly": {
            "id": 7,
            "name": "premium_yearly",
            "description": "premium paid account",
            "limit_count": 1600000,
            "limit_time_period": "month",
            "price": 189.99,
            "duration": 365,
            "stripe_id": "price_1NAp58GXWJkeH44y1XCry43l",
        },
        "premium_monthly": {
            "id": 6,
            "name": "premium_monthly",
            "description": "premium paid account",
            "limit_count": 1600000,
            "limit_time_period": "month",
            "price": 95.99,
            "duration": 31,
            "stripe_id": "price_1NFjudGXWJkeH44yLo0dmszD",
        },
        "basic_yearly": {
            "id": 3,
            "name": "basic_yearly",
            "description": "lower tier paid account",
            "limit_count": 204800,
            "limit_time_period": "month",
            "price": 47.99,
            "duration": 365,
            "stripe_id": "price_1NFk0RGXWJkeH44yR221a2k9",
        },
        "basic_monthly": {
            "id": 2,
            "name": "basic_monthly",
            "description": "lower tier paid account",
            "limit_count": 204800,
            "limit_time_period": "month",
            "price": 4.99,
            "duration": 31,
            "stripe_id": "price_1NFk0RGXWJkeH44y6Cc9kCOV",
        },
        "admin": {
            "id": 8,
            "name": "admin",
            "description": "admin account",
            "limit_count": 100000000,
            "limit_time_period": "month",
            "price": 0.0,
            "duration": 31,
            "stripe_id": "0",
        },
    }
    plans_dict = {}
    for plan in subscription_plans.values():
        key = plan.get("name", "").lower().replace(" ", "_")
        plans_dict[key] = {
            "id": plan.get("id", ""),
            "name": plan.get("name", ""),
            "description": plan.get("description", ""),
            "limit_count": plan.get("limit_count", ""),
            "limit_time_period": plan.get("limit_time_period", ""),
            "price": plan.get("price", ""),
            "duration": plan.get("duration", ""),
            "stripe_id": plan.get("stripe_id", ""),
        }
    return StripePlans(**plans_dict)


@pytest.fixture()
def mocked_app() -> FastAPI:
    app = FastAPI()
    app.include_router(deck_router)
    app.include_router(quiz_router)
    app.include_router(main_deck_router)
    app.include_router(main_quiz_router)
    app.include_router(group_router)
    app.include_router(game_router)
    app.include_router(info_router)
    app.include_router(study_router)
    app.include_router(user_router)
    app.include_router(ask_ceph_router)
    app.include_router(webhook_router)
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_post_hog] = override_get_post_hog
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_redis_client] = override_get_redis
    app.dependency_overrides[get_current_user_or_guest] = override_get_current_user_or_guest
    app.dependency_overrides[get_subscriptions] = override_get_subscriptions

    return app


@pytest.fixture()
def sync_mocked_app() -> FastAPI:
    app = FastAPI()
    app.include_router(create_router)
    app.include_router(user_router)
    app.dependency_overrides[get_post_hog] = override_get_post_hog
    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_db_sync] = override_sync_get_db
    return app


# @pytest.fixture(scope="module")
# def shared_event_loop():
#     loop = asyncio.get_event_loop()
#     yield loop
#     loop.close()


# @pytest.fixture
# async def test_db():
#     await create_db()
#     async with async_session_maker() as db:
#         yield db

# @pytest.fixture
# def sync_test_db():
#     with session_maker() as db:
#         yield db


# @pytest.fixture
# async def test_deck(test_db: AsyncSession) -> Deck:
#     deck = Deck(**test_deck_dict)
#     test_db.add(deck)
#     await test_db.commit()
#     return deck


# @pytest.fixture
# async def test_card(test_db: AsyncSession) -> Card:
#     card = Card(**test_card_dict)  # Fill in card details
#     test_db.add(card)
#     await test_db.commit()
#     return card


# @pytest.fixture
# async def test_card_deck_association(
#     test_db: AsyncSession, test_deck: Deck, test_card: Card
# ):
#     stmt = cards.insert().values(card_id=test_card.id, deck_id=test_deck.id)
#     await test_db.execute(stmt)
#     await test_db.commit()
