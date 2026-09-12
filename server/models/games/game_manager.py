import datetime as dt
import logging
from functools import wraps
from typing import (
    Callable,
    Concatenate,
    Coroutine,
    ParamSpec,
    Tuple,
    TypeVar,
)

from redis.asyncio import Redis
from sqlalchemy import func, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.exceptions.game_exceptions import GameExceptions
from models.games.game import Game
from models.games.player_game import PlayerGame
from models.models_ import Card, User, cards
from models.redis_manager import RedisManager
from routes.data_classes.deck_schema import CardSchema
from routes.data_classes.game_schema import (
    ConnectionStatus,
    GameQuestionSchema,
    GameRoundResultsSchema,
    GameSchema,
    GameStatus,
    GameTypes,
    McqAnswer,
    PlayerGameSchema,
    PlayerStatus,
)

log = logging.getLogger("App")


T = TypeVar("T")
P = ParamSpec("P")

GameManagerType = TypeVar("GameManagerType", bound="GameManager")

GAME_TWO_VALID_CARD_CATEGORIES = ["Mcq", "TrueFalse", "mcq", "Custom"]


def ensure_game_updated(
    func: Callable[Concatenate[GameManagerType, P], Coroutine[None, None, T]],
) -> Callable[Concatenate[GameManagerType, P], Coroutine[None, None, T]]:
    @wraps(func)
    async def wrapper(self: GameManagerType, *args: P.args, **kwargs: P.kwargs) -> T:
        await self.get_game_from_cache()
        return await func(self, *args, **kwargs)

    return wrapper


