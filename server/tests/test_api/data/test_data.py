import datetime as dt

test_blog_dict = {
    "id": 1,
    "title": "Sample Blog Post Title",
    "slug": "sample-blog-post-title",
    "content": "This is a sample content for the blog post. It contains information about the topic.",
    "summary": "A brief summary of the blog post, highlighting the main points.",
    "author_name": "Author Name",
    "tags": "sample, blog, post",
    "thumbnail": "path/to/thumbnail.jpg",
    "views": 0,
    "user_id": 1,
    "category": "Sample Category",
}
test_images_dict = {
    "id": 1,
    "blog_id": 1,
    "name": "Sample Image",
    "type": "JPEG",
    "image_url": "https://example.com/sample-image.jpg",
    "thumbnail_url": "https://example.com/sample-image-thumbnail.jpg",
}

test_deck_attributes_dict = {
    "id": 1,
    "deck_id": 1,
    "subject": "Mathematics",
    "grade": "10",
    "topic": "Algebra",
    "sub_topic": "Quadratic Equations",
    "difficulty": "Medium",
    "concepts": "Quadratic formula, Factoring quadratics, Completing the square",
    "language": "English",
}


test_deck_files_dict = {
    "id": 1,
    "file_name": "example.pdf",
    "file_path": "/path/to/example.pdf",
    "file_type": "pdf",
    "file_size": 1024,  # Size in Kilobytes (KB)
    "text_string": "This is an example of text content within the file.",
    "create_type": "manual",
    "fav": False,
}


test_deck_sharing_dict = {
    "id": 1,
    "user_id": 1,
    "user_email": "user@example.com",
    "deck_id": 1,
    "expire": False,
    "hours_until_expire": 48,
    "type": "user",
}


test_public_deck_data_dict = {
    "id": 1,
    "deck_id": 1,
    "likes": 0,
    "shares": 0,
}


test_user_deck_likes_dict = {
    "id": 1,
    "user_id": 1,
    "deck_id": 1,
}


test_game_dict = {
    "id": 1,
    "creator": 1,
    "creator_username": "User123",
    "current_flashcard_id": 1,
    "deck_id": 1,
    "rounds": 5,
    "start_time": dt.datetime.fromisoformat("2022-12-31T23:59:59"),
    "time_limit_answer": 30,  # seconds
    "time_limit_vote": 15,  # seconds
    "current_round": 1,
    "status": "active",
    "points_correct": 2,
    "points_deceiver": 1,
}
test_group_dict = {
    "id": 1,
    "name": "Study Group",
    "description": "A group for collaborative study and sharing decks.",
    "group_type": "study",
    "creator_id": 1,
    "img": "path/to/group/image.jpg",
    "is_private": False,
    "fav": True,
}


test_group_dict_2 = {
    "id": 2,
    "name": "Study Group 2",
    "description": "A group for collaborative study and sharing decks.",
    "group_type": "study",
    "creator_id": 2,
    "img": "path/to/group/image.jpg",
    "is_private": False,
    "fav": True,
}
test_group_invite_dict = {
    "id": 1,
    "group_name": "Study Group",
    "group_id": 2,
    "user_id": 1,
    "invited_by_id": 2,
    "invited_by_email": "inviter@example.com",
    "invited_by_username": "InviterUser",
    "username": "InviteeUser",
    "email": "invitee@example.com",
    "share_id": "24ffe1de-185c-425b-9173-ffd7064c2231",
    "expire": True,
    "hours_until_expire": 48,  # Assuming HOURS_BEFORE_EXPIRATION is 48 hours
}


test_job_notification_dict = {
    "id": 1,
    "user_id": 1,
    "slug": "unique-job-slug-123",
    "state": "queued",
    "cost": 0,
    "source_type": "manual",
    "payload": '{"key": "value"}',  # Example payload as a JSON string
    "error_details": None,  # Assuming no error at creation
}

