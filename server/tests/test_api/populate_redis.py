import json


async def preload_game_data(redis_client):
    game_data = {
        "id": 1,
        "creator": 1,
        "creator_username": "RadagastTheBrown",
        "current_flashcard_id": None,
        "current_flashcard_question": None,
        "current_flashcard_answer": None,
        "deck_id": None,
        "rounds": 5,
        "time_limit_answer": 30,
        "time_created": "2021-01-01T00:00:00",
        "start_time": None,
        "current_round": 1,
        "players": [
            {
                "id": 1,
                "player_id": 1,
                "username": "RadagastTheBrown",
                "game_id": 1,
                "turns_as_main_player": 0,
                "points": 0,
                "status": "active",
                "times_correct": 0,
                "times_deceiver": 0,
            }
        ],
        "points_correct": 0,
        "points_deceiver": 0,
        "time_limit_vote": 15,
        "status": "active",
        "asked_questions": [],
        "current_flashcard_category": None,
    }

    await redis_client.set("game:1", json.dumps(game_data))


fake_player_1 = {
    "id": 1,
    "player_id": 1,
    "username": "RadagastTheBrown",
    "game_id": 1,
    "turns_as_main_player": 0,
    "points": 0,
    "status": "active",
    "times_correct": 0,
    "times_deceiver": 0,
}

fake_player_2 = {
    "id": 2,
    "player_id": 2,
    "username": "GandalfTheGrey",
    "game_id": None,
    "turns_as_main_player": 0,
    "points": 0,
    "status": "active",
    "times_correct": 0,
    "times_deceiver": 0,
}
