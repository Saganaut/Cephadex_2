# import json
from pathlib import Path
from typing import Literal, TypedDict

from dotenv import load_dotenv
from pydantic import BaseModel, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

# dotenv_path = os.path.join(os.path.dirname(__file__), ".env")

load_dotenv()


class AllowedSettings(BaseSettings):
    extensions: list[str] = [".txt", ".pdf", ".wav", ".mp3", ".docx", ".pptx"]
    tags: list[str] = [
        "a",
        "abbr",
        "acronym",
        "b",
        "br",
        "code",
        "em",
        "i",
        "li",
        "ol",
        "strong",
        "ul",
        "p",
        "pre",
        "blockquote",
        "hr",
        "img",
        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "th",
        "td",
        "div",
        "span",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
    ]
    attributes: dict[str, list[str]] = {
        "*": ["class", "style"],
        "a": ["href", "title"],
        "abbr": ["title"],
        "acronym": ["title"],
        "img": ["alt", "src"],
        "table": ["border", "cellpadding", "cellspacing"],
        "th": ["scope"],
        "td": ["colspan", "rowspan"],
        "iframe": ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
    }
    images: list[str] = ["png", "jpg", "jpeg", "gif", "svg"]


class AppSettings(BaseSettings):
    version: str = "0.1.0"
    debug: bool = False
    host: str = "0.0.0.0"  # noqa: S104
    port: int = 5000
    max_content: int = 104857600
    environment: str = "development"
    app_url: str
    front_end_url: str
    upload_folder: str
    secret_key: str
    stacktrace: bool = False
    # templates_auto_reload: bool = True
    # session_permanent: bool = False

    # security_password_salt: str
    # security_email_validator_args: str
    # max_content_length: int = 16 * 1024 * 1024
    look_up_query_limit: int = 10
    const_plan: list[int] = [4, 5, 6, 7, 8]
    send_grid_key: str
    image_folder_path: str = "static"
    docker_env: bool = False


class LoggingSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="LOGGING_")

    level: str = "INFO"
    debug_arg_length: int = 20


class AuthSettings(BaseSettings):
    access_token_expire_minutes: int = 1440
    algorithm: str = "HS256"
    http_only: bool = False
    max_age: int = 144000  ## the max age for a cookie
    expiration_check: int = (
        1440  ## if the cookie has less than this amount of time left it will be renewed
    )
    same_site: Literal["lax", "strict", "none"] = "lax"
    google_auth2_client_id: str
    google_auth2_secret: str
    discord_client_id: str
    discord_client_secret: str
    discord_redirect_uri: str
    microsoft_client_id: str
    microsoft_client_secret: str
    microsoft_redirect_uri: str
    microsoft_user_info_endpoint: str = "https://graph.microsoft.com/v1.0/me"
    secure: bool = True
    domain: str = "localhost"
    secret_key: str


class DbSettings(BaseSettings):
    pg_db: str
    pg_user: str
    pg_password: str
    pg_host: str = "localhost"
    pg_port: int = 5432

    sqlalchemy_engine_options: dict[str, int] = {
        "pool_recycle": 299,
        "pool_size": 20,
        "max_overflow": 10,
    }
    sqlalchemy_track_modifications: str = "False"
    async_sqlalchemy_engine_options: dict[str, int] = {
        "pool_recycle": 299,
        "pool_size": 10,
        "max_overflow": 2,
    }
    expire_on_commit: bool = False
    auto_commit: bool = False
    auto_flush: bool = False

    @computed_field
    @property
    def async_sqlalchemy_database_uri(self) -> str:
        return f"postgresql+asyncpg://{self.pg_user}:{self.pg_password}@{self.pg_host}:{self.pg_port}/{self.pg_db}"

    @computed_field
    @property
    def sqlalchemy_database_uri(self) -> str:
        return f"postgresql://{self.pg_user}:{self.pg_password}@{self.pg_host}:{self.pg_port}/{self.pg_db}"


class RedisSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="REDIS_")

    password: str
    host: str
    port: int
    max_connections: int = 20
    socket_connection_timout: int = 10
    socket_timeout: int = 10
    cache_time: int = 86400
    link_cache_time: int = 31536000  ## one year


class TokenSettings(BaseSettings):
    tokens_per_page: int = 800
    pages_per_min: int = 3
    acceptable_error_ratio: float = 0.2
    max_tokens_per_job: int = 1500


class PlanConfig(BaseModel):
    ref: str
    subscription_plan: int
    usage_limit: int


# class StripePlans(BaseModel):
#     model_config = ConfigDict(populate_by_name=True, from_attributes=True)