test_question_dict = {
    "id": 1,
    "question": "What is the capital of France?",
    "term": "Capital Cities",
    "content": "The question is about identifying the capital city of France.",
    "boc_2": "Paris",
    "boc_3": "Berlin",
    "boc_4": "Madrid",
    "formula": None,
    "prompt_option": "Multiple Choice",
    "q_type": "geography",
    "q_order": 1,
    "points": 5,
    "img": "path/to/image/of/paris.jpg",
}

test_test_dict = {
    "id": 1,
    "name": "Sample Test",
    "points": 100,
    "num_questions": 10,
    "category": "Mathematics",
    "subject": "Algebra",
    "topic": "Quadratic Equations",
    "due_date": dt.datetime.fromisoformat("2022-12-31T23:59:59"),
    "creator": 1,  # Assuming there's a user with ID 1
    "result_reveal": True,
    "answer_reveal": True,
    "time_limit": 60,  # Time limit in minutes
    "instructions": "Complete the test within the time limit.",
    "description": "This test covers basic to intermediate questions on quadratic equations.",
    "shuffle": True,
    "img": "path/to/test/image.jpg",
    "text": "Additional text related to the test.",
    "deck_id": 1,  # Assuming there's a deck with ID 1
    "fav": False,
}


test_test_result_dict = {
    "id": 1,
    "test_id": 1,
    "taker": 1,  # Assuming there's a user with ID 2
    "creator": 1,  # Assuming the creator's user ID is 1
    "due_date": dt.datetime.fromisoformat("2022-12-31T23:59:59"),
    "start_time": dt.datetime.fromisoformat("2022-12-31T23:59:59"),
    "end_time": dt.datetime.fromisoformat("2022-12-31T23:59:59"),
    "points": 80,
    "correct": 8,
    "blank": 2,
    "graded": True,
    "private": False,
}

test_test_result_dict_2 = {
    "id": 2,
    "test_id": 1,
    "taker": 2,  # Assuming there's a user with ID 2
    "creator": 1,  # Assuming the creator's user ID is 1
    "due_date": dt.datetime.fromisoformat("2022-12-31T23:59:59"),
    "start_time": dt.datetime.fromisoformat("2022-12-31T23:59:59"),
    "end_time": dt.datetime.fromisoformat("2022-12-31T23:59:59"),
    "points": 40,
    "correct": 4,
    "blank": 2,
    "graded": True,
    "private": False,
}


test_quiz_sharing_dict = {
    "id": 1,
    "user_id": 1,  # Assuming there's a user with ID 2
    "user_email": "user2@example.com",
    "quiz_id": 1,  # Assuming there's a quiz/test with ID 1
    "share_id": "24ffe1de-185c-425b-9173-ffd7064c2231",
    "expire": True,
    "hours_until_expire": 48,  # Assuming HOURS_BEFORE_EXPIRATION is set to 48 hours
    "type": "user",
    "can_retake": False,
    "results_reported": True,
}


test_stripe_events_dict = {
    "id": 1,
    "stripe_event_id": "evt_1Ishk2IyNTgGDVfJvQXt9LbC",
    "event_type": "invoice.paid",
    "event_data": '{"customer":"cus_Jm8dspSdNcJjA","amount_paid":2000}',
    "stripe_customer_id": "cus_Jm8dspSdNcJjA",
    "user_id": 1,  # Assuming there's a user with ID 1
    "processed": False,
    "processed_at": None,
    "error_message": None,
}

test_subscriber_dict = {
    "id": 1,
    "first_name": "Radagast",
    "last_name": "Brown",
    "email": "Radagast@rhosgobel.com",
}


test_subscription_plan_dict = {
    "id": 1,
    "name": "Basic",
    "description": "Basic subscription plan with limited features.",
    "limit_count": 10000,  # Example: Limit of 100 entities
    "limit_time_period": "month",
    "price": 9.99,
    "duration": 31,  # Duration in days
    "stripe_id": "price_1Ishk2IyNTgGDVfJvQXt9LbC",
}

