# potential values for type: deck, quiz, quiz_result, register

{"route": {"“type": "deck", "id": "deck id"}}


{"error": "error message"}

{"status": "success", "message": "message"}


{
    "info": {
        "user_details": "user_details",
    }
}


{
    "status": "success",
    "message": "Deck shared successfully",
    "users": [
        {"id": "user_id", "name": "user_name", "email": "user_email"},
        {"id": "user_id", "name": "user_name", "email": "user_email"},
    ],
}


Deck = {
    "id": self.id,
    "username": self.username,
    "email": self.email,
    "email_confirmed_at": self.email_confirmed_at.isoformat()
    if self.email_confirmed_at
    else None,
    "first_name": self.first_name,
    "last_name": self.last_name,
    "external_id": self.external_id,
    "external_type": self.external_type,
    "time_created": self.time_created.isoformat(),
    "time_accessed": self.time_accessed.isoformat(),
    "account_type": self.account_type,
    "account_status": self.account_status,
    "account_expiration": self.account_expiration.isoformat()
    if self.account_expiration
    else None,
    "account_expiration_reason": self.account_expiration_reason,
    "gender": self.gender,
    "pic": self.pic,
    "contacted_email": self.contacted_email,
    "dob": self.dob.isoformat() if self.dob else None,
    "timezone": self.timezone,
    "subscription_plan": self.subscription_plan,
    "subscription_start_date": self.subscription_start_date.isoformat()
    if self.subscription_start_date
    else None,
    "subscription_end_date": self.subscription_end_date.isoformat()
    if self.subscription_end_date
    else None,
    "latest_roll_over": self.latest_roll_over.isoformat()
    if self.latest_roll_over
    else None,
    "role": self.role,
    "stripe_customer_id": self.stripe_customer_id,
    "guest": self.guest,
    "used_trial": self.used_trial,
    "member_since": self.member_since(),
    "quantity_decks": self.quantity_decks(),
    "quantity_cards": self.quantity_cards(),
    "quantity_tests": self.quantity_tests(),
    "quantity_files": self.quantity_files(),
    "quantity_groups": self.quantity_groups(),
    "quantity_decks_public": self.quantity_decks_public(),
    "quantity_cards_mastered": self.quantity_cards_mastered(),
    "quantity_cards_learning": self.quantity_cards_learning(),
    "quantity_cards_new": self.quantity_cards_new(),
    "remaining_credit": self.remaining_credit(),
    "roll_over_date": self.roll_over_date(),
}


User = {
    "id": self.id,
    "username": self.username,
    "email": self.email,
    "email_confirmed_at": self.email_confirmed_at.isoformat()
    if self.email_confirmed_at
    else None,
    "first_name": self.first_name,
    "last_name": self.last_name,
    "external_id": self.external_id,
    "external_type": self.external_type,
    "time_created": self.time_created.isoformat(),
    "time_accessed": self.time_accessed.isoformat(),
    "account_type": self.account_type,
    "account_status": self.account_status,
    "account_expiration": self.account_expiration.isoformat()
    if self.account_expiration
    else None,
    "account_expiration_reason": self.account_expiration_reason,
    "gender": self.gender,
    "pic": self.pic,
    "contacted_email": self.contacted_email,
    "dob": self.dob.isoformat() if self.dob else None,
    "timezone": self.timezone,
    "subscription_plan": self.subscription_plan,
    "subscription_start_date": self.subscription_start_date.isoformat()
    if self.subscription_start_date
    else None,
    "subscription_end_date": self.subscription_end_date.isoformat()
    if self.subscription_end_date
    else None,
    "latest_roll_over": self.latest_roll_over.isoformat()
    if self.latest_roll_over
    else None,
    "role": self.role,
    "stripe_customer_id": self.stripe_customer_id,
    "guest": self.guest,
    "used_trial": self.used_trial,
    "member_since": self.member_since(),
    "quantity_decks": self.quantity_decks(),
    "quantity_cards": self.quantity_cards(),
    "quantity_tests": self.quantity_tests(),
    "quantity_files": self.quantity_files(),
    "quantity_groups": self.quantity_groups(),
    "quantity_decks_public": self.quantity_decks_public(),
    "quantity_cards_mastered": self.quantity_cards_mastered(),
    "quantity_cards_learning": self.quantity_cards_learning(),
    "quantity_cards_new": self.quantity_cards_new(),
    "remaining_credit": self.remaining_credit(),
    "roll_over_date": self.roll_over_date(),
}