#     environment = "development"
#     free: PlanConfig = PlanConfig(ref="0", subscription_plan=1, usage_limit=40000)
#     premium_yearly: PlanConfig = PlanConfig(
#         ref="price_1NFjudGXWJkeH44yLo0dmszD"
#         if environment == "production"
#         else "price_1NAp58GXWJkeH44y1XCry43l",
#         subscription_plan=7,
#         usage_limit=1600000,
#     )
#     premium_monthly: PlanConfig = PlanConfig(
#         ref="" if environment == "production" else "price_1NAp4FGXWJkeH44yaeBrflCN",
#         subscription_plan=5,
#         usage_limit=1600000,
#     )
#     standard_yearly: PlanConfig = PlanConfig(
#         ref="price_1NFjudGXWJkeH44yLo0dmszD", subscription_plan=6, usage_limit=1600000
#     )
#     standard_monthly: PlanConfig = PlanConfig(
#         ref="price_1NFk27GXWJkeH44y8mfXRW71", subscription_plan=4, usage_limit=1600000
#     )
#     basic_yearly: PlanConfig = PlanConfig(
#         ref="price_1NFk0RGXWJkeH44yR221a2k9", subscription_plan=3, usage_limit=480000
#     )
#     basic_monthly: PlanConfig = PlanConfig(
#         ref="price_1NFk0RGXWJkeH44y6Cc9kCOV", subscription_plan=2, usage_limit=480000
#     )

#     def get_plan_details_by_ref(self, ref: str):
#         for field_name, plan_config in self:
#             if plan_config.ref == ref:
#                 return {
#                     "name": field_name,
#                     "subscription_plan": plan_config.subscription_plan,
#                     "usage_limit": plan_config.usage_limit,
#                 }
#         raise ValueError(f"No plan found with ref: {ref}")

#     def __iter__(self):
#         for field_name, value in self.__dict__.items():
#             if isinstance(value, PlanConfig):
#                 yield field_name, value


class StripeSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="STRIPE_")
    secret_key: str
    signing_secret: str
    logging_level: str = "ERROR"
    # plans: StripePlans = StripePlans()
    valid_events: list[str] = [
        "checkout.session.completed",
        "customer.subscription.renewing",
        "customer.deleted",
        "customer.updated",
        "customer.subscription.deleted",
        "customer.subscription.updated",
        "customer.subscription.created",
        "customer.subscription.trial_will_end",
        "invoice.created",
        "invoice.payment_failed",
        "invoice.payment_succeeded",
        "invoice.updated",
        "invoice.finalized",
        "invoice_finalization_failed",
        "customer_created",
    ]


class AWSSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="AWS_")
    access_key: str
    secret_access_key: str
    default_region: str = "eu-north-1"
    logging_level: str = "ERROR"
    s3_uri: str = "not available"
    bucket: str = "cephadex-dev"


class JobProcessingSettings(BaseSettings):
    num_workers_processor: int = 20
    sleep_time: int = 1
    max_concurrent_tasks: int = 30
    max_concurrent_embeddings: int = 10
    acceptable_error_ratio: float = 0.5
    denominator_check_flashcards: int = 100
    max_characters_deck_attributes_text: int = 3000
    max_job_processor_attempts: int = 3
    long_form_jobs: list[str] = [
        "Summarize",
        "Turn2notes",
        "Transcribe",
        "Create Summary",
        "Create Notes",
        "Create Transcription",
    ]


class EmailSettings(BaseSettings):
    send_grid_key: str


class CorsSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="CORS_")

    origins: list[str] = ["http://localhost:5173"]
    allow_credentials: bool = True
    allow_methods: list[str] = ["*"]
    allow_headers: list[str] = ["*"]


class StudySettings(BaseSettings):
    qty_cards_to_load_before_new_cards: int = 20
    number_of_cards_to_load: int = 20
    max_srs_interval: int = 525600
    box_0_multiplier: int = 2
    box_1_multiplier: int = 4
    box_2_multiplier: int = 6
    box_3_multiplier: int = 10
    qty_correct_in_a_row_for_moving_up_box: int = 2
    highest_box: int = 3
    qty_correct_in_a_row_for_interval_bonus: int = 3
    interval_bonus_for_correct_in_a_row: int = 1440
    decrement_box_1_multiplier: float = 0.5
    decrement_box_2_multiplier: float = 0.8
    decrement_box_3_multiplier: float = 0.9
    decrement_minimum_srs_interval: int = 5
    minimum_box_id_after_starting_to_study_card: int = 1
    too_easy_multiplier: int = 5
    too_hard_multiplier: float = 0.2
    retrieve_within_minutes: int = 5

    class Config:
        extra = "ignore"


# "gpt-3.5-turbo-0125"
# "gpt-4-turbo-preview"
class AISettings(BaseSettings):
    openai_api_key: str
    openai_main_model: str = "gpt-4o-mini"
    temperature: float = 0.2
    images_model: str = "dall-e-2"
    anthropic_api_key: str
    max_ai_caller_attempts: int = 3
    claude_main_model: str = "claude-3-haiku-20240307"
    audio_model: str = "whisper-1"
    image_size: str = "256x256"
    type_response: str = "text"
    echo: bool = True


