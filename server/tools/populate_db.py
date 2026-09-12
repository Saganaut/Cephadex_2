import asyncio

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from models.models_ import Base
from tests.test_api.populate_db import populate_db

# DB_URI = "sqlite+aiosqlite:///:memory:"

PG_DB_URI = "postgresql+asyncpg://user:1234@postgres:5432/db"
# DB_URI = "mysql+aiomysql://snvpt1s0qppp48y4:rv1po31a6rybok29@w1kr9ijlozl9l79i.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/mu9kmetipq4f8jsc"
engine = create_async_engine(PG_DB_URI, echo=True)


async_session_maker = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def create_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def populate():
    await create_db()
    async with async_session_maker() as db:
        await populate_db(db)


if __name__ == "__main__":
    asyncio.run(populate())
    print("Database populated")
