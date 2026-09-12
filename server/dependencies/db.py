from typing import Annotated, AsyncGenerator, Generator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from startup.setup_db import async_session, session


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as a_session:
        try:
            yield a_session
        finally:
            await a_session.close()


def get_db_sync() -> Generator[Session, None, None]:
    db = session()
    try:
        yield db
    finally:
        db.close()


GetDb = Annotated[AsyncSession, Depends(get_db)]
GetSyncDb = Annotated[Session, Depends(get_db_sync)]