UserSettings = {
    "id": self.id,
    "user": self.user,
    "language": self.language,
    "theme": self.theme,
    "new_user": self.new_user,
    "new_user_study": self.new_user_study,
    "new_user_decks": self.new_user_decks,
    "new_user_tests": self.new_user_tests,
    "new_user_cards": self.new_user_cards,
    "srs_setting_1": self.srs_setting_1,
    "srs_setting_2": self.srs_setting_2,
    "srs_setting_3": self.srs_setting_3,
    "srs_setting_4": self.srs_setting_4,
}


Blog = {
    "id": self.id,
    "title": self.title,
    "slug": self.slug,
    "content": self.content,
    "summary": self.summary,
    "author_name": self.author_name,
    "tags": self.tags,
    "thumbnail": self.thumbnail,
    "time_created": self.time_created,
    "time_updated": self.time_updated,
    "views": self.views,
    "user_id": self.user_id,
}


Card = card_dict = {
    "id": self.id,
    "term": self.term,
    "content": self.content,
    "boc_2": self.boc_2,
    "boc_3": self.boc_3,
    "boc_4": self.boc_4,
    "formula": self.formula,
    "img": self.img,
    "sound": self.sound,
    "boc_id": self.boc_id,
    "box_id": self.box_id,
    "srs_interval": self.srs_interval,
    "time_updated": self.time_updated.isoformat() if self.time_updated else None,
    "times_asked": self.times_asked,
    "times_correct": self.times_correct,
    "times_correct_row": self.times_correct_row,
    "create_method": self.create_method,
    "time_created": self.time_created.isoformat() if self.time_created else None,
    "category": self.category,
    "edited": self.edited,
    "diff_lvl": self.diff_lvl,
    "subject": self.subject,
    "topic": self.topic,
    "prompt_option": self.prompt_option,
    "prompt_option2": self.prompt_option2,
    "trans_option": self.trans_option,
    "len_option": self.len_option,
    "qmin_option": self.qmin_option,
    "qmax_option": self.qmax_option,
    "fav": self.fav,
}

DeckAttributes = {
    "id": self.id,
    "deck_id": self.deck_id,
    "subject": self.subject,
    "grade": self.grade,
    "topic": self.topic,
    "sub_topic": self.sub_topic,
    "difficulty": self.difficulty,
    "concepts": self.concepts,
    "time_created": self.time_created,
    "language": self.language,
}

DeckFiles = {
    "id": self.id,
    "file_name": self.file_name,
    "file_path": self.file_path,
    "file_type": self.file_type,
    "file_size": self.file_size,
    "text_string": self.text_string,
    "create_type": self.create_type,
    "time_created": self.time_created.isoformat()
    if self.time_created
    else None,  # converting time to string
    "fav": self.fav,
}

JobNotification = {
    "id": self.id,
    "user_id": self.user_id,
    "slug": self.slug,
    "state": self.state,
    "complete": self.complete,
    "notified": self.notified,
    "time_created": self.time_created,
    "cost": self.cost,
    "input_details": self.input_details,
    "extract_type": self.extract_type,
}

Job = {
    "id": self.id,
    "user": self.user,
    "slug": self.slug,
    "task_type": self.task_type,
    "state": self.state,
    "result": self.result,
    "payload": self.payload,
    "priority": self.priority,
    "start_time": self.start_time,
    "end_time": self.end_time,
    "time_created": self.time_created,
    "time_updated": self.time_updated,
    "error_message": self.error_message,
    "error_traceback": self.error_traceback,
    "error_type": self.error_type,
    "item_number": self.item_number,
    "item_quantity": self.item_quantity,
    "processed_content": self.processed_content,
    "deck_id": self.deck_id,
    "save_source": self.save_source,
    "qty_cards_created": self.qty_cards_created,
}


SharedDecks = {
    "id": self.id,
    "name": self.name,
    "description": self.description,
    "sender": self.sender,
    "receiver": self.receiver,
    "time_created": self.time_created.isoformat() if self.time_created else None,
    "creator": self.creator,
    "public": self.public,
    "edited": self.edited,
    "share_id": self.share_id,
}


GameAnswer = {
    "id": self.id,
    "text": self.text,
    "game_id": self.game_id,
    "round": self.round,
    "user_id": self.user_id,
    "is_correct": self.is_correct,
}

GameVote = {
    "id": self.id,
    "answer_id": self.answer_id,
    "user_id": self.user_id,
    "round": self.round,
    "game_id": self.game_id,
}

