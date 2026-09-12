from models.exceptions.exceptions import MyBaseError


class GameExceptions:
    class GameQuestionNotFoundError(MyBaseError):
        def __init__(self, game_id: str, message: str = "Unable to find game question."):
            self.game_id = game_id
            super().__init__(f"{message} Game ID: {game_id}")

    class PlayerNotFoundError(MyBaseError):
        def __init__(self, player_id: str, message: str = "Unable to find player."):
            self.player_id = player_id
            super().__init__(f"{message} Player ID: {player_id}")

    class GameNotFoundError(MyBaseError):
        def __init__(self, game_id: str, message: str = "Unable to find game."):
            self.game_id = game_id
            super().__init__(f"{message} game ID: {game_id}")

    class RoundNotFoundError(MyBaseError):
        def __init__(self, game_id: str, round_id: str, message: str = "Unable to find round."):
            self.game_id = game_id
            self.round_id = round_id
            super().__init__(f"{message} game ID: {game_id}, round ID: {round_id}")

    class PlayerAlreadyInGameError(MyBaseError):
        def __init__(self, player_id: str, message: str = "Player already in game."):
            self.player_id = player_id
            super().__init__(f"{message} Player ID: {player_id}")

    class NoHostError(MyBaseError):
        def __init__(self, game_id: str, message: str = "No host in game."):
            super().__init__(f"{message} Game ID: {game_id}")

    class CardNotFoundError(MyBaseError):
        def __init__(self, game_id: str, message: str = "Unable to find card."):
            self.game_id = game_id
            super().__init__(f"{message} Game ID: {game_id}")

    class QuestionNotFoundError(MyBaseError):
        def __init__(self, game_id: str, message: str = "Unable to find question."):
            self.game_id = game_id
            super().__init__(f"{message} Game ID: {game_id}")

    class AnswerNotFoundError(MyBaseError):
        def __init__(self, game_id: str, message: str = "Unable to find answer."):
            self.game_id = game_id
            super().__init__(f"{message} Game ID: {game_id}")
