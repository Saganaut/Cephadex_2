from fastapi import APIRouter

from .ai_generation import ai_generation_router
from .files import files_router
from .import_export import import_export_router
from .main_deck import main_deck_router
from .notifications import deck_notifications_router
from .public import public_router
from .relationships import relationships_router
from .shared import shared_router

router = APIRouter(prefix="/deck", tags=["deck"])

router.include_router(public_router, prefix="")
router.include_router(shared_router, prefix="")
router.include_router(import_export_router, prefix="")
router.include_router(main_deck_router, prefix="")
router.include_router(files_router, prefix="")
router.include_router(deck_notifications_router, prefix="")
router.include_router(ai_generation_router, prefix="")
router.include_router(relationships_router, prefix="")
