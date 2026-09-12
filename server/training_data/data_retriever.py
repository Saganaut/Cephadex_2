import csv
import json
import os
from datetime import datetime, timedelta, timezone

from dependencies.settings import get_settings
from models.llm_records import LlmRecords
from models.models_ import (
    Card,
    Deck,
    DeckFiles,
    DeletedAccounts,
    EventTracking,
    Feedback,
    StripeEvents,
    Test,
    UsageRecord,
    User,
)
from models.send_email import Emailer
from pydantic import BaseModel
from sqlalchemy import and_, create_engine, func
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session

settings = get_settings()
# engine = create_engine(SQLALCHEMY_DATABASE_URI, **SQLALCHEMY_ENGINE_OPTIONS)
sync_engine = create_engine(  # type: ignore
    settings.db.sqlalchemy_database_uri,  # type: ignore
    **settings.db.sqlalchemy_engine_options,
)
session = sessionmaker(
    autocommit=settings.db.auto_commit,
    autoflush=settings.db.auto_flush,
    bind=sync_engine,
)

# {
#     "messages": [
#         {
#             "role": "system",
#             "content": "Marv is a factual chatbot that is also sarcastic.",
#         },
#         {"role": "user", "content": "What's the capital of France?"},
#         {
#             "role": "assistant",
#             "content": "Paris, as if everyone doesn't know that already.",
#         },
#     ]
# }


class Roles(BaseModel):
    role: str
    content: str


class DataObject(BaseModel):
    message: list[Roles]


def retrieve_data_from_db() -> None:
    """
    This function retrieves data from a database and processes it.
    """
    db = session()
    rows = (
        db.query(LlmRecords)
        .filter(and_(LlmRecords.rating == 1, LlmRecords.type == "extract"))
        .all()
    )
    with open("extract.jsonl", "a", encoding="utf-8") as f:
        all_messages = []

        for row in rows:
            try:
                if row.response is None or row.response == "null":
                    print("row is null")
                    continue
                # print(row.prompt[:50], row.response[:50])
                response = json.loads(row.response)
                if not isinstance(response, list):
                    response = (
                        response.get("questions")
                        or response.get("terms")
                        or response.get("response")
                        or response.get("JSON")
                    )
                if not isinstance(response, list):
                    response = [response]
                response_json = json.dumps(
                    response, ensure_ascii=False
                )  # Convert back to JSON with non-ASCII characters supported
                sys = {"role": "system", "content": row.sys_instruct}
                user = {"role": "user", "content": row.prompt}
                assistant = {"role": "assistant", "content": response_json}
                message = {"message": [sys, user, assistant]}
                all_messages.append(message)
            except:
                continue

            with open(
                "extract.jsonl", "w", encoding="utf-8"
            ) as f:  # Specify encoding explicitly
                for message in all_messages:
                    f.write(
                        json.dumps(message, ensure_ascii=False) + "\n"
                    )  # Write each message as a new line


retrieve_data_from_db()
