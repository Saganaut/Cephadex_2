import csv
import datetime as dt
import logging
import os
import shutil
import tempfile
from typing import Sequence, Union

from fastapi import HTTPException, UploadFile
from redis.asyncio import Redis as RedisAsync
from sqlalchemy import and_, asc, delete, desc, func, join, or_, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import aliased, joinedload, selectinload

from config import AppSettings, AWSSettings, Settings
from models.helpers.helpers import Helpers
from models.models_ import (
    Card,
    Deck,
    DeckFiles,
    DeckSharing,
    DeckSharingType,
    Group,
    NotificationType,
    PublicDeckData,
    RefTableType,
    User,
    UserDeckLikes,
    cards,
    deck_relationships,
    source_files,
)
from models.quiz.quiz import Test
from models.send_email import Emailer
from models.storage.s3 import StorageManager
from models.user.notification_manager import Notification_Manager

log = logging.getLogger("App")

ALLOWED_SORT_VALUES = [
    "name",
    "subject",
    "description",
    "date",
    "likes",
    "shares",
    "term",
    "category",
    "question",
    "points",
]
ALLOWED_ORDERS = ["asc", "desc"]
SORT_VALUE_DICT = {
    "name": "name",
    "subject": "subject",
    "description": "description",
    "date": "time_created",
    "likes": "likes",
    "shares": "shares",
    "term": "term",
}
""" points is used as a filter on the frontend to sort tempQuestions by points,
 but it is not a column in the db """
CARDS_SORT_VALUE_DICT = {
    "name": "term",
    "date": "time_created",
    "term": "term",
    "question": "term",
    "category": "category",
    "points": "term",
}


