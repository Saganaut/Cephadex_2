from fastapi import APIRouter

from .group_decks import group_decks_router
from .group_main import group_main_router
from .permissions import permissions_router
from .shared import shared_router

router = APIRouter(
    prefix="/group",
    tags=["group"],
)
router.include_router(group_main_router)
router.include_router(shared_router)
router.include_router(permissions_router)
router.include_router(group_decks_router)
