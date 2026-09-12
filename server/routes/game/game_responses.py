from routes.data_classes.game_schema import GameRoundResultsSchema, GameSchema


def game_started_response(
    game: GameSchema,
    link: str,
    results: list[GameRoundResultsSchema],
) -> dict:
    return {
        "status": "success",
        "message": "gameStarted",
        "game": game,
        "link": link,
        # "qrCode": qr_code,
        "round": {
            "id": f"{game.id}-{game.current_round}",
            "gameId": game.id,
            "roundId": game.current_round,
            "question": game.current_question,
            "results": results,
            "status": game.status,
        },
    }


def game_ended_response(game: GameSchema, link: str) -> dict:
    return {
        "status": "success",
        "message": "gameEnded",
        "game": game,
        "link": link,
        # "qrCode": qr_code,
    }


def lobby_response(game: GameSchema | None, link: str, qr_code: str) -> dict:
    return {
        "status": "success",
        "message": "lobby",
        "game": game,
        "link": link,
        "qrCode": qr_code,
    }


def authenticate_response(game: GameSchema | None, link: str) -> dict:
    return {
        "status": "success",
        "message": "authenticate",
        "game": game,
        "link": link,
        # "qrCode": qr_code,
    }
