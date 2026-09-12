from fastapi import APIRouter

from .account import account_router
from .auth import auth_router
from .newsletter import newsletter_router
from .notifications import notifications_router
from .search import search_router
from .settings import settings_router

router = APIRouter(
    prefix="/user",
    tags=["user"],
)
router.include_router(settings_router, prefix="")
router.include_router(newsletter_router, prefix="")
router.include_router(auth_router, prefix="")
router.include_router(notifications_router, prefix="")
router.include_router(account_router, prefix="")
router.include_router(search_router, prefix="")
