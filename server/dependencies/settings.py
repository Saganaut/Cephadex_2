from functools import lru_cache
from typing import Annotated

from fastapi import Depends

from config import Settings, StripeSettings


@lru_cache
def get_settings() -> Settings:
    return Settings()


@lru_cache
def get_stripe_settings() -> StripeSettings:
    return StripeSettings()  # type: ignore


PaymentSettings = Annotated[StripeSettings, Depends(get_stripe_settings)]
AppSettings = Annotated[Settings, Depends(get_settings)]