class GameManager:
    def __init__(self, redis_client: Redis, game: GameSchema):
        self.game: GameSchema = game
        self.redis: Redis = redis_client

    async def get_game_from_cache(self) -> GameSchema:
        key = f"game:{self.game.id}"
        game = await RedisManager.retrieve_cached_json_data(self.redis, key)
        if not game:
            raise GameExceptions.GameNotFoundError(str(self.game.id))
        self.game = GameSchema(**game)
        return self.game

    @ensure_game_updated
    async def get_player(self, player_id: str) -> PlayerGameSchema | None:
        player = self.game.get_player_by_id(player_id)
        if player is None:
            return None
            # raise GameExceptions.PlayerNotFoundError(player_id)
        if player.player_id == self.game.host and not player.is_host:
            player.is_host = True
            await self.update_game_cache()
        return player

    async def get_round_result_from_cache(self, player_id: int) -> GameRoundResultsSchema:
        key = f"game:{self.game.id}:player:{player_id}:round:{self.game.current_round}"
        log.debug("getting round result key: %s", key)
        result = await RedisManager.retrieve_cached_json_data(self.redis, key)
        if not result:
            raise GameExceptions.RoundNotFoundError(str(self.game.id), str(self.game.current_round))
        return GameRoundResultsSchema(**result)

    async def update_round_result_cache(self, result: GameRoundResultsSchema) -> None:
        key = f"game:{self.game.id}:player:{result.player_id}:round:{self.game.current_round}"
        await RedisManager.cache_json_data(self.redis, key, result.model_dump(by_alias=True))

    async def update_game_cache(self) -> None:
        key = f"game:{self.game.id}"
        await RedisManager.cache_json_data(self.redis, key, self.game.model_dump(by_alias=True))

    @ensure_game_updated
    async def remove_player_from_game(self, player_id: str) -> tuple[str, str]:
        player_to_remove = self.game.get_player_by_id(player_id)
        # self.game.remove_player_by_id(player_id)
        if not player_to_remove:
            msg = "Can't remove player from game, player not found"
            raise GameExceptions.PlayerNotFoundError(player_id, msg)
        player_to_remove.connection_status = ConnectionStatus.Disconnected
        await self.update_game_cache()
        return player_to_remove.username, str(player_to_remove.player_id)

    @ensure_game_updated
    async def add_player_to_game(self, user: User) -> PlayerGameSchema:
        log.debug(
            "----------------------------!!!!!!!!!!!!!!!! Adding player to game %s", self.game.id
        )
        player = self.game.get_player_by_id(f"{self.game.id}-{user.id}")
        if player is not None:
            log.debug("player is not none returning player %s", player)
            return player
        player = PlayerGameSchema(
            username=user.username,
            player_id=user.id,
            game_id=self.game.id,
            id=f"{self.game.id}-{user.id}",
            status=PlayerStatus.Waiting,
        )
        self.game.add_player(player)
        log.debug("Added new player to game %s", player)
        await self.update_game_cache()
        log.debug("Updated cache")
        return player

    @ensure_game_updated
    async def increment_round(self) -> int:
        self.game.current_round += 1
        self.game.status = GameStatus.Answering
        await self.update_game_cache()
        return self.game.current_round

    @ensure_game_updated
    async def start_game(self) -> GameSchema:
        self.game.status = GameStatus.WaitingForRoundStart
        self.game.start_time = dt.datetime.now().isoformat()
        await self.update_game_cache()
        return self.game

    @ensure_game_updated
    async def get_new_question(self, db: AsyncSession) -> GameQuestionSchema:
        card = await self.get_random_flashcard(db)
        right_answer = self.create_right_answer(card)
        round_result = self.create_right_answer_round_result(right_answer)
        await self.update_round_result_cache(round_result)
        if self.game.current_question is None:
            raise GameExceptions.QuestionNotFoundError(str(self.game.id))
        self.game.current_question.card_id = card.id
        self.game.asked_questions.append(card.id)
        self.game.current_question = right_answer
        await self.update_game_cache()
        return right_answer

    @ensure_game_updated
    async def get_current_round_and_timer(self) -> Tuple[int, int]:
        return self.game.current_round, self.game.time_limit_answer

    @ensure_game_updated
    async def get_current_question(self) -> GameQuestionSchema:
        if self.game.current_question is None:
            raise GameExceptions.QuestionNotFoundError(str(self.game.id))
        return self.game.current_question

    ##TODO: answers need to be saved in GameQuestionSchema format??
    @ensure_game_updated
    async def submit_answer(self, answer_text: str, user_id: int) -> None:
        round_result = await self.get_round_result_from_cache(user_id)
        if round_result.game_question is None:
            raise GameExceptions.QuestionNotFoundError(str(self.game.id))
        round_result.game_question.answer = answer_text
        await self.update_round_result_cache(round_result)

    @ensure_game_updated
    async def submit_vote(
        self,
        vote_id: str,
        vote_text: str,
        user_id: int,
    ) -> GameRoundResultsSchema:
        round_result = await self.get_round_result_from_cache(user_id)
        round_result.vote_id = vote_id
        round_result.vote_text = vote_text
        await self.update_round_result_cache(round_result)
        return round_result

    @ensure_game_updated
    async def get_all_round_results_for_round(self) -> list[GameRoundResultsSchema]:
        round_results = []
        for player in self.game.players:
            round_result = await self.get_round_result_from_cache(player.player_id)
            round_results.append(round_result)
        correct_answer = await self.get_round_result_from_cache(0)
        round_results.append(correct_answer)
        return round_results

    @ensure_game_updated
    async def change_game_status(self, new_status: GameStatus) -> GameSchema:
        self.game.status = new_status
        await self.update_game_cache()
        return self.game

    async def change_player_connection_status(
        self,
        player_id: str,
        connection_status: ConnectionStatus,
    ) -> PlayerGameSchema:
        player = await self.get_player(player_id)
        player.connection_status = connection_status
        await self.update_game_cache()
        return player

    @ensure_game_updated
    async def check_if_all_votes_submitted(self) -> bool:
        results = await self.get_all_round_results_for_round()
        votes = 0
        for result in results:
            if result.vote_id is not None:
                votes += 1
        return votes == len(self.game.players)

    @ensure_game_updated
    async def create_round_entry_for_players(self) -> None:
        if self.game.current_question is None:
            raise GameExceptions.QuestionNotFoundError(str(self.game.id))
        for player in self.game.players:
            round_entry = GameRoundResultsSchema(
                id=f"{self.game.id}-{self.game.current_round}-{player.player_id}",
                game_id=self.game.id,
                round=self.game.current_round,
                player_id=player.player_id,
                answer=None,
                game_question=GameQuestionSchema(
                    deck_id=self.game.deck_id,
                    img=None,
                    sound=None,
                    card_id=self.game.current_question.card_id,
                    type=self.game.current_question.type,
                    question=self.game.current_question.question,
                    answer=None,
                    is_correct_answer=False,
                    question_category=self.game.current_question.question_category,
                ),
            )
            await self.update_round_result_cache(round_entry)

    ##TODO: likely issue with points correct here
    @ensure_game_updated
    async def set_if_answer_is_correct_for_game_two(self) -> None:
        correct_answer = await self.get_round_result_from_cache(0)
        for player in self.game.players:
            round_result = await self.get_round_result_from_cache(player.player_id)
            log.debug("ROUND RESULT: %s", round_result)
            if (
                round_result.game_question is not None
                and isinstance(round_result.game_question, GameQuestionSchema)
                and correct_answer.game_question is not None
                and isinstance(correct_answer.game_question, GameQuestionSchema)
                and isinstance(correct_answer.game_question.answer, McqAnswer)
            ):
                if (
                    round_result.game_question.answer
                    == correct_answer.game_question.answer.correct_option
                ):
                    round_result.points_answer = self.game.points_correct
                    round_result.total_points = self.game.points_correct
                    log.debug("points correct %s", self.game.points_correct)
                round_result.counted = True
                log.debug("UPDATED ROUND RESULT: %s", round_result)
                await self.update_round_result_cache(round_result)
            else:
                msg = "Game question is either None or not of type GameQuestionSchema"
                raise GameExceptions.RoundNotFoundError(
                    str(self.game.id),
                    str(self.game.current_round),
                    msg,
                )

    @ensure_game_updated
    async def count_votes(self) -> None:
        correct_answer = await self.get_round_result_from_cache(0)
        if correct_answer.counted:  ## check to see if this round has already been counted
            return
        correct_answer.counted = True
        await self.update_round_result_cache(correct_answer)
        players_answers = await self.get_all_round_results_for_round()
        votes = await self.set_correct_points_and_return_votes(players_answers, correct_answer)

        await self.set_deceiver_points(players_answers, votes)
        for answer in players_answers:
            await self.update_round_result_cache(answer)
        await self.update_player_scores()
        await self.change_game_status(GameStatus.PostVoting)

    @ensure_game_updated
    async def handle_disconnection(self, player_id: str) -> None:
        player = await self.get_player(player_id)
        if player is None:
            return
        if player.status == PlayerStatus.Absent and self.game.status != GameStatus.Ended:
            player.status = PlayerStatus.Ready
            await self.update_game_cache()

    @ensure_game_updated
    async def end_game(self, db: AsyncSession) -> None:
        self.game.status = GameStatus.Ended
        await self.update_game_cache()
        await self.create_game_entry_result_in_db(db, self.game.players)
        await self.update_game_in_db(db)
        await db.commit()

    async def create_game_entry_result_in_db(
        self,
        db: AsyncSession,
        players: list[PlayerGameSchema],
    ) -> None:
        for player in players:
            self.add_player_entry_to_db(db, player)

    def add_player_entry_to_db(self, db: AsyncSession, player: PlayerGameSchema) -> None:
        player_dict = player.model_dump()
        player_dict.pop("id")
        player_dict["points"] = player_dict.pop("total_points")
        player_dict.pop("is_host")
        player_dict["times_correct"] = (
            player_dict.pop("total_points_answer") // self.game.points_correct
        )
        player_dict.pop("connection_status")
        player_dict["times_deceiver"] = (
            player_dict.pop("total_points_deceiver") // self.game.points_deceiver
        )
        player_dict.pop("is_player")
        player_game = PlayerGame(**player_dict)
        db.add(player_game)

    ##TODO: Check if the player_answer actually affects anything here
    async def set_correct_points_and_return_votes(
        self,
        player_answers: list[GameRoundResultsSchema],
        correct_answer: GameRoundResultsSchema,
    ) -> dict:
        votes = {}
        correst_answer = (  ## checking if correct answer uses new format or not
            correct_answer.game_question.answer
            if isinstance(correct_answer.game_question, GameQuestionSchema)
            else correct_answer.answer
        )
        for player_answer in player_answers:
            if player_answer.vote_text == correst_answer:
                player_answer.points_answer = self.game.points_correct
                player_answer.total_points += self.game.points_correct
            if player_answer.vote_id is not None and player_answer.vote_id != 0:
                votes[player_answer.vote_id] = votes.get(player_answer.vote_id, 0) + 1
        return votes

    async def set_deceiver_points(
        self,
        players_answers: list[GameRoundResultsSchema],
        votes: dict,
    ) -> None:
        answers_by_id = {answer.id: answer for answer in players_answers}
        for voted_id, vote_count in votes.items():
            answer = answers_by_id.get(voted_id)
            if answer:
                answer.deceiver = True
                answer.points_deceiver = self.game.points_deceiver * vote_count
                answer.total_points += answer.points_deceiver

    async def update_player_scores(self) -> None:
        for player in self.game.players:
            round_result = await self.get_round_result_from_cache(player.player_id)
            player.total_points += round_result.total_points
            player.total_points_answer += round_result.points_answer
            player.total_points_deceiver += round_result.points_deceiver
            await self.update_round_result_cache(round_result)
            await self.update_game_cache()

    @ensure_game_updated
    async def assign_new_host_randomly(self) -> tuple[int | None, str]:
        for player in self.game.players:
            if (
                len(self.game.players) == 1
            ):  ## if there is only one player then can't assign a new host
                return self.game.host, self.game.host_username
            if player.connection_status != ConnectionStatus.Disconnected:
                player.is_host = True
                self.game.host = player.player_id
                if player.username is None:
                    self.game.host_username = str(player.id)
                else:
                    self.game_host_username = player.username
                break
        if self.game.host_username is None:
            raise GameExceptions.NoHostError(str(self.game.id))
        await self.update_game_cache()
        return self.game.host, self.game.host_username

    @ensure_game_updated
    async def get_players_details(self) -> list[dict]:
        return [player.model_dump(by_alias=True) for player in self.game.players]

    @ensure_game_updated
    async def handle_reconnection(self, player_id: str) -> None:
        player = await self.get_player(player_id)
        if player is None:
            return
        if player.status == PlayerStatus.Absent and self.game.status != GameStatus.Ended:
            player.status = PlayerStatus.Ready
            await self.update_game_cache()

    async def get_random_flashcard(self, db: AsyncSession) -> CardSchema:
        match self.game.game_type:
            case "flex":
                card = await self.get_flashcard_for_flex(db)
                if card is None:
                    self.game.asked_questions = []
                    card = await self.get_flashcard_for_flex(db)
            case "classic":
                card = await self.get_random_flashcard_classic(db)
                if card is None:
                    self.game.asked_questions = []
                card = await self.get_random_flashcard_classic(db)
            case _:
                msg = f"Invalid game type: {self.game.game_type}"
                raise ValueError(msg)
        if card is None:
            raise GameExceptions.CardNotFoundError(str(self.game.id))
        return card

    async def update_game_in_db(self, db: AsyncSession) -> None:
        stmt = update(Game).where(Game.id == self.game.id).values(status=self.game.status)
        await db.execute(stmt)

    async def get_flashcard_for_flex(self, db: AsyncSession) -> CardSchema:
        query = (
            select(Card)
            .join(cards, Card.id == cards.c.card_id)
            .where(Card.id.notin_(self.game.asked_questions))
            .where(cards.c.deck_id == self.game.deck_id)
            .order_by(func.random())  ## ignore
            .limit(1)
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_random_flashcard_classic(self, db: AsyncSession) -> CardSchema:
        query = (
            select(Card)
            .join(cards, Card.id == cards.c.card_id)
            .where(Card.id.notin_(self.game.asked_questions))
            .where(Card.category.in_(GAME_TWO_VALID_CARD_CATEGORIES))
            .where(cards.c.deck_id == self.game.deck_id)
            .order_by(func.random())  ## ignore
            .limit(1)
        )
        result = await db.execute(query)
        return result.scalars().first()

    @ensure_game_updated
    async def check_if_all_answers_submitted(self) -> bool:
        results = await self.get_all_round_results_for_round()
        answer = 0
        for result in results:
            if result.game_question is None:
                raise GameExceptions.QuestionNotFoundError(str(self.game.id))
            if result.game_question.answer is not None:
                answer += 1
        if answer - 1 == len(self.game.players):
            if self.game.game_type == "flex":
                self.game.status = GameStatus.Voting
            else:
                await self.set_if_answer_is_correct_for_game_two()
                self.game.status = GameStatus.WaitingForRoundStart
            await self.update_game_cache()
            return True

        return False

    ##TODO: need a better way to save types here,  Probably use the same enum everywhere
    def create_right_answer(self, card: CardSchema) -> GameQuestionSchema:
        if card.content is None:
            msg = "Card found but content is empty, unable to create question"
            raise GameExceptions.CardNotFoundError(str(self.game.id), msg)
        if self.game.game_type == "flex":
            answer = truncate_answer_if_too_long(card.content)
        if self.game.game_type == "classic":
            if card.category in ["Mcq", "mcq", "custom", "Custom"]:
                options = [card.content, card.boc_2, card.boc_3, card.boc_4]
                answer = McqAnswer(options=options, correct_option=card.content)
            else:
                answer = truncate_answer_if_too_long(card.content)
        if answer is None:
            raise GameExceptions.AnswerNotFoundError(str(self.game.id))
        self.game.current_question = GameQuestionSchema(
            type=GameTypes.Flex if self.game.game_type == "flex" else GameTypes.GameTwo,
            card_id=card.id,
            question=card.term,
            answer=answer,
            is_correct_answer=True,
            question_category=card.category,
            deck_id=self.game.deck_id,
            img=None,
            sound=None,
        )
        return self.game.current_question

    def create_right_answer_round_result(
        self,
        right_answer: GameQuestionSchema,
    ) -> GameRoundResultsSchema:
        return GameRoundResultsSchema(
            id=f"{self.game.id}-{self.game.current_round}-{0}",
            game_id=self.game.id,
            round=self.game.current_round,
            game_question=right_answer,
            player_id=0,
            answer=None,
            is_correct=True,
        )

    @staticmethod
    async def retrieve_game_from_db(db: AsyncSession, game_id: int) -> Game:
        query = select(Game).where(Game.id == game_id)
        result = await db.execute(query)
        return result.scalars().first()


def truncate_answer_if_too_long(answer: str) -> str:
    answer = answer[:256]
    last_full_stop_index = answer.rfind(".")
    if last_full_stop_index != -1:
        answer = answer[: last_full_stop_index + 1]
    return answer
