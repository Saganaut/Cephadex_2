import csv
import json
import logging
import os
import sys

from models.send_email import Emailer

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import datetime as dt

from dateutil.relativedelta import relativedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session

from dependencies.settings import get_settings

## Models are below to ensure they are using the correct path - not sure if necessary
from models.helpers.log_decorators import subrollover_log_decorator
from models.models_ import (
    Card,
    Deck,
    DeckFiles,
    DeletedAccounts,
    Feedback,
    StripeEvents,
    SubscriptionPlan,
    Test,
    UsageRecord,
    User,
)

dotenv_path = os.path.join(os.path.dirname(__file__), "../.env")
result = load_dotenv(dotenv_path)

SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
SQLALCHEMY_ENGINE_OPTIONS = json.loads(os.environ["SQLALCHEMY_ENGINE_OPTIONS"])

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

log = logging.getLogger("subrollover")


@subrollover_log_decorator
def roll_over(db: Session) -> str:
    """Subscriptions get reset every 30 days
    Look at all accounts who are reaching 30 days since last rollover
    """
    subscriptions = db.query(User).filter_by(account_status="active").all()
    # Loop through each subscription and check if 30 days have passed
    for subscription in subscriptions:
        if subscription.latest_roll_over is None:
            if subscription.subscription_start_date is None:
                subscription.subscription_start_date = dt.datetime.now()
            subscription.latest_roll_over = subscription.subscription_start_date
        # aware_datetime = datetime.replace(
        #     subscription.latest_roll_over, tzinfo=timezone.utc
        # )

        # Calculate the same day of the following month
        next_month_date = subscription.latest_roll_over + relativedelta(months=1)

        if next_month_date <= dt.datetime.now():
            log.info(f"rolling over {subscription.username}")
            subscription.latest_roll_over = dt.datetime.now()
            # Reset the usage limit for this subscription type
            user = db.query(User).filter_by(id=subscription.id).first()
            if user is None:
                continue
            db.add(user)
            user.latest_roll_over = dt.datetime.now()
            subscription_plan = (
                db.query(SubscriptionPlan).filter_by(id=user.subscription_plan).first()
            )
            if subscription_plan is None:
                msg = "No subscription plan found for user"
                raise ValueError(msg)
            if user.subscription_plan not in [3, 4, 5, 6, 7]:
                usage_limit = subscription_plan.limit_count
            else:
                # for premium members previous months credit rolls over to the next
                current_credit = (
                    db.query(UsageRecord)
                    .filter_by(user_id=subscription.id)
                    .order_by(UsageRecord.id.desc())
                    .first()
                )
                if current_credit is None:
                    msg = "No usage record found for user"
                    raise ValueError
                usage_limit = current_credit.remaining_count + subscription_plan.limit_count
            new_record = UsageRecord(
                user_id=subscription.id,
                operation_type="reset",
                limit_count=usage_limit,
                operation_count=0,
                remaining_count=usage_limit,
                date=dt.datetime.now(),
                time_period="month",
            )
            db.add(new_record)
            db.commit()
    db.commit()
    return "Usage limits have been reset successfully."


@subrollover_log_decorator
def delete_accounts(db: Session) -> None:
    accounts_to_delete = db.query(User).filter_by(account_expiration_reason="deleted").all()
    for account in accounts_to_delete:
        db.delete(account)
        db.commit()


@subrollover_log_decorator
def create_report(db):
    csv_file_path = "report.csv"
    is_new_file = not os.path.isfile(csv_file_path)
    with open(csv_file_path, "a", newline="") as csv_file:
        writer = csv.writer(csv_file)
        if is_new_file:
            categories = [
                "User Accounts Created",
                "Deleted Accounts",
                "Stripe Events",
                "Usage Records",
                "Cards Created",
                "Decks Created",
                "Deck Files",
                "Feedback",
                "Tests Created",
                "Event Types",
            ]
            writer.writerow(["Date"] + categories)

    user_accounts_created = count_user_accounts_created(db)
    deleted_accounts = count_deleted_accounts_by_reason(db)
    stripe_events = count_stripe_events(db)
    usage_records = count_usage_record(db)
    cards_created = count_card_created_by_type(db)
    decks_created = count_decks_created(db)
    deck_files = count_deck_files(db)
    feedback = list_feedback(db)
    tests_created = count_tests_created(db)
    # event_types = count_events_by_type(db)

    row_data = [
        dt.datetime.now().strftime("%Y-%m-%d %H"),
        {"accounts_created": user_accounts_created},
        {"deleted_accounts": deleted_accounts},
        {"stripe_events": stripe_events},
        {"usage_records": usage_records},
        {"cards_created": cards_created},
        {"decks_created": decks_created},
        {"deck_files": deck_files},
        {"feedback": feedback},
        {"tests_created": tests_created},
        # {"event_types": event_types},
    ]

    with open(csv_file_path, "a", newline="") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(row_data)

    formatted_report = f"{dt.datetime.now().strftime('%Y-%m-%d %H')}, \
                    {'accounts_created':<20} {user_accounts_created}, \
                    {'deleted_accounts':<20} {deleted_accounts}, \
                    {'stripe_events':<20} {stripe_events}, \
                    {'usage_records':<20} {usage_records}, \
                    {'cards_created':<20} {cards_created}, \
                    {'decks_created':<20} {decks_created}, \
                    {'deck_files':<20} {deck_files}, \
                    {'feedback':<20} {feedback}, \
                    {'tests_created':<20} {tests_created}"

    Emailer.send_email_report(
        "pro.mccarthy@gmail.com",
        formatted_report,
        settings.email.send_grid_key,
    )


