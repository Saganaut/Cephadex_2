import logging

logger = logging.getLogger("App")


def handle_audio_error(user_id, e):
    logger.error(f"Audio error for user{user_id}, error: {e}")
    return {"status": "fail", "message": "Audio error"}


def handle_youtube_error(user_id, e):
    logger.error(f"Youtube error for user{user_id}, error: {e}")
    return {"status": "fail", "message": "Youtube error"}


def handle_file_not_found_error(user_id, e):
    logger.error(f"File not found for user{user_id}, error: {e}")
    return {"status": "fail", "message": "File not found"}


def handle_unknown_error(user_id, e):
    logger.error(f"Unknown error for user{user_id}, error: {e}")
    return {"status": "fail", "message": "Unknown error"}