class DeckManager:
    """Class is only used to group methods that are used to manage decks"""

    """ retrieve methods conditionally return an HTTPEception or None if it is disbaled to
    allow re-use"""
    """ get methods do not return an HTTPException """

    @staticmethod
    async def search_cards(
        db: AsyncSession,
        deck_id: int,
        search_query: str | None = None,
        sort_value: str = "date",
        order: str = "desc",
        page: int = 1,
        items_per_page: int = 20,
    ) -> tuple[list[Card], int]:
        sort_value = sort_value.lower()
        order = order.lower()
        if sort_value not in ALLOWED_SORT_VALUES or order not in ALLOWED_ORDERS:
            msg = "Invalid sort value or order"
            raise ValueError(msg)
        sort_col = CARDS_SORT_VALUE_DICT[sort_value]
        sort_order = desc(text(sort_col)) if order == "desc" else asc(text(sort_col))
        query = (
            select(Card).distinct().join(cards, Card.id == cards.c.card_id).where(cards.c.deck_id == deck_id)
        )
        if search_query:
            query = query.where(Card.term.ilike(f"%{search_query}%"))

        query = query.order_by(sort_order)
        offset = (page - 1) * items_per_page
        query = query.offset(offset).limit(items_per_page)

        result = await db.execute(query)
        all_cards = list(result.scalars().all())

        card_alias = aliased(Card)
        cards_alias = aliased(cards)

        count_query = (
            select(func.count(func.distinct(card_alias.id)))
            .select_from(card_alias)
            .join(cards_alias, card_alias.id == cards_alias.c.card_id)
            .where(cards_alias.c.deck_id == deck_id)
        )
        if search_query:
            count_query = count_query.where(card_alias.term.ilike(f"%{search_query}%"))

        total_count_result = await db.execute(count_query)
        total_count = total_count_result.scalar()
        if total_count is None:
            total_count = 0
        return all_cards, total_count

    @staticmethod
    async def search_public_decks(
        db: AsyncSession,
        user_id: int,
        search_query: str,
        sort_value: str,
        order: str,
        page: int,
        items_per_page: int = 24,
    ) -> tuple[list[dict], int]:
        sort_value = sort_value.lower()
        order = order.lower()
        if sort_value not in ALLOWED_SORT_VALUES or order not in ALLOWED_ORDERS:
            msg = "Invalid sort value or order"
            raise ValueError(msg)
        sort_value = SORT_VALUE_DICT[sort_value]
        query = (
            select(func.count())
            .select_from(Deck)
            .where(
                Deck.public.is_(True),
                or_(
                    Deck.name.like(f"%{search_query.lower()}%"),
                    Deck.subject.like(f"%{search_query.lower()}%"),
                    Deck.description.like(f"%{search_query.lower()}%"),
                ),
            )
        )
        count_result = await db.execute(query)
        total_decks = count_result.scalar()
        deck_list = []
        total_pages = 0
        if total_decks is None:
            return [], 0
        offset = (page - 1) * items_per_page
        ##TODO: Why are we adding items_per_page and removing 1 here?
        total_pages = (total_decks + items_per_page - 1) // items_per_page

        result = await db.execute(
            select(
                Deck.id,
                Deck.name,
                Deck.description,
                Deck.subject,
                Deck.topic,
                Deck.tags,
                Deck.category,
                Deck.img,
                Deck.qty_cards,
                Deck.time_created,
                func.coalesce(PublicDeckData.likes, 0).label("likes"),
                func.coalesce(PublicDeckData.shares, 0).label("shares"),
            )
            .select_from(Deck)
            .outerjoin(PublicDeckData, Deck.id == PublicDeckData.deck_id)
            .where(
                and_(
                    Deck.public.is_(True),
                    or_(
                        Deck.name.like(f"%{search_query}%"),
                        Deck.subject.like(f"%{search_query}%"),
                        Deck.description.like(f"%{search_query}%"),
                    ),
                ),
            )
            .order_by(text(f"{sort_value} {order}"))
            .limit(items_per_page)
            .offset(offset)
            .distinct(),
        )

        decks = result.unique().all()
        deck_list = []
        for deck in decks:
            liked = False
            user_deck_like = await DeckManager.retrieve_user_deck_like(
                db,
                deck.id,
                user_id,
            )
            if user_deck_like is not None:
                liked = True
            (
                id,  # noqa: A001
                name,
                description,
                subject,
                topic,
                tags,
                category,
                img,
                qty_cards,
                time_created,
                likes,
                shares,
            ) = deck
            deck_dict = {
                "id": id,
                "name": name,
                "description": description,
                "subject": subject,
                "topic": topic,
                "tags": tags,
                "category": category,
                "img": img,
                "qty_cards": qty_cards,
                "likes": likes,
                "shares": shares,
                "liked": liked,
            }
            deck_list.append(deck_dict)

        return deck_list, total_pages

    @staticmethod
    async def search_public_cards(  # noqa: ANN205
        db: AsyncSession,
        deck_id: int,
        search_query: str,
        sort_value: str,
        order: str,
        page: int,
        items_per_page: int = 12,
    ):
        sort_value = sort_value.lower()
        order = order.lower()
        if sort_value not in ALLOWED_SORT_VALUES or order not in ALLOWED_ORDERS:
            msg = "Invalid sort value or order"
            raise ValueError(msg)
        sort_value = SORT_VALUE_DICT[sort_value]
        count_stmt = text("""
            SELECT COUNT(*)
            FROM card
            JOIN cards ON cards.card_id = card.id
            WHERE cards.deck_id = :deck_id
            AND (card.term LIKE :search_query OR card.content LIKE :search_query)
        """)
        count_result = await db.execute(
            count_stmt.bindparams(
                deck_id=deck_id,
                search_query=f"%{search_query.lower()}%",
            ),
        )
        total_cards = count_result.scalar()
        total_pages = 0
        if total_cards is None:
            return [], 0
        offset = (page - 1) * items_per_page
        total_pages = (total_cards + items_per_page - 1) // items_per_page
        ## select cards with onjoin from card relationships using deck_id
        result = await db.execute(
            select(
                Card.id,
                Card.term,
                Card.content,
                Card.boc_2,
                Card.boc_3,
                Card.boc_4,
                Card.formula,
                Card.category,
                Card.custom_back,
                Card.custom_front,
                Card.img,
                Card.topic,
                Card.sound,
                Card.language,
                Card.subject,
                Card.diff_lvl,
            )
            .join(cards)
            .where(cards.c.deck_id == deck_id)
            .order_by(text(f"{sort_value} {order}"))
            .limit(items_per_page)
            .offset(offset),
        )
        cards_results = result.unique().all()
        formatted_results = [
            {
                "id": card.id,
                "term": card.term,
                "content": card.content,
                "boc_2": card.boc_2,
                "boc_3": card.boc_3,
                "boc_4": card.boc_4,
                "formula": card.formula,
                "category": card.category,
                "custom_back": card.custom_back,
                "custom_front": card.custom_front,
                "img": card.img,
                "topic": card.topic,
                "sound": card.sound,
                "language": card.language,
                "subject": card.subject,
                "diff_lvl": card.diff_lvl,
            }
            for card in cards_results
        ]
        return formatted_results, total_pages

    @staticmethod
    async def retrieve_deck_id_from_card_id(db: AsyncSession, card_id: int) -> Deck:
        query = select(Deck).join(cards).where(cards.c.card_id == card_id)
        result = await db.execute(query)
        return result.scalars().first()

    @staticmethod
    def create_new_cards(new_cards: list[Card]) -> list[Card]:
        actually_new_cards = []
        for card in new_cards:
            new_card = Card(
                term=card.term,
                content=card.content,
                boc_2=card.boc_2,
                boc_3=card.boc_3,
                boc_4=card.boc_4,
                img=card.img,
                sound=card.sound,
                subject=card.subject,
                topic=card.topic,
                category=card.category,
            )
            actually_new_cards.append(new_card)
        return actually_new_cards

    @staticmethod
    async def import_cards_from_csv(file: UploadFile) -> list[Card]:
        data = await file.read()
        content = data.decode("utf-8")
        csv_reader = csv.reader(content.splitlines())
        next(csv_reader)
        cards = []
        for row in csv_reader:
            row_data = {
                "term": row[0] if len(row) > 0 else "",
                "content": row[1] if len(row) > 1 else "",
                "boc_2": row[2] if len(row) > 2 else "",  # noqa: PLR2004
                "boc_3": row[3] if len(row) > 3 else "",  # noqa: PLR2004
                "boc_4": row[4] if len(row) > 4 else "",  # noqa: PLR2004
                "formula": row[5] if len(row) > 5 else "",  # noqa: PLR2004
                "img": row[6] if len(row) > 6 else "",  # noqa: PLR2004
                "sound": row[7] if len(row) > 7 else "",  # noqa: PLR2004
                "category": row[8] if len(row) > 8 else "",  # noqa: PLR2004
                "subject": row[9] if len(row) > 9 else "",  # noqa: PLR2004
                "topic": row[10] if len(row) > 10 else "",  # noqa: PLR2004
                "srs_interval": row[11] if len(row) > 11 else "",  # noqa: PLR2004
                "times_asked": row[12] if len(row) > 12 else "",  # noqa: PLR2004
                "times_correct": row[13] if len(row) > 13 else "",  # noqa: PLR2004
            }
            card = Card(**row_data)
            cards.append(card)
        return cards

    @staticmethod
    async def retrieve_public_deck(db: AsyncSession, deck_id: int) -> Union[Deck, None]:
        result = await db.execute(
            select(Deck).where(and_(Deck.id == deck_id, Deck.public.is_(True))),
        )
        deck = result.scalars().first()
        if not deck:
            raise HTTPException(status_code=404, detail="Deck not found")
        return deck

    ## 30 ms
    @staticmethod
    async def retrieve_deck(
        db: AsyncSession,
        deck_id: int,
        return_http_exception: bool = True,
    ) -> Union[Deck, None]:
        result = await db.execute(select(Deck).where(Deck.id == deck_id))
        deck = result.scalars().first()
        if not deck:
            if return_http_exception:
                raise HTTPException(status_code=404, detail="Deck not found")
            return None
        return deck

    @staticmethod
    async def retrieve_public_deck_data(
        db: AsyncSession,
        deck_id: int,
    ) -> PublicDeckData:
        result = await db.execute(
            select(PublicDeckData).where(PublicDeckData.deck_id == deck_id),
        )
        public_deck_data = result.scalars().first()
        if not public_deck_data:
            public_deck_data = await DeckManager.create_public_deck_data_entry(
                db,
                deck_id,
            )
            await db.flush()
        return public_deck_data

    @staticmethod
    async def create_public_deck_data_entry(
        db: AsyncSession,
        deck_id: int,
    ) -> PublicDeckData:
        public_deck_data = PublicDeckData(deck_id=deck_id)
        db.add(public_deck_data)
        return public_deck_data

    @staticmethod
    async def retrieve_user_deck_like(
        db: AsyncSession,
        deck_id: int,
        user_id: int,
    ) -> UserDeckLikes:
        result = await db.execute(
            select(UserDeckLikes).where(
                UserDeckLikes.deck_id == deck_id,
                UserDeckLikes.user_id == user_id,
            ),
        )
        return result.scalars().first()

    @staticmethod
    async def toggle_like_public_deck(
        db: AsyncSession,
        deck_id: int,
        user_id: int,
    ) -> bool:
        public_deck_data = await DeckManager.retrieve_public_deck_data(db, deck_id)
        user_deck_like = await DeckManager.retrieve_user_deck_like(
            db,
            deck_id,
            user_id,
        )
        if user_deck_like is not None:
            public_deck_data.likes -= 1
            await db.delete(user_deck_like)
            return False
        user_deck_like = await DeckManager.create_user_deck_like(db, deck_id, user_id)
        if public_deck_data.likes is None:
            public_deck_data.likes = 1
        else:
            public_deck_data.likes += 1
        return True

    @staticmethod
    async def create_user_deck_like(db: AsyncSession, deck_id: int, user_id: int) -> UserDeckLikes:
        user_deck_like = UserDeckLikes(deck_id=deck_id, user_id=user_id)
        db.add(user_deck_like)
        return user_deck_like

    @staticmethod
    async def retrieve_card(
        db: AsyncSession,
        card_id: int,
        return_http_exception: bool = True,
    ) -> Card:
        result = await db.execute(select(Card).where(Card.id == card_id))
        card = result.scalars().first()
        if not card and return_http_exception:
            raise HTTPException(status_code=404, detail="Card not found")
        return card

    @staticmethod
    async def retrieve_cards(
        db: AsyncSession,
        deck: Deck,
        return_http_exception: bool = True,
    ) -> Union[list[Card], None]:
        cards = await DeckManager.load_cards(db, deck)
        if not cards:
            if return_http_exception:
                raise HTTPException(status_code=404, detail="No cards found")
            return []
        return cards

    ## TODO: consider changing this back to select in load.
    # Not obvious if there are time savings her
    @staticmethod
    async def retrieve_deck_and_load_cards(
        db: AsyncSession,
        deck_id: int,
        return_http_exception: bool = True,
    ) -> Union[Deck, None]:
        result = await db.execute(
            select(Deck).options(joinedload(Deck.cards)).where(Deck.id == deck_id),
        )
        deck = result.scalars().first()
        if not deck:
            if return_http_exception:
                raise HTTPException(status_code=404, detail="Deck not found")
            return None
        return deck

    @staticmethod
    async def retrieve_deck_and_load_everything(
        db: AsyncSession,
        deck_id: int,
        return_http_exception: bool = True,
    ) -> Union[Deck, None]:
        result = await db.execute(
            select(Deck)
            .options(
                selectinload(Deck.cards),
                selectinload(Deck.children),
                selectinload(Deck.deck_files),
            )
            .where(Deck.id == deck_id),
        )
        deck = result.scalars().first()
        if not deck:
            if return_http_exception:
                raise HTTPException(status_code=404, detail="Deck not found")
            return None
        return deck

    # @staticmethod
    # async def retrieve_shared_deck_and_load_cards(
    #     db: AsyncSession, deck_id: int, return_http_exception: bool = True
    # ):
    #     result = await db.execute(
    #         select(SharedDecks)
    #         .options(selectinload(SharedDecks.cards))
    #         .where(SharedDecks.id == deck_id)
    #     )
    #     deck = result.scalars().first()
    #     if not deck:
    #         if return_http_exception:
    #             raise HTTPException(status_code=404, detail="Deck not found")
    #         return
    #     return deck

    @staticmethod
    async def upload_deck_img(
        deck: Deck,
        deck_img: UploadFile,
        aws_settings: AWSSettings,
        folder: str = "profile_pictures",
    ) -> Deck:
        if deck_img.filename and StorageManager.allowed_img_file(deck_img.filename):
            filename = f"{deck.id}_{Helpers.secure_filename(deck_img.filename)}"
            temp_path = os.path.join(tempfile.gettempdir(), filename)  # noqa: PTH118

            with open(temp_path, "wb") as buffer:  # noqa: PTH123, ASYNC230
                shutil.copyfileobj(deck_img.file, buffer)

            StorageManager.upload_to_s3("profile_pictures", temp_path, filename)
            os.remove(temp_path)  # noqa: PTH107
            if deck.img is not None:
                try:
                    StorageManager.delete_s3_object_in_folder(
                        "profile_pictures",
                        deck.img,
                    )
                except Exception:
                    log.exception("Error deleting profile pic from s3: %s", deck.img)

            s3_pic_bucket = f"{aws_settings.s3_uri}/{aws_settings.bucket}/{folder}/"
            deck.img = s3_pic_bucket + filename

            return deck

        raise HTTPException(status_code=400, detail="Invalid file type")

    @staticmethod
    async def delete_deck_img(deck: Deck) -> Deck:
        if deck.img is not None:
            try:
                StorageManager.delete_s3_object_in_folder("profile_pictures", deck.img)
            except Exception:
                log.exception("Error deleting profile pic from s3: %s", deck.img)
            deck.img = None
            return deck
        raise HTTPException(status_code=400, detail="No image to delete")

    @staticmethod
    async def retrieve_deck_from_card_id(
        db: AsyncSession,
        card_id: int,
        return_http_exception: bool = True,
    ) -> Union[Deck, None]:
        result = await db.execute(
            select(Deck)
            .options(selectinload(Deck.cards))
            .join(cards, Deck.id == cards.c.deck_id)
            .join(Card, cards.c.card_id == Card.id)
            .where(Card.id == card_id),
        )
        deck = result.scalars().first()
        if not deck:
            if return_http_exception:
                raise HTTPException(status_code=404, detail="Deck not found")
            return None
        return deck

    @staticmethod
    async def get_all_decks_for_user(db: AsyncSession, user_id: int) -> list[Deck]:
        results = await db.execute(select(Deck).where(Deck.user_id == user_id))
        decks = results.unique().scalars().all()
        return list(decks)

    @staticmethod
    def check_permission(deck: Deck, user: User, return_http_exception: bool = True) -> bool:
        """Not async"""
        if deck.user_id != user.id:
            if return_http_exception:
                raise HTTPException(
                    status_code=403,
                    detail="You do not have permission to access this deck",
                )
            return False

        return True

    @staticmethod
    async def check_permissions_with_user_lookup(
        db: AsyncSession,
        deck_id: int,
        user_id: int,
    ) -> bool:
        deck = await db.execute(select(Deck).filter(Deck.id == deck_id))
        deck = deck.scalars().first()
        if deck is None:
            return False
        return deck.user_id == user_id

    @staticmethod
    async def copy_deck(db: AsyncSession, existing_deck: Deck, **kwargs: dict) -> Deck:
        new_deck = Deck(
            name=existing_deck.name,
            description=existing_deck.description,
            topic=existing_deck.topic,
            subject=existing_deck.subject,
            tags=existing_deck.tags,
            qty_cards=existing_deck.qty_cards,
            **kwargs,
        )
        db.add(new_deck)
        return new_deck

    @staticmethod
    async def copy_deck_cards(existing_deck: Deck, new_deck: Deck) -> list[Card]:
        # Assuming `existing_deck.cards` is already loaded
        new_cards = []
        for card in existing_deck.cards:
            new_card = Card(
                term=card.term,
                content=card.content,
                boc_2=card.boc_2,
                boc_3=card.boc_3,
                boc_4=card.boc_4,
                img=card.img,
                sound=card.sound,
                subject=card.subject,
                topic=card.topic,
                category=card.category,
            )
            new_cards.append(new_card)
            new_deck.cards.append(new_card)  # Append directly to new_deck.cards
        return new_cards

    @staticmethod
    async def delete_card(db: AsyncSession, card_id: int) -> None:
        stmt = delete(Card).where(Card.id == card_id)
        await db.execute(stmt)
        await db.commit()

    @staticmethod
    async def check_if_user_already_imported_deck(
        db: AsyncSession,
        user_id: int,
        deck_id: int,
    ) -> Union[Deck, bool]:
        stmt = select(Deck).where(Deck.user_id == user_id, Deck.copy_source == deck_id)
        result = await db.execute(stmt)
        deck = result.scalar()
        if deck is None:
            return False
        return deck

    # TODO: check this works correctly when typecasting as a list
    @staticmethod
    async def load_cards(db: AsyncSession, deck: Deck) -> list[Card]:
        stmt = select(Card).join(cards).where(cards.c.deck_id == deck.id)
        result = await db.execute(stmt)
        card_objects = result.scalars().all()
        return list(card_objects)

    @staticmethod
    async def load_deck_files(db: AsyncSession, deck: Deck) -> list[DeckFiles]:
        stmt = select(DeckFiles).join(source_files).where(source_files.c.deck_id == deck.id)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def load_group(db: AsyncSession, deck: Deck) -> list[Group]:
        from models.models_ import Group

        stmt = select(Group).where(Group.id == deck.group_id)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def load_children(db: AsyncSession, deck: Deck) -> list[Deck]:
        stmt = select(Deck).options(selectinload(Deck.children)).where(Deck.id == deck.id)

        result = await db.execute(stmt)
        deck = result.scalars().unique().one()
        return deck.children

    # 9.6 ms ,
    @staticmethod
    async def load_parents(db: AsyncSession, deck: Deck) -> list[Deck]:
        stmt = select(Deck).options(selectinload(Deck.parents)).where(Deck.id == deck.id)
        result = await db.execute(stmt)
        deck = result.scalars().unique().one()
        return deck.parents

    @staticmethod
    async def update_card_quantity_data(deck: Deck) -> None:
        current_time = dt.datetime.now()

        learning = 0
        new = 0
        mastered = 0
        total = 0
        due = 0
        seen = 0
        for card in deck.cards:
            # card_time_updated_naive = card.time_updated

            # if card_time_updated_naive.tzinfo is None:
            #     card_time_updated_aware = card_time_updated_naive.replace(
            #         tzinfo=timezone.utc
            #     )
            # else:
            #     card_time_updated_aware = card_time_updated_naive
            total += 1
            seen += card.times_asked
            time_diff = (current_time - card.time_updated).total_seconds() / 60
            if card.box_id != 0 and (time_diff + 1440) >= card.srs_interval:
                due += 1
            if card.box_id != 3 and card.times_asked != 0:  # noqa: PLR2004
                learning += 1
                if card.time_updated is None:
                    card.time_updated = current_time

            elif card.box_id == 3 and card.times_asked != 0:  # noqa: PLR2004
                mastered += 1
            else:
                new += 1
        deck.qty_cards_seen = seen
        deck.qty_cards_due = due
        deck.qty_cards = total
        deck.qty_cards_learning = learning
        deck.qty_new_cards = new
        deck.qty_cards_mastered = mastered

    @staticmethod
    def get_qty_correct_and_incorrect(cards: list[Card]) -> tuple[int, int]:
        correct: int = 0
        incorrect: int = 0
        for card in cards:
            if card.times_correct is not None and card.times_asked is not None:
                try:
                    correct = correct + int(card.times_correct)
                    incorrect = incorrect + int(card.times_asked) - int(card.times_correct)
                except ValueError:
                    pass
        return correct, incorrect

    @staticmethod
    async def check_cat(deck: Deck, cards: list) -> str:  # noqa: C901
        mcq: int = 0
        cloze: int = 0
        definitions: int = 0
        comprehension: int = 0
        vocab_builder: int = 0
        theories: int = 0
        rhyme: int = 0
        translate: int = 0
        people: int = 0
        ## check if all cards have same category
        for card in cards:
            if card.category == "Mcq":
                mcq += 1
            elif card.category == "Cloze":
                cloze += 1
            elif card.category == "Definitions":
                definitions += 1
            elif card.category == "Comprehension":
                comprehension += 1
            elif card.category == "Vocab_builder":
                vocab_builder += 1
            elif card.category == "Theories":
                theories += 1
            elif card.category == "Rhyme":
                rhyme += 1
            elif card.category == "Translate":
                translate += 1
            elif card.category == "People":
                people += 1
        ## loop through each category and check if it is the highest count
        categories = {
            "Mcq": mcq,
            "Cloze": cloze,
            "Definitions": definitions,
            "Comprehension": comprehension,
            "Vocab_builder": vocab_builder,
            "Theories": theories,
            "Rhyme": rhyme,
            "Translate": translate,
            "People": people,
        }
        max_category, max_count = max(categories.items(), key=lambda x: x[1])
        if max_count > len(cards) / 2:
            deck.category = max_category
            return max_category

        deck.category = "Mixed"
        return "Mixed"

    @staticmethod
    def total_answered(cards: list[Card]) -> int:
        total = 0
        for card in cards:
            if card.times_asked is not None:
                total = total + int(card.times_asked)
        return total

    @staticmethod
    async def update_qty_groups(deck: Deck) -> None:
        deck.qty_groups = len(deck.group)

    @staticmethod
    async def update_qty_children(db: AsyncSession, deck: Deck) -> int:
        count_query = (
            select(func.count())
            .select_from(deck_relationships)
            .where(deck_relationships.c.parent_deck == deck.id)
        )
        result = await db.execute(count_query)
        count = result.scalar_one()
        deck.qty_subdecks = count
        return count

    @staticmethod
    async def update_qty_files(db: AsyncSession, deck: Deck) -> int:
        count_query = (
            select(func.count()).select_from(source_files).where(source_files.c.deck_id == deck.id)
        )
        result = await db.execute(count_query)
        count = result.scalar_one()
        deck.qty_files = count
        return count

    @staticmethod
    async def update_qty_quizzes(db: AsyncSession, deck: Deck) -> int:
        count_query = select(func.count()).select_from(Test).where(Test.deck_id == deck.id)
        result = await db.execute(count_query)
        count = result.scalar_one()
        deck.qty_quizzes = count
        return count

    @staticmethod
    async def share_deck_to_users_or_guests(
        r_client: RedisAsync,
        db: AsyncSession,
        emails: list,
        deck: Deck,
        user: User,
        settings: Settings,
    ) -> None:
        for email in emails:
            stmt = select(User).where(User.email == email)
            result = await db.execute(stmt)
            shared_to = result.scalars().first()
            if shared_to:
                await DeckManager.shared_deck_with_user(
                    r_client,
                    db,
                    shared_to,
                    deck,
                    user,
                    settings,
                )
            else:
                await DeckManager.shared_deck_by_email(db, email, deck, user, settings)

    @staticmethod
    async def shared_deck_with_user(
        r_client: RedisAsync,
        db: AsyncSession,
        shared_to: User,
        deck: Deck,
        user: User,
        settings: Settings,
    ) -> None:
        shared_deck = DeckSharing(
            deck_id=deck.id,
            user_id=shared_to.id,
            type=DeckSharingType.user,
            user_email=shared_to.email,
        )
        db.add(shared_deck)
        await db.flush()
        await Notification_Manager.create_notification(
            r_client,
            db,
            shared_to,
            NotificationType.deck_shared,
            RefTableType.deck_sharing,
            shared_deck.id,
            f"{user.username} shared a deck with you",
            share_id=shared_deck.share_id,
        )
        link, img_str = DeckManager.get_share_link(shared_deck, settings.app)
        Emailer.send_email(
            settings.email,
            shared_to.email,
            shared_to.username,
            "deck_shared",
            f"{user.username} shared a deck with you!",
            link=link,
        )

    @staticmethod
    async def shared_deck_by_email(
        db: AsyncSession,
        email: str,
        deck: Deck,
        user: User,
        settings: Settings,
    ) -> None:
        shared_deck = DeckSharing(
            deck_id=deck.id,
            user_email=email,
            type=DeckSharingType.guest,
        )
        db.add(shared_deck)
        await db.flush()

        link, _ = DeckManager.get_share_link(
            shared_deck.share_id,
            settings.app,
            qr=False,
        )
        Emailer.send_email(
            settings.email,
            email,
            None,
            "deck_shared",
            f"{user.username} shared a deck with you!",
            link=link,
        )

    @staticmethod
    async def shared_deck_delete(
        db: AsyncSession,
        deck_sharing_id: int,
        user_id: int,
    ) -> None:
        stmt = delete(DeckSharing).where(
            DeckSharing.id == deck_sharing_id,
            DeckSharing.user_id == user_id,
        )
        await db.execute(stmt)
        await db.commit()

    @staticmethod
    async def shared_deck_general(
        db: AsyncSession,
        deck: Deck,
        settings: Settings,
        expire: bool = False,
        hours_until_expire: int = 168,
    ) -> tuple[str, str]:
        shared_deck = await DeckManager.check_shared_quiz_general_exists(db, deck.id)
        if shared_deck is None:
            shared_deck = DeckSharing(
                deck_id=deck.id,
                expire=expire,
                hours_until_expire=hours_until_expire,
                type=DeckSharingType.general,
            )
            db.add(shared_deck)
            await db.flush()
        link, img_str = DeckManager.get_share_link(shared_deck.share_id, settings.app)
        return link, img_str

    @staticmethod
    async def check_shared_quiz_general_exists(
        db: AsyncSession,
        deck_id: int,
    ) -> Union[None, DeckSharing]:
        stmt = select(DeckSharing).where(
            DeckSharing.deck_id == deck_id,
            DeckSharing.type == DeckSharingType.general,
        )
        result = await db.execute(stmt)
        return result.scalar()

    @staticmethod
    def get_share_link(
        deck_share_id: str,
        app_settings: AppSettings,
        qr: bool = True,
    ) -> tuple[str, str]:
        link = f"{app_settings.front_end_url}/deck/shared/{deck_share_id}"
        img_str = ""
        if qr is True:
            img_str = Helpers.create_qr_code(link, app_settings.image_folder_path)
        return link, img_str

    ## TODO: fix the return type
    @staticmethod
    async def get_shared_decks_for_user(db: AsyncSession, user: User) -> Sequence[DeckSharing]:
        stmt = (
            select(DeckSharing, Deck.name)
            .select_from(join(DeckSharing, Deck, DeckSharing.deck_id == Deck.id))
            .where(DeckSharing.user_id == user.id)
        )
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_shared_decks_by_email(
        db: AsyncSession,
        email: str,
    ) -> Sequence[DeckSharing]:
        stmt = select(DeckSharing).where(DeckSharing.user_email == email)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_shared_decks_by_deck(db: AsyncSession, deck: Deck) -> Sequence[DeckSharing]:
        stmt = select(DeckSharing).where(DeckSharing.deck_id == deck.id)
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_shared_deck_entry(
        db: AsyncSession,
        deck_share_id: str,
    ) -> DeckSharing:
        stmt = select(DeckSharing).where(DeckSharing.share_id == deck_share_id)
        result = await db.execute(stmt)
        return result.scalar()
