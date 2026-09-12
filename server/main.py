import asyncio
import logging

import dotenv
import sentry_sdk

from dependencies.settings import get_settings
from factory import create_app

log = logging.getLogger("App")

log.info("STARTING APP...")
settings = get_settings()


if settings.monitoring.monitoring_enabled:
    log.info("MONITORING ENABLED...")
    sentry_sdk.init(
        dsn=settings.monitoring.sentry_dsn,
        traces_sample_rate=settings.monitoring.traces_sample_rate,
        profiles_sample_rate=settings.monitoring.profiles_sample_rate,
        release=settings.app.version,
    )

app = create_app()

if settings.app.environment == "development":

    @app.get("/")
    async def read_main():  # noqa: ANN201
        return {"msg": "Hello Sea World"}


if __name__ == "__main__":
    import uvicorn

    asyncio.get_event_loop().set_debug(bool(settings.app.debug))
    uvicorn.run(
        app,
        host=settings.app.host,
        port=int(settings.app.port),
        log_level=settings.logging.level,
    )