class QuizSettings(BaseSettings):
    how_close_to_be_correct: float = 0.9


class MonitoringSettings(BaseSettings):
    sentry_dsn: str = "dummy_key"
    traces_sample_rate: float = 1.0
    profiles_sample_rate: float = 0.1
    post_hog_api_key: str = "dummy_key"
    post_hog_host: str = "https://eu.posthog.com"
    monitoring_enabled: bool = False


#################### STRIPE PLANS #############################
STRIPE_PLANS = {
    "price_1NAp58GXWJkeH44y1XCry43l": "premium_yearly",
    "price_1NAp4FGXWJkeH44yaeBrflCN": "premium_monthly",
    "price_1NFjudGXWJkeH44yLo0dmszD": "standard_yearly",
    "price_1NFk27GXWJkeH44y8mfXRW71": "standard_monthly",
    "price_1NFk0RGXWJkeH44yR221a2k9": "basic_yearly",
    "price_1NFk0RGXWJkeH44y6Cc9kCOV": "basic_monthly",
}


class Settings(BaseSettings):
    allowed: AllowedSettings = AllowedSettings()
    app: AppSettings = AppSettings()  # type: ignore
    logging: LoggingSettings = LoggingSettings()
    auth: AuthSettings = AuthSettings()  # type: ignore
    db: DbSettings = DbSettings()  # type: ignore
    redis: RedisSettings = RedisSettings()  # type: ignore
    token: TokenSettings = TokenSettings()
    monitoring: MonitoringSettings = MonitoringSettings()
    aws: AWSSettings = AWSSettings()  # type: ignore
    job_processing: JobProcessingSettings = JobProcessingSettings()
    email: EmailSettings = EmailSettings()  # type: ignore
    cors: CorsSettings = CorsSettings()
    study: StudySettings = StudySettings()
    ai: AISettings = AISettings()  # type: ignore
    quiz: QuizSettings = QuizSettings()

    # stripe: StripeSettings = StripeSettings()


class PlanInfo(TypedDict):
    name: str
    subscription_plan: int
    usage_limit: int


# PLAN_CONFIG: dict[str, PlanInfo] = {
#     "0": {"name": "free", "subscription_plan": 1, "usage_limit": 40000},
#     "price_1NFjudGXWJkeH44yLo0dmszD": {
#         "name": "standard_yearly",
#         "subscription_plan": 6,
#         "usage_limit": 1600000,
#     },
#     "price_1NFk27GXWJkeH44y8mfXRW71": {
#         "name": "standard_monthly",
#         "subscription_plan": 4,
#         "usage_limit": 1600000,
#     },
#     "price_1NAp58GXWJkeH44y1XCry43l": {
#         "name": "premium_yearly",
#         "subscription_plan": 7,
#         "usage_limit": 1600000,
#     },
#     "price_1NAp4FGXWJkeH44yaeBrflCN": {
#         "name": "premium_monthly",
#         "subscription_plan": 5,
#         "usage_limit": 1600000,
#     },
#     "price_1NFk0RGXWJkeH44y6Cc9kCOV": {
#         "name": "basic_monthly",
#         "subscription_plan": 2,
#         "usage_limit": 480000,
#     },
#     "price_1NFk0RGXWJkeH44yR221a2k9": {
#         "name": "basic_yearly",
#         "subscription_plan": 3,
#         "usage_limit": 480000,
#     },
#     "price_1N6ywHGXWJkeH44y0GtBGant": {
#         "name": "testing",
#         "subscription_plan": 5,
#         "usage_limit": 10101,
#     },
#     "price_1OwA7iGXWJkeH44yarhphniI": {
#         "name": "testing_monthly",
#         "subscription_plan": 2,
#         "usage_limit": 1600000,
#     },
# }


# fmt: off

ALLOWED_EXTENSIONS = {".txt", ".pdf", ".wav", ".mp3", ".docx", ".pptx"}
ALLOWED_TAGS = [
    "a","abbr","acronym","b","br","code","em","i","li","ol","strong","ul","p",
    "pre","blockquote","hr","img","table","thead","tbody","tfoot","tr","th","td","div","span","h1","h2","h3","h4","h5","h6",
]
ALLOWED_ATTRIBUTES = {
    "*": ["class", "style"],
    "a": ["href", "title"],
    "abbr": ["title"],
    "acronym": ["title"],
    "img": ["alt", "src"],
    "table": ["border", "cellpadding", "cellspacing"],
    "th": ["scope"],
    "td": ["colspan", "rowspan"],
    "iframe": ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
}
ALLOWED_IMAGES = {"png", "jpg", "jpeg", "gif", "svg"}
ALLOWED_EXTENSIONS = {".txt", ".pdf", ".wav", ".mp3", ".docx", ".pptx"}
LONG_FORM_JOBS = [
    "Summarize",
    "Turn2notes",
    "Transcribe",
    "Create Summary",
    "Create Notes",
    "Create Transcription",
]

 # fmt: on
