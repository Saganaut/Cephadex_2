import csv
import datetime as dt
import os

from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session

from dependencies.settings import get_settings
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


class Reporter:
    def __init__(self, db: Session) -> None:
        self.db = db

    @classmethod
    def create(cls) -> "Reporter":
        db = session()
        instance = cls(db)
        instance.create_report()
        return instance

    def create_report(self):
        csv_file_path = "report.csv"
        # Check if CSV file exists, create it if not
        is_new_file = not os.path.isfile(csv_file_path)
        with open(csv_file_path, "a", newline="") as csv_file:
            writer = csv.writer(csv_file)
            if is_new_file:
                # Write categories as the first column
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

        # Get counts for each metric
        user_accounts_created = self.count_user_accounts_created(self.db)
        deleted_accounts = self.count_deleted_accounts_by_reason(self.db)
        stripe_events = self.count_stripe_events(self.db)
        usage_records = self.count_usage_record(self.db)
        cards_created = self.count_card_created_by_type(self.db)
        decks_created = self.count_decks_created(self.db)
        deck_files = self.count_deck_files(self.db)
        feedback = self.list_feedback(self.db)
        tests_created = self.count_tests_created(self.db)
        event_types = self.count_events_by_type(self.db)

        # Create a new row with the data and time
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
            {"event_types": event_types},
        ]

        # Append the row to the CSV file
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
                        {'tests_created':<20} {tests_created}, \
                        {'event_types':<20} {event_types}"

        # Send email with the report
        Emailer.send_email_report(
            "pro.mccarthy@gmail.com",
            formatted_report,
            settings.email.send_grid_key,
        )

    @staticmethod
    def count_user_accounts_created(db: Session) -> int:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        return db.query(User).filter(User.time_created >= start_time).count()

    # def count_user_accounts_created():
    #     start_time = dt.datetime.now() - dt.timedelta(hours=24)
    #     count = User.query.filter(User.time_created >= start_time).count()
    #     return count
    @staticmethod
    def count_deleted_accounts_by_reason(db: Session) -> dict:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        deleted_accounts = (
            db.query(DeletedAccounts).filter(DeletedAccounts.time_deleted >= start_time).all()
        )
        count_by_reason = {}
        for account in deleted_accounts:
            reason = account.reason
            count_by_reason[reason] = count_by_reason.get(reason, 0) + 1

        return count_by_reason

    # def count_deleted_accounts_by_reason():
    #     start_time = dt.datetime.now() - dt.timedelta(hours=24)
    #     deleted_accounts = DeletedAccounts.query.filter(
    #         DeletedAccounts.time_deleted >= start_time
    #     ).all()

    #     count_by_reason = {}
    #     for account in deleted_accounts:
    #         reason = account.reason
    #         count_by_reason[reason] = count_by_reason.get(reason, 0) + 1

    #     return count_by_reason
    @staticmethod
    def count_stripe_events(db: Session) -> dict:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        event_counts = (
            db.query(StripeEvents.event_type, func.count(StripeEvents.event_type))
            .filter(StripeEvents.time_created >= start_time)
            .group_by(StripeEvents.event_type)
            .all()
        )
        return {event_type: count for event_type, count in event_counts}  # noqa: C416

    # def count_stripe_events(db: Session):
    #     start_time = dt.datetime.now() - dt.timedelta(hours=24)
    #     event_counts = (
    #         db.query(StripeEvents.event_type, func.count(StripeEvents.event_type))
    #         .filter(StripeEvents.time_created >= start_time)
    #         .group_by(StripeEvents.event_type)
    #         .all()
    #     )

    #     event_counts_dict = {event_type: count for event_type, count in event_counts}
    #     return event_counts_dict
    @staticmethod
    def count_usage_record(db: Session) -> dict:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        usage_records = db.query(UsageRecord).filter(UsageRecord.date >= start_time).all()
        count_by_operation = {}
        for record in usage_records:
            operation = record.operation_type
            count_by_operation[operation] = count_by_operation.get(operation, 0) + 1

        return count_by_operation

    @staticmethod
    def count_card_created_by_type(db: Session) -> int:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        return db.query(Card).filter(Card.time_created >= start_time).count()

    @staticmethod
    def count_decks_created(db: Session) -> dict:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        decks_created = db.query(Deck).filter(Deck.time_created >= start_time).all()
        count_by_type = {}
        for deck in decks_created:
            create_method = deck.create_method
            count_by_type[create_method] = count_by_type.get(create_method, 0) + 1
        return count_by_type

    @staticmethod
    def count_deck_files(db: Session) -> dict:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        deck_files = db.query(DeckFiles).filter(DeckFiles.time_created >= start_time).all()
        count_by_type = {}
        for deck in deck_files:
            file_type = deck.file_type
            count_by_type[file_type] = count_by_type.get(file_type, 0) + 1
        return count_by_type

    @staticmethod
    def list_feedback(db: Session) -> list:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        feedback = db.query(Feedback).filter(Feedback.time_created >= start_time).all()
        return [message.message for message in feedback]

    @staticmethod
    def count_tests_created(db: Session) -> int:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        return db.query(Test).filter(Test.time_created >= start_time).count()

    @staticmethod
    def count_events_by_type(db: Session) -> dict:
        start_time = dt.datetime.now() - dt.timedelta(hours=24)
        events = db.query(EventTracking).filter(EventTracking.time_created >= start_time).all()
        event_counts = {}
        for event in events:
            event_type = event.event_type
            event_counts[event_type] = event_counts.get(event_type, 0) + 1
        return event_counts


# if __name__ == "__main__":
#     reporter = Reporter()
#     reporter.create(session)
# # def count_usage_record():
#     start_time = dt.datetime.now() - dt.timedelta(hours=24)
#     usage_records = UsageRecord.query.filter(UsageRecord.date >= start_time).all()

# def count_card_created_by_type():
#     start_time = dt.datetime.now() - dt.timedelta(hours=24)
#     cards_created = Card.query.filter(Card.time_created >= start_time).count()
#     return cards_created

# def count_decks_created():
#     start_time = dt.datetime.now() - dt.timedelta(hours=24)
#     decks_created = Deck.query.filter(Deck.time_created >= start_time).all()


# def count_deck_files():
#     start_time = dt.datetime.now() - dt.timedelta(hours=24)
#     deck_files = DeckFiles.query.filter(DeckFiles.time_created >= start_time).all()

# def list_feedback():
#     start_time = dt.datetime.now() - dt.timedelta(hours=24)
#     feedback = Feedback.query.filter(Feedback.time_created >= start_time).all()


# def count_tests_created():
#     start_time = dt.datetime.now() - dt.timedelta(hours=24)
#     count = Test.query.filter(Test.time_created >= start_time).count()
#     return count

# def count_events_by_type():
#     start_time = dt.datetime.now() - dt.timedelta(hours=24)
#     events = EventTracking.query.filter(
#         EventTracking.time_created >= start_time
#     ).all()
