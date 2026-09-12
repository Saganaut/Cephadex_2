from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from startup.setup_db import Base


class UserSettings(Base):
    __tablename__ = "user_settings"
    ## ALL SRS intervals in minutes, not seconds
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    language: Mapped[str] = mapped_column(String(50), default="English")
    theme: Mapped[str] = mapped_column(String(50), default="dark")
    new_user: Mapped[bool] = mapped_column(Boolean, default=True)
    new_user_study: Mapped[bool] = mapped_column(Boolean, default=True)
    new_user_create: Mapped[bool] = mapped_column(Boolean, default=True)
    new_user_groups: Mapped[bool] = mapped_column(Boolean, default=True)
    new_user_play: Mapped[bool] = mapped_column(Boolean, default=True)
    new_user_decks: Mapped[bool] = mapped_column(Boolean, default=True)
    new_user_tests: Mapped[bool] = mapped_column(Boolean, default=True)
    new_user_cards: Mapped[bool] = mapped_column(Boolean, default=True)
    new_user_create_quiz: Mapped[bool] = mapped_column(Boolean, default=True)
    # New settings
    qty_cards_to_load_before_new_cards: Mapped[int] = mapped_column(Integer, default=20)
    number_of_cards_to_load: Mapped[int] = mapped_column(Integer, default=20)
    max_srs_interval: Mapped[int] = mapped_column(
        Integer,
        default=525600,
    )  ## max set to one year
    box_0_multiplier: Mapped[int] = mapped_column(Integer, default=0)
    box_1_multiplier: Mapped[int] = mapped_column(Integer, default=2)
    box_2_multiplier: Mapped[int] = mapped_column(Integer, default=4)
    box_3_multiplier: Mapped[int] = mapped_column(Integer, default=6)
    qty_correct_in_a_row_for_moving_up_box: Mapped[int] = mapped_column(
        Integer,
        default=3,
    )
    highest_box: Mapped[int] = mapped_column(Integer, default=3)
    qty_correct_in_a_row_for_interval_bonus: Mapped[int] = mapped_column(
        Integer,
        default=3,
    )
    interval_bonus_for_correct_in_a_row: Mapped[int] = mapped_column(
        Integer,
        default=60,  ## 1 hour
    )
    decrement_box_1_multiplier: Mapped[float] = mapped_column(Float, default=0.5)
    decrement_box_2_multiplier: Mapped[float] = mapped_column(Float, default=0.5)
    decrement_box_3_multiplier: Mapped[float] = mapped_column(Float, default=0.5)
    decrement_minimum_srs_interval: Mapped[int] = mapped_column(Integer, default=1)
    minimum_box_id_after_starting_to_study_card: Mapped[int] = mapped_column(
        Integer,
        default=1,
    )
    too_easy_multiplier: Mapped[int] = mapped_column(Integer, default=5)
    too_hard_multiplier: Mapped[float] = mapped_column(Float, default=0.2)
    retrieve_within_minutes: Mapped[int] = mapped_column(Integer, default=5)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user": self.user,
            "language": self.language,
            "theme": self.theme,
            "new_user": self.new_user,
            "new_user_study": self.new_user_study,
            "new_user_create": self.new_user_create,
            "new_user_groups": self.new_user_groups,
            "new_user_play": self.new_user_play,
            "new_user_decks": self.new_user_decks,
            "new_user_tests": self.new_user_tests,
            "new_user_cards": self.new_user_cards,
            "new_user_create_quiz": self.new_user_create_quiz,
            "qty_cards_to_load_before_new_cards": self.qty_cards_to_load_before_new_cards,
            "number_of_cards_to_load": self.number_of_cards_to_load,
            "max_srs_interval": self.max_srs_interval,
            "box_0_multiplier": self.box_0_multiplier,
            "box_1_multiplier": self.box_1_multiplier,
            "box_2_multiplier": self.box_2_multiplier,
            "box_3_multiplier": self.box_3_multiplier,
            "qty_correct_in_a_row_for_moving_up_box": self.qty_correct_in_a_row_for_moving_up_box,
            "highest_box": self.highest_box,
            "qty_correct_in_a_row_for_interval_bonus": self.qty_correct_in_a_row_for_interval_bonus,
            "interval_bonus_for_correct_in_a_row": self.interval_bonus_for_correct_in_a_row,
            "decrement_box_1_multiplier": self.decrement_box_1_multiplier,
            "decrement_box_2_multiplier": self.decrement_box_2_multiplier,
            "decrement_box_3_multiplier": self.decrement_box_3_multiplier,
            "decrement_minimum_srs_interval": self.decrement_minimum_srs_interval,
            "minimum_box_id_after_starting_to_study_card": self.minimum_box_id_after_starting_to_study_card,
            "too_easy_multiplier": self.too_easy_multiplier,
            "too_hard_multiplier": self.too_hard_multiplier,
            "retrieve_within_minutes": self.retrieve_within_minutes,
        }
