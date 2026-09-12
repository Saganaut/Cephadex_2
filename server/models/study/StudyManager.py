import datetime as dt
from typing import Union

from config import (
    StudySettings,
)
from models.models_ import Card
from routes.data_classes.deck_schema import StudyCardSchema
from routes.data_classes.study_schema import AnsweredCardData

BOX_0 = 0
BOX_1 = 1
BOX_2 = 2
BOX_3 = 3


class StudyManager:
    @staticmethod
    def prepare_cards_for_study(
        cards: list[Card],
        deck_id: int,
        batch_number: int,
    ) -> list[StudyCardSchema]:
        """Take a list of cards and returns a list of StudyCardSchema"""
        cards_data = []
        for card in cards:
            unique_id = int(f"{deck_id}{batch_number}{card.id}")

            new_card_dict = card.to_dict()
            new_card_dict["unique_id"] = unique_id
            new_card_dict["batch_number"] = batch_number
            new_card_dict["deck_id"] = deck_id
            print(new_card_dict)
            cards_data.append(StudyCardSchema.model_validate(new_card_dict))
        return cards_data

    @staticmethod
    def update_studied_cards(
        cards_answered: list[AnsweredCardData],
        cards: list[Card],
        study_settings: StudySettings,
    ) -> None:
        card_dict = {card.id: card for card in cards}
        for card_answered in cards_answered:
            card_id = card_answered.card_id
            action = card_answered.action
            card_to_update = card_dict.get(card_id)
            if card_to_update:
                StudyManager.update_card_interval(
                    action,
                    card_to_update,
                    study_settings,
                )

    @staticmethod
    def update_card_interval(action: str, card: Card, study_settings: StudySettings) -> None:
        if action == "incr":
            StudyManager.increment(card, study_settings)
        if action == "easy":
            StudyManager.increment(card, study_settings, too_easy=True)
        if action == "decr":
            StudyManager.decrement(card, study_settings)
        if action == "hard":
            StudyManager.decrement(card, study_settings, too_hard=True)
        if action == "skip":
            pass
        if action not in ["incr", "easy", "decr", "hard", "skip"]:
            msg = "action not recognized"
            raise ValueError(msg)

    @staticmethod
    def increment(card: Card, settings: StudySettings, too_easy: bool = False) -> None:
        if card.time_updated.tzinfo is None:
            card.time_updated = card.time_updated.replace()
        card.time_updated = dt.datetime.now()
        card.times_correct = card.times_correct + 1
        card.times_asked = card.times_asked + 1
        card.times_correct_row = card.times_correct_row + 1
        if card.times_correct_row > settings.qty_correct_in_a_row_for_moving_up_box:
            card.box_id = card.box_id + 1
            card.box_id = min(card.box_id, settings.highest_box)
        if card.box_id == BOX_0:
            card.srs_interval = card.srs_interval * settings.box_0_multiplier
        elif card.box_id == BOX_1:
            card.srs_interval = card.srs_interval * settings.box_1_multiplier
        elif card.box_id == BOX_2:
            card.srs_interval = card.srs_interval * settings.box_2_multiplier
        elif card.box_id == BOX_3:
            card.srs_interval = card.srs_interval * settings.box_3_multiplier
        card.srs_interval = min(card.srs_interval, settings.max_srs_interval)
        if too_easy is True:
            card.srs_interval = card.srs_interval * settings.too_easy_multiplier

        if card.times_correct_row > settings.qty_correct_in_a_row_for_interval_bonus:
            card.srs_interval += settings.interval_bonus_for_correct_in_a_row

    @staticmethod
    def decrement(card: Card, settings: StudySettings, too_hard: bool = False) -> None:
        if card.time_updated.tzinfo is None:
            card.time_updated = card.time_updated.replace()
        card.time_updated = dt.datetime.now()
        card.times_asked = card.times_asked + 1
        card.times_correct_row = 0
        if card.box_id == BOX_1:
            card.srs_interval = card.srs_interval * settings.decrement_box_1_multiplier
        elif card.box_id == BOX_2:
            card.srs_interval = card.srs_interval * settings.decrement_box_2_multiplier
        elif card.box_id == BOX_3:
            card.srs_interval = card.srs_interval * settings.decrement_box_3_multiplier
        if card.box_id != BOX_1 and card.srs_interval < settings.max_srs_interval:
            card.srs_interval = settings.decrement_minimum_srs_interval
        if card.box_id > settings.minimum_box_id_after_starting_to_study_card:
            card.box_id = card.box_id - 1
        if too_hard is True:
            card.srs_interval = card.srs_interval * settings.too_hard_multiplier

    @staticmethod
    def get_due_cards(
        cards: list[Card],
        study_settings: StudySettings,
        TIME_MARGIN: int = 1,  ## retrieve cards that are due with this amount of time
    ) -> Union[list[Card], None]:
        due_cards: list[Card] = []
        current_time = dt.datetime.now()
        new_card_counter: int = 0
        for card in cards:
            # if card.time_updated.tzinfo is None:
            #     print("time updated tz is None")
            #     card.time_updated = card.time_updated.replace(tzinfo=timezone.utc)
            # card.time_updated = card.time_updated.astimezone(timezone.utc)
            minutes_since_studied = (current_time - card.time_updated).total_seconds() / 60

            if (
                minutes_since_studied + study_settings.retrieve_within_minutes
            ) >= card.srs_interval and card.box_id > 0:
                due_cards.append(card)
        if len(due_cards) < study_settings.qty_cards_to_load_before_new_cards:
            for card in cards:
                if (
                    card.box_id == 0
                    and new_card_counter < study_settings.qty_cards_to_load_before_new_cards
                ):
                    new_card_counter += 1
                    due_cards.append(card)
        # due_cards.sort(key=lambda x: x["id"])
        if not due_cards:
            return None
        return due_cards
