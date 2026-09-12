# noqa: ruff


import json
import os
from time import time
from unittest.mock import Mock, patch

import pytest
import stripe
from fastapi.testclient import TestClient
import httpx
from sqlalchemy.sql import select

from dependencies.db import get_db
from main import app as main_app
from models.subscriptions.sub_handler import StripeEventHandler
from models.user.user import User

# client = TestClient(main_app)  # Legacy - commented out for new test structure

price_id_basic = "price_1OwA7iGXWJkeH44yarhphniI"  # price id that correlates with basic month
# subscription from subscription_plans table
user_id = 1  # id of test user Radagast
customer_id = "cus_Rh0sG0b3LbR0wn"  # stripe customer id for user Radagast
api_key = "sk_test_51N5ZKqGXWJkeH44yQs5x0qRBCGYAcueCMdGt1K6f5RRydQmOcWuV7UMS14ArPd1Ry3WeGuCleOwtsD99rTgDJ95X00WqjYoieF"  # noqa: E501
# stripe test api key


def generate_header(payload: str, secret: str) -> str:
    """Generate test stripe header"""
    timestamp = int(time())
    scheme = stripe.WebhookSignature.EXPECTED_SCHEME
    payload_to_sign = f"{timestamp}.{payload}"
    signature = stripe.WebhookSignature._compute_signature(payload_to_sign, secret)
    return f"t={timestamp},{scheme}={signature}"


def create_payload(p_type: str, status: str = "trialing"):
    """Create test stripe payload"""
    return {
        "id": "evt_test_webhook",
        "object": "event",
        "type": p_type,
        "data": {
            "object": {
                "id": customer_id,
                "client_reference_id": user_id,
                "status": status,
                "object": "checkout.session",
                "amount_total": 2099,
                "currency": "usd",
                "payment_status": "paid",
                "payment_method_types": ["card"],
                "success_url": "https://example.com/success",
                "cancel_url": "https://example.com/cancel",
                "items": {
                    "data": [
                        {
                            "price": {
                                "id": price_id_basic,
                            },
                        },
                    ],
                },
            },
        },
    }


@pytest.fixture()
def mock_stripe_subscription_list() -> dict:
    """Return mock stripe subscription list to avoid calling stripe api"""
    return {
        "data": [
            {
                "id": "sub_1JN5Yc2eZvKYlo2CGk3KpQkW",
                "items": {
                    "data": [
                        {"price": {"id": price_id_basic}},
                    ],
                },
                "status": "active",
            },
        ],
    }


@pytest.mark.asyncio()
async def test_stripe_webhook(mocked_app: Mock) -> None:
    """Testing if webhook is working with event that doesnt require calling StripeEventHandler"""
    async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
        stripe.api_key = api_key

        payload = {
            "id": "evt_test_webhook",
            "object": "event",
            "type": "payment_intent.succeeded",
        }

        payload_string = json.dumps(payload)
        secret = os.getenv("STRIPE_SIGNING_SECRET")
        if not secret:
            raise ValueError("No secret")
        header = generate_header(payload_string, secret)
        response = await ac.post(
            "/webhooks/stripe",
            json=payload,
            headers={"stripe-signature": header},
        )

        data = response.json()
        assert response.status_code == 200


@pytest.mark.asyncio()
async def test_stripe_event(mocked_app):
    """Testing stripe event without calling handler function inside StripeEventHandler"""
    async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
        stripe.api_key = api_key

        payload = create_payload("invoice.payment_succeeded")

        payload_string = json.dumps(payload)
        secret = os.getenv("STRIPE_SIGNING_SECRET")
        if not secret:
            raise ValueError("No secret")
        header = generate_header(payload_string, secret)
        response = await ac.post(
            "/webhooks/stripe",
            json=payload,
            headers={"stripe-signature": header},
        )

        assert response.status_code == 200
        # assert data["status"] == "success"


@pytest.mark.asyncio()
@patch.object(StripeEventHandler, "get_subscription_list")
async def test_stripe_checkout(mock_stripe_subscription_list, mocked_app):
    mock_stripe_subscription_list.return_value = {
        "data": [
            {
                "id": "sub_1JN5Yc2eZvKYlo2CGk3KpQkW",
                "items": {
                    "data": [
                        {"price": {"id": price_id_basic}},
                    ],
                },
                "status": "trialing",
            },
        ],
    }
    async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
        stripe.api_key = api_key

        payload = create_payload("checkout.session.completed")
        payload_string = json.dumps(payload)
        secret = os.getenv("STRIPE_SIGNING_SECRET")
        if not secret:
            msg = "No secret"
            raise ValueError(msg)
        header = generate_header(payload_string, secret)
        response = await ac.post(
            "/webhooks/stripe",
            json=payload,
            headers={"stripe-signature": header},
        )
        assert response.status_code == 200


@pytest.mark.asyncio()
@patch.object(StripeEventHandler, "get_subscription_list")
async def test_stripe_subscription_update(mock_stripe_subscription_list, mocked_app):
    mock_stripe_subscription_list.return_value = {
        "data": [
            {
                "id": "sub_1JN5Yc2eZvKYlo2CGk3KpQkW",
                "items": {
                    "data": [
                        {"price": {"id": price_id_basic}},
                    ],
                },
                "status": "active",
            },
        ],
    }

    async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
        stripe.api_key = api_key

        payload = create_payload("customer.subscription.updated", status="active")

        payload_string = json.dumps(payload)
        secret = os.getenv("STRIPE_SIGNING_SECRET")
        if not secret:
            msg = "No secret"
            raise ValueError("No secret")
        header = generate_header(payload_string, secret)
        response = await ac.post(
            "/webhooks/stripe",
            json=payload,
            headers={"stripe-signature": header},
        )
        assert response.status_code == 200

        mocked_get_db = mocked_app.dependency_overrides.get(get_db)

        async for db in mocked_get_db():
            async with db.begin():
                result = await db.execute(select(User).filter_by(id=1))
                user = result.scalar_one_or_none()

        assert user is not None
        assert user.id == 1


@pytest.mark.asyncio()
async def test_stripe_trial_end(mocked_app):
    async with AsyncClient(app=mocked_app, base_url="http://test") as ac:
        stripe.api_key = api_key

        payload = create_payload("customer.subscription.trial_will_end")
        payload_string = json.dumps(payload)
        secret = os.getenv("STRIPE_SIGNING_SECRET")
        if not secret:
            raise ValueError("No secret")
        header = generate_header(payload_string, secret)
        response = await ac.post(
            "/webhooks/stripe",
            json=payload,
            headers={"stripe-signature": header},
        )
        assert response.status_code == 200
