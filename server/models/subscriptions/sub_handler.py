import datetime as dt
import json
import logging
import os
import time
from typing import Union

import stripe
from sqlalchemy.orm import Session
from stripe import Event, InvalidRequestError, ListObject, Subscription

from config import EmailSettings, Settings, StripeSettings
from dependencies.db import GetSyncDb
from models.models_ import SubscriptionPlan, UsageRecord, User
from models.send_email import Emailer
from models.subscriptions.stripe_events import StripeEvents

log = logging.getLogger("payment")

### which event to handle for unpaid subscription
### which one to handle for cancelled subscription
### error handling for stripe customer id conflict
### error handling for stripe customer id not found
### automatic invoice emailing + sending email. <- maybe include link to invoice instead


## Free trial for 7 days --> after which they are automatically billed for a month
## if they cancel, they are set to free tier
## if they update their subscription, they are updated to the new plan
## for premium subscribers their credits roll over from month to month if they are not used


class StripeEventHandler:
    def __init__(
        self,
        api_key: str,
        stripe_settings: StripeSettings,
        settings: Settings,
        db: GetSyncDb,
    ):
        stripe.api_key = api_key
        self.plan_modifier = PlanModifier(settings, db)
        self.customer_id: str | None = None
        self.user_id: int | None = None
        self.price_id: str | None = None
        self.subscription_id: str = ""
        self.account_status = None
        self.event_type = None
        self.customer_email = None
        self.payment_settings: StripeSettings = stripe_settings
        self.email_settings: EmailSettings = settings.email
        self.db = db

    @classmethod
    def create(
        cls,
        event: Event,
        api_key: str,
        stripe_settings: StripeSettings,
        settings: Settings,
        db: GetSyncDb,
    ) -> "StripeEventHandler":
        instance = cls(api_key, stripe_settings, settings, db)
        instance.handle_event(event)
        return instance

    def handle_event(self, event: Event) -> None:
        self.event_type = event["type"]

        customer_data = event["data"]["object"]
        if "customer" in customer_data:
            self.customer_id = customer_data.get("customer")
        else:
            self.customer_id = customer_data["id"]

        self.customer_email = customer_data.get("email")

        self.price_id = (
            event["data"]["object"].get("items", {}).get("data", [{}])[0].get("price", {}).get("id")
        )

        self.subscription_id = event["data"]["object"].get("subscription", "")
        self.account_status = event["data"]["object"].get("status")

        # user id is passed only in event with type: "checkout.session.completed".
        # It is first event that handled by this function
        self.user_id = event["data"]["object"].get("client_reference_id")
        if self.user_id is None:
            self.user_id = event["data"]["object"].get("metadata", {}).get("user_id")
        if self.user_id is None:
            user = self.db.query(User).filter_by(stripe_customer_id=self.customer_id).first()
            if user:
                self.user_id = user.id

        if self.user_id:
            self.log_stripe_event(event)

        log.debug(
            """customer_id: %s, user_id: %s, price_id: %s, 
            account_status: %s, customer_email: %s""",
            self.customer_id,
            self.user_id,
            self.price_id,
            self.account_status,
            self.customer_email,
        )
        ## Use to associate user_id with stripe customer id
        if self.event_type == "checkout.session.completed":
            self.handle_checkout_session()

        ## associate stripe customer id with my customer id
        elif self.event_type == "customer.created":
            self.handle_customer_creation()

        ## create customer subscription
        elif self.event_type == "customer.subscription.created":
            self.handle_subscription_creation()

        ## Set customer subscription to free tier
        elif self.event_type == "customer.subscription.deleted":
            self.handle_subscription_deletion()

        ## update customer subscription
        elif self.event_type == "customer.subscription.updated":
            self.handle_subscription_update()

        ## send email notification trial will end
        elif self.event_type == "customer.subscription.trial_will_end":
            self.handle_subscription_trial_end()

        ## set customer subscription to free tier
        elif self.event_type == "customer.deleted":
            self.handle_customer_deletion()

        ## update customer details
        elif self.event_type == "customer.updated":
            self.handle_customer_update()

        elif self.event_type == "invoice.created":
            self.handle_invoice_created()

        elif self.event_type == "invoice.payment_failed":
            self.handle_invoice_payment_failed()

        elif self.event_type == "invoice.payment_succeeded":
            self.handle_invoice_payment_succeeded()

        # elif self.event_type == "invoice.paid":
        #     self.handle_invoice_paid()

        elif self.event_type == "invoice.updated":
            self.handle_invoice_updated()

        elif self.event_type == "invoice.finalized":
            self.handle_invoice_finalized()

        elif self.event_type == "invoice_finalization_failed":
            self.handle_invoice_finalization_failed()

    def handle_customer_creation(self) -> None:
        log.info("customer created, not implemented")

    ## this is likely redundant
    def handle_subscription_creation(self) -> None:
        log.info("subscription created")
        self.verify_price_id()
        self.vertify_user_id()
        if self.account_status == "trialing":
            self.plan_modifier.update_user_subscription(
                self.user_id,  # type: ignore
                self.price_id,  # type: ignore
                self.account_status,
                subscription_id=self.subscription_id,
            )
        if self.account_status == "active":
            self.plan_modifier.update_user_subscription(
                self.user_id,  # type: ignore
                self.price_id,  # type: ignore
                self.account_status,
            )
        if self.account_status == "paid":
            self.plan_modifier.update_user_subscription(
                self.user_id,  # type: ignore
                self.price_id,  # type: ignore
                self.account_status,
            )

    def handle_subscription_deletion(self) -> None:
        log.info("subscription deleted")
        self.verify_price_id()
        self.vertify_user_id()
        self.plan_modifier.update_user_subscription(
            self.user_id,  # type: ignore
            self.price_id,  # type: ignore
            self.account_status,
        )

    def handle_subscription_update(self) -> None:
        log.info("handle subscription update")
        ## ensure subscription is active
        self.verify_price_id()
        self.vertify_user_id()
        if self.account_status == "active":
            self.plan_modifier.update_user_subscription(
                self.user_id,  # type: ignore
                self.price_id,  # type: ignore
                self.account_status,
            )
        if self.account_status == "canceled":
            self.plan_modifier.update_user_subscription(
                self.user_id,  # type: ignore
                self.price_id,  # type: ignore
                self.account_status,
            )

    def vertify_user_id(self) -> None:
        if self.user_id is None:
            msg = "user_id is not set"
            raise ValueError(msg)

    def verify_price_id(self) -> None:
        if self.price_id is None:
            msg = "price_id is not set"
            raise ValueError(msg)

    def handle_subscription_trial_end(self) -> Union[Emailer, None]:
        log.info("trial ending in 3 days for %s", self.user_id)
        user = self.db.query(User).filter_by(stripe_customer_id=self.customer_id).first()
        if not user:
            log.exception(
                "handle_subscription_trial_end error. User for customer %s not found",
                self.customer_id,
            )
            return
        Emailer.send_email(
            self.email_settings,
            user.email,
            user.first_name,
            "trial_over",
        )

    def handle_new_subscription_with_existing_customer(
        self,
        db: Session,
        user: User,
        stripe_customer_id: int,
    ) -> None:
        log.info(
            "changing user %s to have a new stripe customer id %s, previous stripe id was %s",
            user.id,
            stripe_customer_id,
            user.stripe_customer_id,
        )
        user.stripe_customer_id = str(stripe_customer_id)
        db.commit()

    ##TODO- send an invoice - This is actually not necessary since stripe handles this for us
    # def handle_invoice_paid(self) -> Emailer | None:
    #     log.info("invoice paid")
    #     invoice_url = self.event_data["data"]["object"]["hosted_invoice_url"]
    #     user = self.db.query(User).filter_by(stripe_customer_id=self.customer_id).first()
    #     if not user:
    #         log.error(
    #             f"handle_invoice_paid error. User for customer {self.customer_id} not found",
    #         )
    #         return
    #     Emailer.send_email(
    #         self.email_settings,
    #         user.email,
    #         user.first_name,
    #         "invoice_paid",
    #         link=invoice_url,
    #     )

    def handle_customer_deletion(self) -> None:
        log.info("customer deleted")
        if self.user_id is None:
            msg = "user_id is not set"
            raise ValueError(msg)
        if self.price_id is None:
            msg = "price_id is not set"
            raise ValueError(msg)
        self.plan_modifier.update_user_subscription(
            self.user_id,
            self.price_id,
            "canceled",
        )

    def handle_customer_update(self) -> None:
        log.info("customer updated - Not implemented")

    def get_subscription_list(self) -> ListObject[Subscription]:
        if self.customer_id is None:
            msg = "No customer id is not set"
            raise ValueError(msg)
        return stripe.Subscription.list(customer=self.customer_id)

    def handle_checkout_session(self) -> None:
        log.debug("user_id: %s", self.user_id)
        self.associate_stripe_customer_with_user()
        self.add_user_id_metadata_to_stripe_customer()
        if self.customer_id is None:
            msg = "No customer id is not set"
            raise ValueError(msg)
        subscriptions = self.get_subscription_list()
        is_updated = False
        if subscriptions and subscriptions["data"]:
            price_id = subscriptions["data"][0]["items"]["data"][0]["price"]["id"]  # type: ignore
            account_status = subscriptions["data"][0]["status"]  # type: ignore
            if price_id != self.price_id or account_status != self.account_status:
                is_updated = True
                self.price_id = price_id
                self.account_status = account_status
        else:
            log.error("Stripe subscriptions list is empty")
            return
        if self.user_id is None:
            msg = "user_id is not set"
            raise ValueError(msg)
        if self.price_id is None:
            msg = "price_id is not set"
            raise ValueError(msg)
        if is_updated:
            self.plan_modifier.update_user_subscription(
                self.user_id,
                self.price_id,
                self.account_status,
                subscription_id=self.subscription_id,
            )

    def associate_stripe_customer_with_user(
        self,
    ) -> None:
        log.debug("calling associate_stripe_customer_with_user")
        log.info(
            "associating stripe customer id %s with user %s",
            self.customer_id,
            self.user_id,
        )
        user = self.db.query(User).filter_by(id=self.user_id).first()

        if not user:
            log.exception("User %s not found", self.user_id)
            return

        if not self.customer_id:
            log.exception("stripe customer id %s not found", self.customer_id)
            return

        if user.stripe_customer_id:
            if user.stripe_customer_id == self.customer_id:
                log.info(
                    "User %s already has a stripe customer id %s, which matches %s",
                    self.user_id,
                    user.stripe_customer_id,
                    self.customer_id,
                )
                return
            error_message = (
                """User %s already has a stripe customer id %s, which conflicts with: %s -
                modifying to use new stripe id""",
                self.user_id,
                user.stripe_customer_id,
                self.customer_id,
            )
            log.critical(error_message)
            event = StripeEvents(
                event_type="customer_id_conflict",
                user_id=self.user_id,
                stripe_customer_id=user.stripe_customer_id,
                error_message=error_message,
            )
            self.db.add(event)

        user.stripe_customer_id = self.customer_id
        self.db.commit()
        return

    def add_user_id_metadata_to_stripe_customer(self) -> None:
        log.debug("calling add_user_id_metadata_to_stripe_customer")
        log.debug(self.user_id)
        if not self.user_id:
            log.exception("User id %s not found", self.user_id)
            return
        try:
            log.debug(self.customer_id)
            stripe.Customer.modify(
                str(self.customer_id),
                metadata={"user_id": str(self.user_id)},
            )
            time.sleep(2)
        except InvalidRequestError as e:
            log.exception(
                "Unable associate meta data with user, stripe customer id does not exist",
            )
            raise e

    def log_stripe_event(self, event):
        time_created = dt.datetime.now()
        stripe_event = StripeEvents(
            stripe_event_id=event["id"],
            event_type=event["type"],
            event_data=json.dumps(event),
            time_created=time_created,
            user_id=self.user_id,
            stripe_customer_id=self.customer_id,
        )
        self.db.add(stripe_event)
        self.db.commit()
        return stripe_event

    ### no use for handling these events
    def handle_invoice_created(self) -> None:
        log.info("invoice created - Not implemented")

    def handle_invoice_payment_failed(self) -> None:
        log.error("invoice payment failed - Not implemented")

    def handle_invoice_payment_succeeded(self) -> None:
        log.info("invoice payment succeeded - Not implemented")

    def handle_invoice_updated(self) -> None:
        log.info("invoice updated - Not implemented")

    def handle_invoice_finalized(self) -> None:
        log.info("invoice finalized - Not implemented ")

    def handle_invoice_finalization_failed(self) -> None:
        log.info("invoice finalization failed - Not implemented")


