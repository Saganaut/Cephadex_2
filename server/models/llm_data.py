import json
import logging
from typing import Optional

from dependencies.settings import get_settings
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import sessionmaker
from startup.setup_loggers import setup_processing_logger

from models.llm_records import LlmRecords

# logger = setup_processing_logger()
logger = logging.getLogger("job_processing")
settings = get_settings()

engine = create_async_engine(
    settings.db.async_sqlalchemy_database_uri,
    **settings.db.async_sqlalchemy_engine_options,
)

session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


engine = create_engine(
    settings.db.sqlalchemy_database_uri,
    **settings.db.sqlalchemy_engine_options,
)

non_async_session_factory = sessionmaker(
    bind=engine,
    expire_on_commit=False,
)


class DataCollector:
    @staticmethod
    async def async_log_data(
        prompt: str,
        sys_instruct: str,
        response: str,
        model: str,
        response_format: str,
        type: str,
        subtype: str,
        temperature: Optional[float] = None,
        version: Optional[float] = 0.1,
    ):
        try:
            response_format_str = json.dumps(response_format)

            async with session_factory() as session:
                llm_record = LlmRecords(
                    prompt=prompt[:5000],
                    sys_instruct=sys_instruct[:1000],
                    response=response[:5000],
                    model=model[:50],
                    temperature=temperature,
                    response_format=response_format_str[:50],
                    type=type[:20],
                    subtype=subtype[:20],
                    version=version,
                )
                session.add(llm_record)
                await session.commit()
        except Exception as e:
            logger.error(f"Error logging data: {e}")

    @staticmethod
    def log_data(
        prompt: str,
        sys_instruct: str,
        response: str,
        model: str,
        response_format: str,
        type: str,
        subtype: str,
        temperature: Optional[float] = None,
        version: Optional[float] = 0.1,
    ):
        response_format_str = json.dumps(response_format)

        with non_async_session_factory() as session:
            llm_record = LlmRecords(
                prompt=prompt[:5000],
                sys_instruct=sys_instruct[:1000],
                response=response[:5000],
                model=model[:50],
                temperature=temperature,
                response_format=response_format_str[:50],
                type=type[:20],
                subtype=subtype[:20],
                version=version,
            )
            session.add(llm_record)
            session.commit()

    @staticmethod
    async def set_rating_to_1(llm_record: LlmRecords):
        pass

    @staticmethod
    async def set_rating_to_0(llm_record: LlmRecords):
        pass
