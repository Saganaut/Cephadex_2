from fastapi import APIRouter

from .main_quiz import main_quiz_router
from .results import results_router
from .shared import shared_router
from .take_quiz import take_quiz_router

router = APIRouter(
    prefix="/quiz",
    tags=["quiz"],
)
router.include_router(shared_router)
router.include_router(main_quiz_router)
router.include_router(take_quiz_router)
router.include_router(results_router)