test_usage_record_dict = {
    "id": 1,
    "user_id": 1,  # Assuming there's a user with ID 1
    "operation_type": "API Call",
    "operation_details": "Data fetch",
    "operation_count": 10,
    "remaining_count": 90,
    "time_period": "2023-09",
    "limit_count": 100,
    "status": "active",
    "source_ip": "192.168.1.1",
    "payment_status": "unpaid",
    "remaining_pictures": 50,
}

test_feedback_dict = {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "message": "This is a feedback message expressing thoughts about the service.",
    "user_id": 1,  # Assuming the feedback is associated with a user with ID 1
    "type_feedback": "General",
}
test_user_settings_dict = {
    "id": 1,
    "user": 1,
    "language": "English",
    "theme": "Dark",
    "new_user": True,
    "new_user_study": True,
    "new_user_decks": True,
    "new_user_tests": True,
    "new_user_cards": True,
    "srs_settings_1": 5,
    "srs_settings_2": 10,
    "srs_settings_3": 15,
    "srs_settings_4": 20,
}

test_deleted_accounts_dict = {
    "id": 1,
    "user_id": 1,  # Assuming the account belonged to a user with ID 2
    "email": "user2@example.com",
    "reason": "User request",
    "reason_details": "The user requested account deletion for personal reasons.",
}

test_notification_dict = {
    "id": 1,
    "user_id": 1,  # Assuming notification is for a user with ID 3
    "notification_type": "deck_shared",
    "ref_table": "deck_sharing",
    "ref_id": 1,  # Assuming the reference ID for the group invite
    "read": False,
    "message": "You have been invited to join a group.",
    "share_id": "24ffe1de-185c-425b-9173-ffd7064c2231",
}
test_user_settings_dict = {
    "id": 1,
    "user": 1,  # Assuming settings are for a user with ID 4
    "language": "English",
    "theme": "dark",
    "new_user": True,
    "new_user_study": True,
    "new_user_decks": True,
    "new_user_tests": True,
    "new_user_cards": True,
    "qty_cards_to_load_before_new_cards": 20,
    "number_of_cards_to_load": 20,
    "max_srs_interval": 525600,  # one year in minutes
    "box_0_multiplier": 0,
    "box_1_multiplier": 2,
    "box_2_multiplier": 4,
    "box_3_multiplier": 6,
    "qty_correct_in_a_row_for_moving_up_box": 3,
    "highest_box": 3,
    "qty_correct_in_a_row_for_interval_bonus": 3,
    "interval_bonus_for_correct_in_a_row": 60,  # 1 hour in minutes
    "decrement_box_1_multiplier": 0.5,
    "decrement_box_2_multiplier": 0.5,
    "decrement_box_3_multiplier": 0.5,
    "decrement_minimum_srs_interval": 1,
    "minimum_box_id_after_starting_to_study_card": 1,
    "too_easy_multiplier": 5,
    "too_hard_multiplier": 0.2,
    "retrieve_within_minutes": 5,
}


test_question_result_dict = {
    "id": 1,
    "test_id": 1,
    "taker": 1,
    "question_id": 1,
    "answer": "The answer provided by the user for the question.",
    "points": 5,
    "quiz_result_id": 1,
    "correct": True,
}

test_player_game_dict = {
    "id": 1,
    "player_id": 1,  # Assuming the player's user ID is 1
    "username": "PlayerUsername",
    "game_id": 1,  # Assuming the game ID is 1
    "turns_as_main_player": 5,  # Number of turns the player has been the main player
    "points": 100,  # Points accumulated by the player in the game
    "status": "active",  # The current status of the player in the game
    "times_correct": 10,  # Number of times the player has answered correctly
    "times_deceiver": 2,  # Number of times the player has successfully deceived others
}

test_quiz_dict = test_test_dict  # Alias for quiz dict since they use the same structure