Game = {
    "id": self.id,
    "creator": self.creator,
    "current_flashcard_id": self.current_flashcard_id,
    "deck_id": self.deck_id,
    "rounds": self.rounds,
    "time_limit": self.time_limit,
    "time_created": self.time_created.strftime("%Y-%m-%d %H:%M:%S")
    if self.time_created
    else None,
    "start_time": self.start_time.strftime("%Y-%m-%d %H:%M:%S")
    if self.start_time
    else None,
    "current_round": self.current_round,
}

PlayerGame = {
    "id": self.id,
    "player_id": self.player_id,
    "username": self.username,
    "game_id": self.game_id,
    "score": self.score,
    "turns_as_main_player": self.turns_as_main_player,
    "points": self.points,
}

GroupInvite = {
    "id": self.id,
    "name": self.name,
    "group_id": self.group_id,
    "user_id": self.user_id,
    "invited_by_id": self.invited_by_id,
    "invited_by_email": self.invited_by_email,
    "time_created": self.time_created.isoformat() if self.time_created else None,
    "time_updated": self.time_updated.isoformat() if self.time_updated else None,
}

Group = {
    {
        "id": self.id,
        "name": self.name,
        "description": self.description,
        "group_type": self.group_type,
        "time_created": self.time_created,
        "time_updated": self.time_updated,
        "creator_id": self.creator_id,
        "avatar": self.avatar,
        "is_private": self.is_private,
        "fav": self.fav,
    }
}

QuestionResult = {
    "id": self.id,
    "test_id": self.test_id,
    "taker": self.taker,
    "question_id": self.question_id,
    "answer": self.answer,
    "points": self.points,
    "time_created": self.time_created,
    "quiz_result_id": self.quiz_result_id,
    "correct": self.correct,
}

Question = {
    {
        "id": self.id,
        "question": self.question,
        "term": self.term,
        "content": self.content,
        "boc_2": self.boc_2,
        "boc_3": self.boc_3,
        "boc_4": self.boc_4,
        "formula": self.formula,
        "prompt_option": self.prompt_option,
        "q_type": self.q_type,
        "q_order": self.q_order,
        "points": self.points,
    }
}

QuizResult = {
    "id": self.id,
    "test_id": self.test_id,
    "taker": self.taker,
    "creator": self.creator,
    "due_date": self.due_date,
    "start_time": self.start_time,
    "end_time": self.end_time,
    "points": self.points,
    "correct": self.correct,
    "blank": self.blank,
    "graded": self.graded,
}


Quiz = {
    "id": self.id,
    "name": self.name,
    "points": self.points,
    "num_questions": self.num_questions,
    "category": self.category,
    "subject": self.subject,
    "topic": self.topic,
    "time_created": self.time_created.strftime("%Y-%m-%d %H:%M:%S"),
    "due_date": self.due_date.strftime("%Y-%m-%d %H:%M:%S"),
    "creator": self.creator,
    "result_reveal": self.result_reveal,
    "answer_reveal": self.answer_reveal,
    "time_limit": self.time_limit,
    "instructions": self.instructions,
    "description": self.description,
    "shuffle": self.shuffle,
    "image": self.image,
    "text": self.text,
    "deck_id": self.deck_id,
    "share_id": self.share_id,
    "fav": self.fav,
}

Feedback = {
    "id": self.id,
    "name": self.name,
    "email": self.email,
    "message": self.message,
    "time_created": self.time_created.isoformat(),
    "type_feedback": self.type_feedback,
}


DeletedAccounts = {
    "id": self.id,
    "user_id": self.user_id,
    "email": self.email,
    "time_created": self.time_created.isoformat(),
    "time_deleted": self.time_deleted.isoformat(),
    "reason": self.reason,
    "reason_details": self.reason_details,
}

Subscriber = {
    "id": self.id,
    "first_name": self.first_name,
    "last_name": self.last_name,
    "email": self.email,
    "time_created": self.time_created.isoformat(),
}


SubscriptionPlan = {
    "id": self.id,
    "name": self.name,
    "description": self.description,
    "limit_count": self.limit_count,
    "limit_time_period": self.limit_time_period,
    "price": self.price,
    "duration": self.duration,
}


UsageRecords = {
    {
        "id": self.id,
        "user_id": self.user_id,
        "operation_type": self.operation_type,
        "operation_details": self.operation_details,
        "operation_count": self.operation_count,
        "remaining_count": self.remaining_count,
        "time_period": self.time_period,
        "limit_count": self.limit_count,
        "date": self.date,
        "status": self.status,
        "source_ip": self.source_ip,
        "payment_status": self.payment_status,
    }
}
