## Blog
from models.blog.blog import BlogPost  # noqa: F401
from models.blog.images import Images  # noqa: F401
from models.decks.card.card import Card  # noqa: F401

##  Decks folder
from models.decks.card.card_factory import CardFactory  # noqa: F401
from models.decks.deck.deck import Deck  # noqa: F401
from models.decks.deck.deck_attributes import DeckAttributes  # noqa: F401
from models.decks.deck.deck_files import DeckFiles  # noqa: F401
from models.decks.deck.deck_sharing import DeckSharing, DeckSharingType  # noqa: F401
from models.decks.deck.public_deck_data import PublicDeckData  # noqa: F401

# from models.decks.deck.shared_decks import SharedDecks
from models.decks.deck.user_deck_likes import UserDeckLikes  # noqa: F401
from models.games.game import Game  # noqa: F401

## Games folder
from models.games.player_game import PlayerGame  # noqa: F401

##  Gamification --> Need to fix names and remove underscores :/
# from models.gamification.gamification import (
#     Badge,
#     Goal,
#     Skill,
#     SkillsCategory,
#     UserSkill,
# )
from models.group.group import Group  # noqa: F401

## Group folder
from models.group.group_invite import GroupInvite  # noqa: F401

# from models.jobs.job import Job
from models.jobs.job_notification import JobNotification  # noqa: F401
from models.quiz.question import Question  # noqa: F401

## Quiz folder
from models.quiz.question_result import QuestionResult  # noqa: F401
from models.quiz.quiz import Test  # noqa: F401
from models.quiz.quiz_result import TestResult  # noqa: F401
from models.quiz.quiz_sharing import QuizSharing, QuizSharingType  # noqa: F401
from models.relational_tables.association_tables import (
    cards,  # noqa: F401
    # cards_shared,
    deck_relationships,  # noqa: F401
    distribution,  # noqa: F401
    questions,  # noqa: F401
    # skills_category_skill,
    source_files,  # noqa: F401
    user_group_association,  # noqa: F401
)
from models.schools.promo_codes import PromoCodes  # noqa: F401
from models.schools.referrals import Referrals  # noqa: F401
from models.schools.referrers import Referrers  # noqa: F401
from models.schools.school_role import SchoolRole  # noqa: F401
from models.schools.schools import Schools  # noqa: F401
from models.subscriptions.stripe_events import StripeEvents  # noqa: F401
from models.subscriptions.subscriber import Subscriber  # noqa: F401
from models.subscriptions.subscription_plan import SubscriptionPlan  # noqa: F401
from models.subscriptions.usage_record import UsageRecord  # noqa: F401

## Tracking
from models.tracking.cached_response import CachedResponse  # noqa: F401
from models.tracking.event_tracking import EventTracking  # noqa: F401
from models.tracking.feedback import Feedback  # noqa: F401
from models.tracking.response_data import ResponseData  # noqa: F401

## User
from models.user.deleted_accounts import DeletedAccounts  # noqa: F401
from models.user.info_banner import InfoBanner  # noqa: F401
from models.user.notifications import (  # noqa: F401
    Notifications,
    NotificationType,
    RefTableType,
)
from models.user.user import User  # noqa: F401
from models.user.user_settings import UserSettings  # noqa: F401
from startup.setup_db import Base  # noqa: F401
