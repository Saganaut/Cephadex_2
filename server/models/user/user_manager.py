import datetime as dt
import logging
import os
import shutil
import tempfile
from datetime import timedelta
from typing import Optional, Sequence, Union

from fastapi import (
    HTTPException,
    UploadFile,
)
from redis.asyncio import Redis as RedisAsync
from sqlalchemy import and_, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Session, joinedload

from config import AWSSettings, TokenSettings
from models.decks.deck.deck_manager import DeckManager
from models.helpers.helpers import Helpers
from models.helpers.log_decorators import log_decorator
from models.models_ import (
    Card,
    Deck,
    DeletedAccounts,
    Group,
    Subscriber,
    SubscriptionPlan,
    Test,
    UsageRecord,
    User,
    UserSettings,
)
from models.redis_manager import RedisManager
from models.storage.s3 import StorageManager

log = logging.getLogger("App")


class UserManager:
    @staticmethod
    async def get_and_cache_user_by_id(
        db: AsyncSession,
        r_client: RedisAsync,
        user_id: int,
        refresh: bool,
    ) -> User:
        """If refresh is True it will always get the user from the database and cache it"""
        if not refresh:
            user_data = await RedisManager.retrieve_cached_json_data(
                r_client,
                f"user_{user_id}",
            )
            if user_data:
                return User(**user_data)
        user = await UserManager.get_user_by_id(db, user_id)
        if user is None:
            msg = "User not found"
            raise Exception(msg)  # noqa: TRY002
        await RedisManager.cache_json_data(
            r_client,
            f"user_{user_id}",
            user.to_dict(),
            180,
        )
        return user

    @staticmethod
    async def get_users_by_query(
        db: AsyncSession,
        user_info: str,
        query_limit: int,
    ) -> list[dict]:
        result = await db.execute(
            select(User)
            .filter(
                or_(
                    User.username.ilike(f"%{user_info}%"),
                    User.email.ilike(f"%{user_info}%"),
                ),
            )
            .limit(query_limit),
        )
        users = result.scalars().unique()

        return [
            {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "username": user.username,
                "email": user.email,
            }
            for user in users
        ]

    @staticmethod
    async def update_quantity_decks_files_quizzes_groups_with_commit(
        db: AsyncSession,
        user: User,
    ) -> None:
        log.debug("-------------------updating quantity decks, files, quizzes-------------------")
        await UserManager.count_user_files(db, user)
        await UserManager.update_quantity_quizzes(db, user)
        await UserManager.update_quantity_decks(db, user)
        await UserManager.update_quantity_groups(db, user)
        await db.commit()

    @staticmethod
    async def get_user_by_external_id(
        db: AsyncSession,
        external_id: str,
        external_type: str,
    ) -> Union[User, None]:
        result = await db.execute(
            select(User).where(
                and_(
                    User.external_id == external_id,
                    or_(
                        User.external_type == external_type,
                        and_(User.external_type == None, external_type == "google"),  # noqa: E711  # type: ignore
                    ),
                ),
            ),
        )
        return result.scalars().first()

    @staticmethod
    async def get_username_by_id(db: AsyncSession, user_id: int) -> str | None:
        result = await db.execute(select(User).filter_by(id=user_id))
        user = result.scalars().first()
        if user is None:
            return None
        return user.username

    @staticmethod
    async def initialize_user_settings(db: AsyncSession, user_id: int) -> UserSettings:
        result = await db.execute(select(UserSettings).filter_by(user=user_id))
        user_settings = result.scalars().first()
        if user_settings is None:
            user_settings = UserSettings(user=user_id)
            db.add(user_settings)
            await db.commit()
        return user_settings

    @staticmethod
    async def check_subscriber_exists(
        db: AsyncSession,
        email: str,
    ) -> Union[Subscriber, None]:
        try:
            # Execute the query
            result = await db.execute(select(Subscriber).filter_by(email=email))
            return result.scalars().first()
        except Exception:
            log.exception("Failed to check subscriber exists")

    @staticmethod
    async def check_if_user_previously_registered_as_guest(
        db: AsyncSession,
        username: str,
    ) -> Union[User, bool]:
        result = await db.execute(select(User).filter_by(username=username, guest=True))
        user = result.scalars().first()
        if user is not None:
            return user
        return False

    @staticmethod
    async def create_guest_account(db: AsyncSession) -> User:
        user = User(guest=True, email="", username=None)  # type: ignore
        db.add(user)
        await db.commit()
        return user

    @staticmethod
    def update_remaining_credit(
        db: Session,
        user: User,
        token_settings: TokenSettings,
    ) -> float:
        if usage_record := (
            UsageRecord.query.filter_by(user_id=user.id).order_by(UsageRecord.date.desc()).first()
        ):
            return round(usage_record.remaining_count / token_settings.tokens_per_page)
        subscription_plan = SubscriptionPlan.query.filter_by(
            id=user.subscription_plan,
        ).first()
        new_record = UsageRecord(
            user_id=user.id,
            operation_type="initializing",
            time_period="month",
            limit_count=subscription_plan.limit_count,
            operation_count=0,
            remaining_count=subscription_plan.limit_count,
        )

        db.add(new_record)
        return round(new_record.remaining_count / token_settings.tokens_per_page)

    @staticmethod
    def update_roll_over_date(user: User) -> str:
        if user.latest_roll_over is not None:
            next_roll_over = user.latest_roll_over + timedelta(days=31)
        else:
            next_roll_over = user.subscription_start_date + timedelta(days=31)
        return next_roll_over.strftime("%b %d, %Y")

    @staticmethod
    async def refund_credit(
        db: AsyncSession,
        user_id: int,
        credit: int,
        token_settings: TokenSettings,
    ) -> User:
        user = await UserManager.get_user_by_id(db, user_id)
        usage_record = await UserManager.get_latest_usage_record_for_user(db, user)
        new_credit_count = usage_record.remaining_count + credit
        new_record = UsageRecord(
            user_id=user.id,
            operation_type="refund",
            time_period="month",
            limit_count=usage_record.limit_count,
            operation_details="refund due to failed job",
            remaining_count=new_credit_count,
            operation_count=credit,
        )
        db.add(new_record)
        user.remaining_credit = round(new_credit_count / token_settings.tokens_per_page)
        return user

    @log_decorator
    @staticmethod
    def check_user_has_sufficient_credit(
        db: Session,
        user: User,
        operation_type: str,
        operation_cost: int,
        operation_details: Optional[str] = None,
    ) -> tuple[UsageRecord, bool]:
        """Not async"""
        # Check the user's remaining count for this time period
        unlimited_plan = 6
        usage_record = (
            db.query(UsageRecord)
            .filter_by(user_id=user.id)
            .order_by(UsageRecord.date.desc())
            .first()
        )
        subscription_plan: SubscriptionPlan = (
            db.query(SubscriptionPlan).filter_by(id=user.subscription_plan).first()
        )

        ## Subscription plan should never be None, but just in case
        if subscription_plan is None:
            log.error(
                "Subscription plan not found in perform operation for user %s",
                user.id,
            )
            raise HTTPException(
                status_code=500,
                detail="Subscription plan not found - please contact support",
            )

        if usage_record is None:
            log.error("no usage record found, initializing new record")
            usage_record = UserManager.non_async_initialize_new_usage_record(
                db,
                user,
                subscription_plan,
            )
            db.flush()
        else:
            remaining_count = usage_record.remaining_count
        if user.subscription_plan < unlimited_plan:
            if remaining_count < operation_cost:
                new_record = UsageRecord(
                    user_id=user.id,
                    operation_type=operation_type,
                    operation_count=operation_cost,
                    time_period="month",
                    limit_count=subscription_plan.limit_count,
                    operation_details="insufficient credit",
                    remaining_count=remaining_count,
                )

                return new_record, False
            # Perform the operation and update the usage record
            # Update the usage record
            log.debug("creating new record")
            new_record = UsageRecord(
                user_id=user.id,
                operation_type=operation_type,
                time_period="month",
                limit_count=subscription_plan.limit_count,
                operation_details=operation_details,
                operation_count=operation_cost,
            )
            log.debug(new_record)
            new_record.operation_count = operation_cost
            if usage_record is None:
                new_record.remaining_count = subscription_plan.limit_count - operation_cost
            else:
                new_record.remaining_count = usage_record.remaining_count - operation_cost
            return new_record, True
        new_record = UsageRecord(
            user_id=user.id,
            operation_type=operation_type,
            time_period="month",
            limit_count=subscription_plan.limit_count,
            operation_details=operation_details,
            operation_count=operation_cost,
            remaining_count=9999999,
        )
        return new_record, True

    @staticmethod
    def check_subscription_plan(db: Session, user: User) -> SubscriptionPlan:
        return db.query(SubscriptionPlan).filter_by(id=user.subscription_plan).first()

    @staticmethod
    async def retrieve_user_decks(db: AsyncSession, user: User) -> Sequence[Deck]:
        stmt = select(Deck).where(Deck.user_id == user.id)
        result = await db.execute(stmt)
        return result.scalars().unique().all()

    @staticmethod
    async def async_check_subscription_plan(db: AsyncSession, user: User) -> SubscriptionPlan:
        stmt = select(SubscriptionPlan).where(
            SubscriptionPlan.id == user.subscription_plan,
        )
        result = await db.execute(stmt)
        return result.scalars().first()

    ## --------------------------------------------------
    @staticmethod
    async def update_quantity_quizzes(db: AsyncSession, user: User) -> None:
        query = select(func.count()).select_from(Test).where(Test.creator == user.id)
        result = await db.execute(query)
        quantity_quizzes = result.scalar()
        if quantity_quizzes is None:
            quantity_quizzes = 0
        user.quantity_quizzes = quantity_quizzes

    @staticmethod
    async def update_quantity_decks(db: AsyncSession, user: User) -> None:
        query = select(func.count()).select_from(Deck).where(Deck.user_id == user.id)
        result = await db.execute(query)
        quantity_decks = result.scalar()
        if quantity_decks is None:
            quantity_decks = 0
        user.quantity_decks = quantity_decks

    @staticmethod
    async def update_quantity_decks_public(db: AsyncSession, user: User) -> None:
        query = (
            select(func.count())
            .select_from(Deck)
            .where(Deck.user_id == user.id, Deck.public.is_(True))
        )

        result = await db.execute(query)
        quantity_decks_public = result.scalar_one_or_none() or 0
        user.quantity_decks_public = quantity_decks_public

    @staticmethod
    async def update_quantity_files(db: AsyncSession, user: User) -> None:
        ## selectinload files and then counts them and adds them to the quantity_files column
        decks = await UserManager.retrieve_user_decks(db, user)
        files_count: int = 0
        for deck in decks:
            files_count += deck.qty_files
        user.quantity_files = files_count

    @staticmethod
    async def count_user_files(db: AsyncSession, user: User) -> None:
        stmt = select(func.sum(Deck.qty_files)).where(Deck.user_id == user.id)
        result = await db.execute(stmt)
        user.quantity_quizzes = result.scalar() or 0

    @staticmethod
    async def update_quantity_groups(db: AsyncSession, user: User) -> None:
        query = select(func.count()).select_from(Group).where(Group.creator_id == user.id)
        result = await db.execute(query)
        quantity_groups = result.scalar()
        if quantity_groups is None:
            quantity_groups = 0
        user.quantity_groups = quantity_groups

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
        result = await db.execute(select(User).filter_by(id=user_id))
        return result.scalars().first()

    @staticmethod
    async def update_quantity_cards_data_based_on_decks(db: AsyncSession, user: User) -> None:
        decks = await UserManager.retrieve_user_decks(db, user)

        new_counter = 0
        learning_counter = 0
        mastered_counter = 0
        due_counter = 0
        total_counter = 0
        decks_counter = 0
        decks_public = 0
        for deck in decks:
            if deck.public is True:
                decks_public += 1
            new_counter += deck.qty_new_cards if deck.qty_new_cards is not None else 0
            learning_counter += (
                deck.qty_cards_learning if deck.qty_cards_learning is not None else 0
            )
            mastered_counter += (
                deck.qty_cards_mastered if deck.qty_cards_mastered is not None else 0
            )
            due_counter += deck.qty_cards_due if deck.qty_cards_due is not None else 0
            total_counter += deck.qty_cards if deck.qty_cards is not None else 0
            decks_counter += 1
        user.quantity_decks_public = decks_public
        user.quantity_cards_new = new_counter
        user.quantity_cards_new = new_counter
        user.quantity_cards_learning = learning_counter
        user.quantity_cards_mastered = mastered_counter
        user.quantity_cards_due = due_counter
        user.quantity_cards = total_counter
        user.quantity_decks = decks_counter

    @staticmethod
    async def update_quantity_cards_data(db: AsyncSession, user: User) -> None:
        """Should rarely be used, prioritize the one above that gets the data
        from each deck instead of calculating it
        """
        result = await db.execute(
            select(Deck)
            .options(
                joinedload(Deck.cards).load_only(
                    Card.times_asked,
                    Card.box_id,
                    Card.srs_interval,
                    Card.time_updated,
                ),
            )
            .where(Deck.user_id == user.id),
        )
        decks = result.scalars().unique().all()
        new_counter = 0
        learning_counter = 0
        mastered_counter = 0
        due_counter = 0
        total_counter = 0
        decks_counter = 0
        decks_public = 0
        for deck in decks:
            await DeckManager.update_card_quantity_data(deck)
            if deck.public is True:
                decks_public += 1
            new_counter += deck.qty_new_cards
            learning_counter += deck.qty_cards_learning
            mastered_counter += deck.qty_cards_mastered
            due_counter += deck.qty_cards_due
            total_counter += deck.qty_cards
            decks_counter += 1
        user.quantity_decks_public = decks_public
        user.quantity_cards_new = new_counter
        user.quantity_cards_new = new_counter
        user.quantity_cards_learning = learning_counter
        user.quantity_cards_mastered = mastered_counter
        user.quantity_cards_due = due_counter
        user.quantity_cards = total_counter
        user.quantity_decks = decks_counter

    @staticmethod
    async def update_quantity_cards_new(db: AsyncSession, user: User) -> int:
        # Fetch decks with cards using an async query
        result = await db.execute(
            select(Deck)
            .options(joinedload(Deck.cards).load_only(Card.times_asked))
            .where(Deck.user_id == user.id),
        )
        decks = result.scalars().unique().all()
        log.debug(decks)
        # Count cards with times_asked == 0
        counter = 0
        for deck in decks:
            for card in deck.cards:
                if card.times_asked == 0:
                    counter += 1
                    log.debug(counter)
        user.quantity_cards_new = counter
        return counter

    ## TODO this function does too much, break it up into smaller functions
    @staticmethod
    async def async_remaining_credit(
        db: AsyncSession,
        user: User,
        token_settings: TokenSettings,
    ) -> None:
        ## gets the latest row from the usage record table and enters the remaining
        # credit value into the user table
        log.debug("entered remaining credit")
        usage_record_query = (
            select(UsageRecord)
            .where(UsageRecord.user_id == user.id)
            .order_by(UsageRecord.date.desc())
            .limit(1)
        )
        result = await db.execute(usage_record_query)
        usage_record = result.scalars().first()
        if usage_record:
            user.remaining_credit = round(
                usage_record.remaining_count / token_settings.tokens_per_page,
            )
            await db.commit()
        else:
            subscription_plan = await UserManager.retrieve_sub_plan(db, user)
            new_record = await UserManager.initialize_new_usage_record(
                db,
                user,
                subscription_plan,
            )
            user.remaining_credit = round(
                new_record.remaining_count / token_settings.tokens_per_page,
            )

    @staticmethod
    async def retrieve_sub_plan(db: AsyncSession, user: User) -> SubscriptionPlan:
        result = await db.execute(
            select(SubscriptionPlan).where(
                SubscriptionPlan.id == user.subscription_plan,
            ),
        )
        subscription_plan = result.scalars().first()
        if subscription_plan is None:
            log.error(
                "Subscription plan not found in perform operation for user %s",
                user.id,
            )
            raise HTTPException(
                status_code=500,
                detail="Subscription plan not found - please contact support",
            )
        return subscription_plan

    @staticmethod
    async def initialize_new_usage_record(
        db: AsyncSession,
        user: User,
        subscription_plan: SubscriptionPlan,
    ) -> UsageRecord:
        new_record = UsageRecord(
            user_id=user.id,
            operation_type="initializing",
            time_period="month",
            limit_count=subscription_plan.limit_count,
            operation_count=0,
            remaining_count=subscription_plan.limit_count,
            operation_details="initializing new user record",
        )
        db.add(new_record)
        return new_record

    @staticmethod
    def non_async_initialize_new_usage_record(
        db: Session,
        user: User,
        subscription_plan: SubscriptionPlan,
    ) -> UsageRecord:
        new_record = UsageRecord(
            user_id=user.id,
            operation_type="initializing",
            time_period="month",
            limit_count=subscription_plan.limit_count,
            operation_count=0,
            remaining_count=subscription_plan.limit_count,
            operation_details="initializing new user record",
        )
        db.add(new_record)
        return new_record

    @staticmethod
    async def delete_profile_picture(user: User) -> User:
        try:
            StorageManager.delete_s3_object_in_folder("profile_pictures", user.pic)
        except Exception:
            log.exception("Error deleting profile pic from s3")
        user.pic = ""
        return user

    @staticmethod
    async def upload_profile_picture(
        user: User,
        profile_pic: UploadFile,
        aws_settings: AWSSettings,
    ) -> User:
        if profile_pic.filename is None:
            raise HTTPException(status_code=400, detail="No file uploaded")
        if profile_pic and StorageManager.allowed_img_file(profile_pic.filename):
            filename = f"{user.id}_{Helpers.secure_filename(profile_pic.filename)}"
            temp_path = os.path.join(tempfile.gettempdir(), filename)  # noqa: PTH118

            with open(temp_path, "wb") as buffer:  # noqa: ASYNC230, PTH123
                shutil.copyfileobj(profile_pic.file, buffer)

            StorageManager.upload_to_s3("profile_pictures", temp_path, filename)
            os.remove(temp_path)  # noqa: PTH107
            if user.pic is not None:
                try:
                    StorageManager.delete_s3_object_in_folder(
                        "profile_pictures",
                        user.pic,
                    )
                except Exception:
                    log.exception("Error deleting profile pic from s3: %s", user.pic)
            s3_pic_bucket = f"{aws_settings.s3_uri}/profile_pictures/"
            user.pic = s3_pic_bucket + filename
            return user

        raise HTTPException(status_code=400, detail="Invalid file type")

    @staticmethod
    async def delete_user_account(
        db: AsyncSession,
        user: User,
        final_reason: str,
        more: str,
    ) -> None:
        user.account_status = "inactive"
        user.expiration = dt.datetime.now()
        user.account_expiration_reason = "Deleted"
        deleted_entry = DeletedAccounts(
            user_id=user.id,
            email=user.email,
            time_created=user.time_created,
            time_deleted=dt.datetime.now(),
            reason=final_reason,
            reason_details=more,
        )
        db.add(deleted_entry)
        await db.commit()

    @staticmethod
    async def get_latest_usage_record_for_user(
        db: AsyncSession,
        user: User,
    ) -> UsageRecord:
        stmt = (
            select(UsageRecord)
            .where(UsageRecord.user_id == user.id)
            .order_by(UsageRecord.date.desc())
            .limit(1)
        )
        result = await db.execute(stmt)
        return result.scalars().first()

    @staticmethod
    async def check_user_subscription(user: User, subscription_plan: int = 3) -> None:
        if user.subscription_plan < subscription_plan:
            raise HTTPException(
                status_code=403,
                detail="You need a subscription to use this feature",
            )

    @staticmethod
    async def get_remaining_picture_count(db: AsyncSession, user: User) -> int:
        stmt = (
            select(UsageRecord)
            .where(user.id == UsageRecord.user_id)  # type: ignore
            .order_by(UsageRecord.date.desc())
            .limit(1)
        )
        result = await db.execute(stmt)
        count = result.scalars().first()
        if count is None or count.remaining_count is None or count.remaining_count < 1:
            return 0

        return count.remaining_count

    @staticmethod
    async def check_image_permission(db: AsyncSession, user: User) -> int:
        await UserManager.check_user_subscription(user)
        return await UserManager.get_remaining_picture_count(db, user)

    @staticmethod
    async def update_remaining_pic_count(
        db: AsyncSession,
        user: User,
        remaining_pic_count: int,
    ) -> None:
        usage_record = await UserManager.get_latest_usage_record_for_user(db, user)
        usage_record.remaining_pictures = remaining_pic_count

    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Union[User, None]:
        result = await db.execute(
            select(User).where(
                User.email == email,
            ),
        )
        return result.scalars().first()

    # @staticmethod
    # ## TODO check if this is used - if so there might be some problems with it
    # async def async_update_remaining_credit(db: AsyncSession, user: User) -> float:
    #     # Async query for the latest UsageRecord
    #     usage_record_query = (
    #         select(UsageRecord)
    #         .where(UsageRecord.user_id == user.id)
    #         .order_by(UsageRecord.date.desc())
    #         .limit(1)
    #     )
    #     result = await db.execute(usage_record_query)
    #     usage_record = result.scalars().first()

    #     if usage_record:
    #         return round(usage_record.remaining_count / token_settings.tokens_per_page)

    #     # Async query for SubscriptionPlan
    #     subscription_plan_query = select(SubscriptionPlan).where(
    #         SubscriptionPlan.id == user.subscription_plan
    #     )
    #     result = await db.execute(subscription_plan_query)
    #     subscription_plan = result.scalars().first()

    #     if not subscription_plan:
    #         new_record = UsageRecord(
    #             user_id=user.id,
    #             operation_type="initializing",
    #             time_period="month",
    #             limit_count=subscription_plan.limit_count,
    #             operation_count=0,
    #             remaining_count=subscription_plan.limit_count,
    #         )

    #     db.add(new_record)
    #     await db.commit()  # Use await with db.commit()
    #     return round(new_record.remaining_count / token_settings.tokens_per_page)