def count_user_accounts_created(db) -> int:
    start_time = dt.datetime.now() - dt.timedelta(hours=24)
    return db.query(User).filter(User.time_created >= start_time).count()


def count_deleted_accounts_by_reason(db) -> dict:
    start_time = dt.datetime.now() - dt.timedelta(hours=24)
    deleted_accounts = (
        db.query(DeletedAccounts).filter(DeletedAccounts.time_deleted >= start_time).all()
    )

    count_by_reason = {}
    for account in deleted_accounts:
        reason = account.reason
        count_by_reason[reason] = count_by_reason.get(reason, 0) + 1

    return count_by_reason


def count_stripe_events(db) -> dict:
    start_time = dt.datetime.now() - dt.timedelta(hours=24)
    event_counts = (
        db.query(StripeEvents.event_type, func.count(StripeEvents.event_type))
        .filter(StripeEvents.time_created >= start_time)
        .group_by(StripeEvents.event_type)
        .all()
    )
    return {event_type: count for event_type, count in event_counts}


def count_usage_record(db) -> dict:
    start_time = dt.datetime.now() - dt.timedelta(hours=24)
    usage_records = db.query(UsageRecord).filter(UsageRecord.date >= start_time).all()
    count_by_operation = {}
    for record in usage_records:
        operation = record.operation_type
        count_by_operation[operation] = count_by_operation.get(operation, 0) + 1
    return count_by_operation


def count_card_created_by_type(db) -> int:
    start_time = dt.datetime.now() - dt.timedelta(hours=24)
    return db.query(Card).filter(Card.time_created >= start_time).count()


def count_decks_created(db) -> dict:
    start_time = dt.datetime.now() - dt.timedelta(hours=24)
    decks_created = db.query(Deck).filter(Deck.time_created >= start_time).all()
    count_by_type = {}
    for deck in decks_created:
        create_method = deck.create_method
        count_by_type[create_method] = count_by_type.get(create_method, 0) + 1
    return count_by_type


def count_deck_files(db) -> dict:
    start_time = dt.datetime.now() - dt.timedelta(hours=24)
    deck_files = db.query(DeckFiles).filter(DeckFiles.time_created >= start_time).all()
    count_by_type = {}
    for deck in deck_files:
        file_type = deck.file_type
        count_by_type[file_type] = count_by_type.get(file_type, 0) + 1
    return count_by_type


def list_feedback(db) -> list:
    start_time = dt.datetime.now() - dt.timedelta(hours=24)
    feedback = db.query(Feedback).filter(Feedback.time_created >= start_time).all()
    return [message.message for message in feedback]


def count_tests_created(db) -> int:
    start_time = dt.datetime.now() - dt.timedelta(hours=24)
    return db.query(Test).filter(Test.time_created >= start_time).count()


# def count_events_by_type(db):
#     start_time = dt.datetime.now() - timedelta(hours=24)
#     events = EventTracking.query.filter(EventTracking.time_created >= start_time).all()
#     event_counts = {}
#     for event in events:
#         event_type = event.event_type
#         event_counts[event_type] = event_counts.get(event_type, 0) + 1
#     return event_counts


if __name__ == "__main__":
    # Set up SQLAlchemy session and run roll over function
    with session() as db:
        try:
            roll_over(db)
            delete_accounts(db)
            create_report(db)
        except Exception:
            log.exception("Error in subrollover")
