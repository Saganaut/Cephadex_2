from typing import Optional

from fastapi import (
    UploadFile,
)
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

from .response import StandardApiResponse

config = ConfigDict(populate_by_name=True, alias_generator=to_camel, from_attributes=True)


class UsageRecordSchema(BaseModel):
    model_config = config

    id: int
    user_id: int
    operation_type: str
    operation_details: Optional[str] = None
    operation_count: int
    remaining_count: int
    time_period: str
    limit_count: int
    date: str
    status: str
    source_ip: Optional[str] = None
    payment_status: str
    remaining_pictures: Optional[int] = None
    remaining_credit: float


class UsageRecordResponse(StandardApiResponse):
    model_config = config

    usage_records: list[UsageRecordSchema]


class NotificationsSchema(BaseModel):
    model_config = config

    id: int
    user_id: int
    notification_type: str
    message: str
    time_created: str
    time_updated: str
    read: bool
    ref_id: int
    ref_table: str
    share_id: Optional[str]


class NotificationsResponse(StandardApiResponse):
    model_config = config

    notifications: list[NotificationsSchema] | None


class UserBaseSchema(BaseModel):
    model_config = config

    id: int
    username: Optional[str] = None
    email: str
    first_name: str | None
    last_name: str | None
    account_type: str | None
    account_status: str | None
    # gender: str | None
    pic: str | None
    contacted_email: bool = False
    # dob: str | None
    # timezone: str | None
    subscription_plan: int = 1
    role: str | None
    guest: bool = False
    active: bool = True


class UserSchema(UserBaseSchema):
    model_config = config
    id: Optional[int] = None
    external_id: str | None
    external_type: str | None
    time_created: str | None
    time_accessed: str = Field(
        None,
    )

    account_expiration: str | None
    account_expiration_reason: str | None
    subscription_start_date: str | None = Field(
        None,
    )
    subscription_end_date: str | None = Field(
        None,
    )
    latest_roll_over: str | None = Field(
        None,
    )
    stripe_customer_id: str | None
    used_trial: bool = False
    quantity_cards_due: Optional[int] = 0
    quantity_decks: Optional[int] = 0
    quantity_cards: Optional[int] = 0
    quantity_quizzes: Optional[int] = 0
    quantity_files: Optional[int] = 0
    quantity_groups: Optional[int] = 0
    quantity_decks_public: Optional[int] = 0
    quantity_cards_mastered: Optional[int] = 0
    quantity_cards_learning: Optional[int] = 0
    quantity_cards_new: Optional[int] = 0
    remaining_credit: Optional[int] = 0
    roll_over_date: str | None
    subscriber: Optional[bool] = False


class UserSettingsSchema(BaseModel):
    model_config = config

    language: str | None
    theme: str | None
    new_user: bool
    new_user_create: bool
    new_user_groups: bool
    new_user_play: bool
    new_user_study: bool
    new_user_decks: bool
    new_user_tests: bool
    new_user_cards: bool
    new_user_create_quiz: bool
    qty_cards_to_load_before_new_cards: int
    number_of_cards_to_load: int
    max_srs_interval: int
    box_0_multiplier: int
    box_1_multiplier: int
    box_2_multiplier: int
    box_3_multiplier: int
    qty_correct_in_a_row_for_moving_up_box: int
    highest_box: int
    qty_correct_in_a_row_for_interval_bonus: int
    interval_bonus_for_correct_in_a_row: int
    decrement_box_1_multiplier: float
    decrement_box_2_multiplier: float
    decrement_box_3_multiplier: float
    decrement_minimum_srs_interval: int
    minimum_box_id_after_starting_to_study_card: int
    too_easy_multiplier: int
    too_hard_multiplier: float
    retrieve_within_minutes: int


class FeedbackSchema(BaseModel):
    model_config = config

    id: int
    name: str | None
    email: str | None
    message: str | None
    time_created: str | None
    type_feedback: str | None


class SubscriberSchema(BaseModel):
    model_config = config

    id: int
    first_name: str | None
    last_name: str | None
    email: str | None
    time_created: str | None


class Token(BaseModel):
    model_config = config

    access_token: str
    token_type: str


class GoogleSignInRequest(BaseModel):
    model_config = config

    credential: str
    state: str


class UserDataResponse(BaseModel):
    status: str
    loggedIn: bool
    message: str
    user: Optional[UserSchema] = None
    settings: Optional[UserSettingsSchema] = None


class LogoutResponse(BaseModel):
    status: str
    loggedIn: bool = False


class SignInResponse(BaseModel):
    status: str
    message: str
    userInfo: dict | None
    originalPage: str | None


class FeedbackRequest(BaseModel):
    nameField: str
    emailField: EmailStr
    messageField: str
    feedbackTypeField: str


class CheckUserNameResponse(BaseModel):
    usernameTaken: bool


class SignupResponse(BaseModel):
    status: str
    message: str
    user: UserSchema
    settings: UserSettingsSchema


class NewsletterRequest(BaseModel):
    email: EmailStr


class UserUpdateRequest(BaseModel):
    model_config = config

    username: str | None
    timezone: Optional[str] = None
    first_name: str | None
    last_name: str | None
    role: str | None


class UploadPictureRequest(BaseModel):
    model_config = config

    profile_pic: UploadFile


class UserSettingsDataResponse(BaseModel):
    model_config = config

    status: str
    message: str
    user_settings: UserSettingsSchema | None


class SignUpRequest(BaseModel):
    email: EmailStr
    username: str
    role: str
    firstName: str | None
    lastName: Optional[str] = None
    token: str
    picture: Optional[str] = None
    userTimezone: Optional[str] = None
    agreeTandC: bool
    newsletter: bool
    howDidYouHearAboutUs: str
    whatDoYouWantToDo: str
    externalType: str = "google"
    promoCode: str | None = None


class AccountDeletionRequest(BaseModel):
    model_config = config

    del_email: EmailStr
    reason: str | None
    other_reason: str | None
    more: str | None
