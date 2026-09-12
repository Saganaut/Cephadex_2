import logging
import time

from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from dependencies.settings import get_settings

logger = logging.getLogger("App")
logger.propagate = False

settings = get_settings()


class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = None
        if settings.logging.level == "DEBUG":
            start_time = time.time()
            response = await call_next(request)
            process_time = time.time() - start_time
            logger.debug(
                f"Path: {request.url.path}, Method: {request.method}, Duration: {process_time:.4f} seconds",
            )
        else:
            response = await call_next(request)
        return response


def setup_middlewares(app):
    print("settings.cors.origins", settings.cors.origins)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors.origins,
        allow_credentials=settings.cors.allow_credentials,
        allow_methods=settings.cors.allow_methods,
        allow_headers=settings.cors.allow_headers,
    )
    if settings.logging.level == "INFO" or settings.logging.level == "DEBUG":
        app.add_middleware(TimingMiddleware)
