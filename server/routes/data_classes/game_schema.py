from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

config = ConfigDict(
    populate_by_name=True,
    alias_generator=to_camel,
    from_attributes=True,
)


class PlayerSchema(BaseModel):
    model_config = config

    player_id: int
    username: str
    game_id: int
    score: int | None
    turns_as_main_player: int | None
    points: int | None
    id: int | None = Field(description="this is redundant and possibly will be removed")


# class GameAnswerSchema(BaseModel):
#     id: int
#     text: str | None
#     game_id: int | None
#     round: int | None
#     user_id: int | None
#     is_correct: bool = False


# class GameVoteSchema(BaseModel):
#     id: int
#     answer_id: int | None
#     user_id: int | None
#     round: int | None
#     game_id: int | None


class PlayerStatus(str, Enum):
    Waiting = "Waiting"
    Playing = "Playing"
    Played = "Played"
    Absent = "Absent"
    Ready = "Ready"
    Voted = "Voted"


class ConnectionStatus(str, Enum):
    Connected = "Connected"
    Disconnected = "Disconnected"
    Idle = "Idle"


class PlayerGameSchema(BaseModel):
    model_config = config

    id: str  ## this is the game_id-player_id
    player_id: int  ## this corresponds to the user id
    username: str
    game_id: int
    turns_as_main_player: int = 0
    status: PlayerStatus = PlayerStatus.Waiting
    total_points_answer: int = 0
    total_points_deceiver: int = 0
    total_points: int = 0
    is_host: bool = False
    connection_status: ConnectionStatus = ConnectionStatus.Connected
    is_player: bool = True
    game_type: str | None = None


class GameState(str, Enum):
    WaitingForRoundStart = "WaitingForRoundStart"
    Voting = "Voting"
    PostVoting = "PostVoting"
    InGame = "InGame"
    InLobby = "InLobby"
    Ended = "Ended"


## TODO: will run into issues here.  Need to check for case sensitivity
class GameTypes(str, Enum):
    Flex = "flex"
    GameTwo = "classic"


class RoundStatus(str, Enum):
    NotStarted = "NotStarted"
    InProgress = "InProgress"
    Completed = "Completed"
    AwaitingAnswers = "AwaitingAnswers"
    AwaitingVotes = "AwaitingVotes"
    AnswersSubmitted = "AnswersSubmitted"
    VotesSubmitted = "VotesSubmitted"
    AwaitingPlayers = "AwaitingPlayers"
    Paused = "Paused"


class McqAnswer(BaseModel):
    model_config = config

    options: list[str]
    correct_option: str


class GameQuestionSchema(BaseModel):
    model_config = config
    type: GameTypes
    card_id: int
    deck_id: int | None
    question: str
    answer: str | McqAnswer | None
    question_category: str
    img: str | None
    sound: str | None
    is_correct_answer: bool = False


class GameStatus(str, Enum):
    WaitingForRoundStart = "WaitingForRoundStart"
    Answering = "Answering"
    PostAnswering = "PostAnswering"
    Voting = "Voting"
    PostVoting = "PostVoting"
    InGame = "InGame"
    InLobby = "InLobby"
    Ended = "Ended"


class GameSchema(BaseModel):
    model_config = config

    id: int
    creator: int
    creator_username: str
    current_question: GameQuestionSchema | None
    deck_id: int
    rounds: int
    time_limit_answer: int
    time_created: str | None
    start_time: str | None
    current_round: int
    players: list[PlayerGameSchema]
    points_correct: int = 0
    points_deceiver: int = 0
    time_limit_vote: int = 0
    status: GameStatus = GameStatus.InLobby
    asked_questions: list[int] = []
    host: int
    host_username: str
    game_type: str

    def remove_player_by_id(self, player_id: str) -> None:
        if self.players is not None:
            self.players = [player for player in self.players if player.id != player_id]

    def get_player_by_id(self, game_id_user_id_combo: str) -> PlayerGameSchema | None:
        if self.players is not None:
            return next(
                (player for player in self.players if player.id == game_id_user_id_combo),
                None,
            )
        return None

    def add_player(self, player: PlayerGameSchema) -> None:
        if self.players is None:
            self.players = []

        if not any(existing_player.id == player.id for existing_player in self.players):
            self.players.append(player)


class CreateGameRequest(BaseModel):
    model_config = config

    deck_id: int
    game_type: str = "flex"
    rounds: int | None = None
    time_limit_answer: int | None
    time_limit_vote: int | None
    participate: bool = True
    points_correct: int = 2
    points_deceiver: int = 1


class NewGameDataResponse(BaseModel):
    status: str
    message: str
    link: str | None
    qrCode: str | None = None
    game: GameSchema
    round: dict | None = None


class GameRoundResultsSchema(BaseModel):
    model_config = config

    id: str
    game_id: int
    round: int
    player_id: int
    is_correct: bool = False
    points_answer: int = 0
    game_question: GameQuestionSchema | None
    answer: str | None
    deceiver: bool = False
    points_deceiver: int = 0
    vote_id: Optional[str] = None
    vote_text: Optional[str] = None
    counted: bool = False
    total_points: int = 0

    # @field_validator("vote_id", "vote_text")
    # def parse_null_as_none(self, value: str) -> Optional[str]:
    #     if value == "null":
    #         return None
    #     return value


class GameEvent(BaseModel):
    type: str


class VoteSubmissionRequest(BaseModel):
    type: str
    voteId: int
    voteText: str
    player: PlayerSchema


class AnswerSubmissionRequest(BaseModel):
    type: str
    answer: str
    player: PlayerSchema


class EndGameResponse(BaseModel):
    type: str
    results: list[PlayerSchema]


class GetGameDataResponse(BaseModel):
    status: str
    message: str
    gameId: int
    player: Optional[list[PlayerGameSchema]] = None
    game: GameSchema
