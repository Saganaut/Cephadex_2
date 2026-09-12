from models.models_ import (
    BlogPost,
    Card,
    Deck,
    DeckAttributes,
    DeckFiles,
    DeckSharing,
    Game,
    Group,
    GroupInvite,
    Images,
    JobNotification,
    Notifications,
    PlayerGame,
    PublicDeckData,
    Question,
    QuestionResult,
    QuizSharing,
    StripeEvents,
    Subscriber,
    SubscriptionPlan,
    Test,
    TestResult,
    User,
    UserDeckLikes,
    UserSettings,
    cards,
    deck_relationships,
    distribution,
    questions,
    source_files,
    user_group_association,
)
from tests.test_api.data.test_cards import test_card_dict
from tests.test_api.data.test_data import (
    test_blog_dict,
    test_deck_attributes_dict,
    test_deck_files_dict,
    test_deck_sharing_dict,
    test_game_dict,
    test_group_dict,
    test_group_dict_2,
    test_group_invite_dict,
    test_images_dict,
    test_job_notification_dict,
    test_notification_dict,
    test_player_game_dict,
    test_public_deck_data_dict,
    test_question_dict,
    test_question_result_dict,
    test_quiz_sharing_dict,
    test_stripe_events_dict,
    test_subscriber_dict,
    test_subscription_plan_dict,
    test_test_dict,
    test_test_result_dict,
    test_test_result_dict_2,
    test_user_deck_likes_dict,
    test_user_settings_dict,
)
from tests.test_api.data.test_decks import test_deck_dict, test_deck_dict_2
from tests.test_api.data.test_users import test_user_dict, test_user_dict_2


async def populate_db(db):
    user = User(**test_user_dict)
    deck = Deck(**test_deck_dict)
    deck_2 = Deck(**test_deck_dict_2)
    user_2 = User(**test_user_dict_2)
    card = Card(**test_card_dict)
    group = Group(**test_group_dict)
    group_2 = Group(**test_group_dict_2)
    group_invite = GroupInvite(**test_group_invite_dict)
    game = Game(**test_game_dict)
    public_deck_data = PublicDeckData(**test_public_deck_data_dict)
    user_deck_likes = UserDeckLikes(**test_user_deck_likes_dict)
    blog = BlogPost(**test_blog_dict)
    images = Images(**test_images_dict)
    job_notification = JobNotification(**test_job_notification_dict)
    question = Question(**test_question_dict)
    deck_attributes = DeckAttributes(**test_deck_attributes_dict)
    notification = Notifications(**test_notification_dict)
    deck_files = DeckFiles(**test_deck_files_dict)
    deck_sharing = DeckSharing(**test_deck_sharing_dict)
    public_deck_data = PublicDeckData(**test_public_deck_data_dict)
    quiz_sharing = QuizSharing(**test_quiz_sharing_dict)
    stripe_events = StripeEvents(**test_stripe_events_dict)
    subscriber = Subscriber(**test_subscriber_dict)
    subscription_plan = SubscriptionPlan(**test_subscription_plan_dict)
    test = Test(**test_test_dict)
    test_result = TestResult(**test_test_result_dict)
    test_result_2 = TestResult(**test_test_result_dict_2)
    question_result = QuestionResult(**test_question_result_dict)
    player = PlayerGame(**test_player_game_dict)
    settings = UserSettings(**test_user_settings_dict)
    db.add(subscription_plan)
    await db.flush()

    db.add_all(
        [
            user,
            user_2,
        ]
    )
    await db.flush()
    db.add_all(
        [
            group,
        ]
    )
    await db.flush()
    db.add_all(
        [
            deck,
            deck_2,
            subscriber,
            settings,
        ]
    )
    await db.flush()
    db.add_all(
        [
            card,
            group_2,
            deck_attributes,
            deck_files,
            deck_sharing,
            user_deck_likes,
            public_deck_data,
            test,
        ]
    )
    await db.flush()
    db.add_all(
        [
            game,
            question,
            test_result_2,
            test_result,
            quiz_sharing,
            group_invite,
            blog,
        ]
    )
    await db.flush()
    db.add_all(
        [
            job_notification,
            stripe_events,
            question_result,
            player,
            notification,
            images,
        ]
    )
    await db.commit()
    stmt_1 = user_group_association.insert().values(
        user_id=1, group_id=1, role="admin", permissions="write"
    )
    stmt_2 = source_files.insert().values(deck_id=deck.id, deck_file_id=deck_files.id)
    stmt_3 = questions.insert().values(
        test_id=test.id,
        question_id=question.id,
        position=1,
        text="What is the capital of France?",
        image="path/to/image.jpg",
    )
    stmt_4 = cards.insert().values(card_id=card.id, deck_id=deck.id)
    stmt_5 = distribution.insert().values(test_id=1, taker_id=1)
    stmt_6 = deck_relationships.insert().values(
        parent_deck=deck.id, child_deck=deck_2.id
    )
    await db.execute(stmt_1)
    await db.execute(stmt_2)
    await db.execute(stmt_3)
    await db.execute(stmt_4)
    await db.execute(stmt_5)
    await db.execute(stmt_6)

    await db.commit()
