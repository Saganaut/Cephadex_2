import logging
import os

import stripe
from fastapi import APIRouter, HTTPException, Request
from stripe import SignatureVerificationError

from dependencies.db import GetSyncDb
from dependencies.settings import AppSettings, PaymentSettings
from dependencies.subscriptions import StripeSubPlans
from models.subscriptions.sub_handler import StripeEventHandler

logger = logging.getLogger("payments")

#### TEST DATA
#### pk_test_51N5ZKqGXWJkeH44y38yc4CxMSTBwo3h8kf76qXVJRqkMlWhRdZ5SfEX0NVZWKEclk3Q2MuGu6m3cfFHW0XCI52Xf00eYMc72Tp # noqa: E501
#### sk_test_51N5ZKqGXWJkeH44yQs5x0qRBCGYAcueCMdGt1K6f5RRydQmOcWuV7UMS14ArPd1Ry3WeGuCleOwtsD99rTgDJ95X00WqjYoieF  # noqa: E501
####<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
####<stripe-pricing-table pricing-table-id="prctbl_1OwABIGXWJkeH44yT6EXkeFc"
####publishable-key="pk_test_51N5ZKqGXWJkeH44y38yc4CxMSTBwo3h8kf76qXVJRqkMlWhRdZ5SfEX0NVZWKEclk3Q2MuGu6m3cfFHW0XCI52Xf00eYMc72Tp">
###</stripe-pricing-table>
### premium yearly price_1OwAAIGXWJkeH44yuQ06U9eB
### premium monthly price_1OwA9tGXWJkeH44yR2oi0aw2
### standard monthly price_1OwA7iGXWJkeH44yarhphniI
### standard yerly price_1OwA8bGXWJkeH44yuydIi7K1


# ID NAME         DESCRIPTION	                 CREDITS   MONTHLY	PRICE	PERIOD
# 1	free	    free account	                  40000	   month	  0	     31
# 2	standard	standard tier paid account	     480000	   month	   4.99	 31
# 3	standard	standard tier paid account	     480000	   month	47.99	 365
# 4	premium	    premium paid account	          1600000	month	9.99	 31
# 5	premium	    premium paid account	          1600000	month	95.99	 365
## Month and period are just for reference


router = APIRouter(
    prefix="/webhooks",
    tags=["webhooks"],
)


@router.post("/stripe", tags=["webhooks"])
async def stripe_webhook(  # noqa: ANN201
    request: Request,
    payment_settings: PaymentSettings,
    settings: AppSettings,
    StripePlans: StripeSubPlans,  # noqa: N803, ARG001
    db: GetSyncDb,
):
    stripe_api_key = os.getenv("STRIPE_SECRET_KEY")  # noqa: F841
    signing_secret = os.getenv("STRIPE_SIGNING_SECRET")
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    event = None

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, signing_secret)  # type: ignore ## TODO - not sure why I am getting a warning here
    except ValueError as e:
        logger.exception("An exception occurred in stribe_webhook() route)")
        raise HTTPException(status_code=400, detail="Invalid payload") from e
    except SignatureVerificationError as e:
        logger.exception("Signature verification error")
        raise HTTPException(status_code=400, detail="Invalid signature") from e
    except Exception as e:
        logger.exception(
            "An unexpected exception occurred in stribe_webhook() route)",
        )
        raise HTTPException(status_code=400, detail="Unexpected error") from e
    if event["type"] in payment_settings.valid_events:
        StripeEventHandler.create(
            event,
            payment_settings.secret_key,
            payment_settings,
            settings,
            db,
        )
        # stripe_event_handler.handle_event(event)
    else:
        return "Unused event type", 200
    return "Success", 200
