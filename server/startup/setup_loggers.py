import logging
import logging.handlers
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path

from dependencies.settings import get_settings

settings = get_settings()

LOGGING_LEVEL_CONST = getattr(logging, settings.logging.level, logging.INFO)


##! TO DO properly implement filehandlers so that we don't have fire lock errors
def setup_app_logger() -> logging.Logger:
    logger = logging.getLogger("App")
    logger.setLevel(LOGGING_LEVEL_CONST)

    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setLevel(logging.DEBUG)  # Set the level for this handler

    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    stdout_handler.setFormatter(formatter)

    logger.addHandler(stdout_handler)

    if settings.app.docker_env is False:
        Path("logs").mkdir(parents=True, exist_ok=True)

        file_handler = RotatingFileHandler(
            "logs/app.log", maxBytes=10 * 1024 * 1024, backupCount=5, encoding="utf-8"
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        # logger.addHandler(file_handler)

        error_file_handler = RotatingFileHandler(
            "logs/app_errors.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=5,
            encoding="utf-8",
        )
        error_file_handler.setLevel(logging.ERROR)
        error_file_handler.setFormatter(formatter)

    # logger.addHandler(error_file_handler)
    return logger


def setup_processing_logger() -> logging.Logger:
    processing_logger = logging.getLogger("job_processing")
    processing_logger.setLevel(LOGGING_LEVEL_CONST)

    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setLevel(logging.DEBUG)

    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    stdout_handler.setFormatter(formatter)

    processing_logger.addHandler(stdout_handler)

    if settings.app.docker_env is False:
        Path("logs").mkdir(parents=True, exist_ok=True)

        file_handler = RotatingFileHandler(
            "logs/job_processing.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=5,
            encoding="utf-8",
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        # processing_logger.addHandler(file_handler)

        error_file_handler = RotatingFileHandler(
            "logs/job_processing_errors.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=5,
            encoding="utf-8",
        )
        error_file_handler.setLevel(logging.ERROR)
        error_file_handler.setFormatter(formatter)
        # processing_logger.addHandler(error_file_handler)

    return processing_logger


def setup_subrollover_logger() -> logging.Logger:
    subrollover_logger = logging.getLogger("subrollover")
    subrollover_logger.setLevel(LOGGING_LEVEL_CONST)

    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setLevel(logging.DEBUG)  # Set the level for this handler

    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    stdout_handler.setFormatter(formatter)

    subrollover_logger.addHandler(stdout_handler)

    if settings.app.docker_env is False:
        Path("logs").mkdir(parents=True, exist_ok=True)

        file_handler = RotatingFileHandler(
            "logs/subrollover.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=5,
            encoding="utf-8",
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        # subrollover_logger.addHandler(file_handler)

        error_file_handler = RotatingFileHandler(
            "logs/subrollover.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=5,
            encoding="utf-8",
        )
        error_file_handler.setLevel(logging.ERROR)
        error_file_handler.setFormatter(formatter)

    # subrollover_logger.addHandler(error_file_handler)
    return subrollover_logger


def setup_payment_logger() -> logging.Logger:
    payment_logger = logging.getLogger("payment")
    payment_logger.setLevel(LOGGING_LEVEL_CONST)
    return payment_logger