class PlanModifier:
    def __init__(self, settings: Settings, db: GetSyncDb) -> None:
        self.user = None
        self.plan = None
        self.payment_settings: Settings = settings
        self.db = db

    ## statuses that must be handled trialing, active, cancelled

    def update_user_subscription(
        self,
        user_id: int,
        price_id: str,
        status,
        subscription_id: str = "",
    ):
        if not user_id:
            log.critical("Unable to update user subscription, user_id is not set")
            return None
        user = self.db.query(User).filter_by(id=user_id).first()
        self.user = user
        # stripe_id field in subscription_plan table contains price_id`s of subscription plans
        self.plan = self.db.query(SubscriptionPlan).filter_by(stripe_id=price_id).first()

        if not self.plan:
            log.critical(
                """Unable to update user subscription, plan for price_id %s not found""",
                price_id,
            )
            return None

        plan_sub = self.plan.id

        if not user:
            log.critical(
                "Unable to update user subscription, user_id %s not found",
                user_id,
            )
            return None

        ## if the sub plan and status are the same, nothing has changed
        if user.account_status == status and plan_sub == user.subscription_plan:
            log.exception("user %s is already in %s mode.", user.id, status)
            self.db.commit()
            return f"user is already in {status} mode"
        ## otherwise update the subscription plan details
        user.subscription_plan = plan_sub
        user.subscription_start_date = dt.datetime.now()
        user.subscription_latest_roll_over = dt.datetime.now()
        user.account_status = status

        if status == "trialing":
            if user.used_trial:
                if subscription_id:
                    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
                    try:
                        _ = stripe.Subscription.cancel(subscription_id)
                    except Exception:
                        log.exception("Stripe error while cancelling subscription")
                log.exception("User %s has used trial already", user.username)
                return None

            user.subscription_end_date = dt.datetime.now() + dt.timedelta(days=7)
            user.used_trial = True

        if status == "canceled":
            user.subscription_plan = 1  # id of free plan
            user.account_status = "free"
            Emailer.send_email(
                self.payment_settings.email,
                user.email,
                user.first_name,
                "sub_cancelled",
            )
            free_plan = self.db.query(SubscriptionPlan).filter_by(id=1).first()
            if not free_plan:
                log.error("Cant get free plan from db")
                return None
            self.set_usage_limit(user, free_plan["limit_count"])
            self.db.commit()
            return None

        self.set_usage_limit(user, self.plan.limit_count)
        self.db.commit()
        return None

    def set_usage_limit(self, user: User, n: int) -> None:
        if self.plan and self.plan.name in ["premium_yearly", "premium_monthly"]:
            latest_record = (
                self.db.query(UsageRecord)
                .filter_by(user_id=user.id)
                .order_by(UsageRecord.date.desc())
                .first()
            )
            if latest_record:
                n = latest_record.remaining_count + n
        new_record = UsageRecord(
            user_id=user.id,
            operation_type="Update plan",
            limit_count=n,
            operation_details="Update plan",
            operation_count=0,
            remaining_count=n,
            date=dt.datetime.now(),
            time_period="month",
        )
        self.db.add(new_record)
        self.db.commit()
