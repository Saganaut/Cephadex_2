import datetime as dt
from typing import Any, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, backref, mapped_column, relationship

from models.relational_tables.association_tables import (
    cards,
    deck_relationships,
    source_files,
)
from startup.setup_db import Base


class Deck(Base):
    __tablename__ = "deck"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    time_created: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    time_updated: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
        onupdate=lambda: dt.datetime.now(),
    )
    creator: Mapped[int] = mapped_column((Integer), nullable=True)
    public: Mapped[bool] = mapped_column(Boolean, default=False)
    edited: Mapped[bool] = mapped_column(Boolean, default=False)
    create_method: Mapped[str] = mapped_column(String(20), nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=True)
    times_accessed: Mapped[int] = mapped_column(Integer, default=0)
    access_date: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=lambda: dt.datetime.now(),
    )
    subject: Mapped[str] = mapped_column(String(50), nullable=True)
    topic: Mapped[str] = mapped_column(String(100), nullable=True)
    shared: Mapped[bool] = mapped_column(Boolean, default=False)
    accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    sharer: Mapped[int] = mapped_column((Integer), nullable=True)
    source: Mapped[str] = mapped_column(String(500), nullable=True)
    share_date: Mapped[dt.datetime] = mapped_column(
        DateTime,
        default=dt.datetime.now(),
    )
    share_id: Mapped[str] = mapped_column(String(36), nullable=True, unique=True)
    group_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("group.id", ondelete="SET NULL"),
        nullable=True,
    )
    qty_cards: Mapped[int] = mapped_column(Integer, default=0)
    qty_cards_due: Mapped[int] = mapped_column(Integer, default=0)
    img: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    fav: Mapped[bool] = mapped_column(Boolean, default=False)
    qty_new_cards: Mapped[int] = mapped_column(Integer, default=0)
    qty_cards_learning: Mapped[int] = mapped_column(Integer, default=0)
    qty_cards_mastered: Mapped[int] = mapped_column(Integer, default=0)
    qty_groups: Mapped[int] = mapped_column(Integer, default=0)
    qty_files: Mapped[int] = mapped_column(Integer, default=0)
    qty_subdecks: Mapped[int] = mapped_column(Integer, default=0)
    qty_quizzes: Mapped[int] = mapped_column(Integer, default=0)
    qty_cards_seen: Mapped[int] = mapped_column(Integer, default=0)
    tags: Mapped[str] = mapped_column(String(255), nullable=True)
    copied: Mapped[bool] = mapped_column(Boolean, default=False)
    copy_source: Mapped[int] = mapped_column(Integer, nullable=True)
    cards = relationship(
        "Card",
        secondary=cards,
        backref="decks_backref",
        lazy="select",
    )
    deck_files = relationship(
        "DeckFiles",
        secondary=source_files,
        backref="decks",
        lazy="select",
    )
    group = relationship("Group", back_populates="decks", lazy="select")
    children = relationship(
        "Deck",
        secondary=deck_relationships,
        primaryjoin=(deck_relationships.c.parent_deck == id),
        secondaryjoin=(deck_relationships.c.child_deck == id),
        backref=backref("parents", lazy="select"),
    )

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description if self.description is not None else None,
            "user_id": self.user_id if self.user_id is not None else None,
            "qty_cards": self.qty_cards if self.qty_cards is not None else 0,
            "qty_cards_due": self.qty_cards_due if self.qty_cards_due is not None else 0,
            "time_created": self.time_created.isoformat()
            if isinstance(self.time_created, dt.datetime)
            else self.time_created,
            "time_updated": self.time_updated.isoformat()
            if isinstance(self.time_updated, dt.datetime)
            else self.time_updated,
            "creator": self.creator if self.creator is not None else None,
            "public": self.public if self.public is not None else 0,
            "edited": self.edited if self.edited is not None else 0,
            "create_method": self.create_method if self.create_method is not None else None,
            "category": self.category if self.category is not None else None,
            "times_accessed": self.times_accessed if self.times_accessed is not None else 0,
            "access_date": self.access_date.isoformat()
            if isinstance(self.access_date, dt.datetime)
            else self.access_date,
            "subject": self.subject if self.subject is not None else None,
            "topic": self.topic if self.topic is not None else None,
            "shared": self.shared if self.shared is not None else False,
            "accepted": self.accepted if self.accepted is not None else False,
            "sharer": self.sharer if self.sharer is not None else None,
            "source": self.source if self.source is not None else None,
            "share_date": self.share_date.isoformat()
            if isinstance(self.share_date, dt.datetime)
            else self.share_date,
            "share_id": self.share_id if self.share_id is not None else None,
            "fav": self.fav if self.fav is not None else False,
            "qty_new_cards": self.qty_new_cards if self.qty_new_cards is not None else 0,
            "qty_cards_learning": self.qty_cards_learning
            if self.qty_cards_learning is not None
            else 0,
            "qty_cards_mastered": self.qty_cards_mastered
            if self.qty_cards_mastered is not None
            else 0,
            "qty_groups": self.qty_groups if self.qty_groups is not None else 0,
            "qty_files": self.qty_files if self.qty_files is not None else 0,
            "qty_subdecks": self.qty_subdecks if self.qty_subdecks is not None else 0,
            "tags": self.tags if self.tags is not None else None,
            "qty_cards_seen": self.qty_cards_seen if self.qty_cards_seen is not None else 0,
            "copied": self.copied if self.copied is not None else False,
            "copy_source": self.copy_source if self.copy_source is not None else None,
            "img": self.img if self.img is not None else None,
            "qty_quizzes": self.qty_quizzes if self.qty_quizzes is not None else 0,
        }

    def to_dict_public(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description if self.description is not None else None,
            "user_id": self.user_id if self.user_id is not None else None,
            "creator": self.creator if self.creator is not None else None,
            "public": self.public if self.public is not None else 0,
            "category": self.category if self.category is not None else None,
            "subject": self.subject if self.subject is not None else None,
            "topic": self.topic if self.topic is not None else None,
            "tags": self.tags if self.tags is not None else None,
            "img": self.img if self.img is not None else None,
            "qty_cards": self.qty_cards if self.qty_cards is not None else 0,
        }

    # @staticmethod
    # def force_study(cards) -> json:
    #     due_cards = []
    #     current_time = dt.datetime.now()()
    #     for card in cards:
    #         time_diff = (current_time - card.time_updated).total_seconds() / 60
    #         due_cards.append(
    #             {
    #                 "term": card.term,
    #                 "content": card.content,
    #                 "boc-2": card.boc_2,
    #                 "boc-3": card.boc_3,
    #                 "boc-4": card.boc_4,
    #                 "category": card.category,
    #                 "id": card.id,
    #                 "img": card.img,
    #                 "sound": card.sound,
    #                 "time-remain": card.srs_interval - time_diff,
    #             }
    #         )
    #     due_cards.sort(key=lambda x: x["time_remain"])
    #     return json.dumps(due_cards)

    # @staticmethod
    # def quantity_cards(cards) ->Mapped[int]:
    #     return len(cards)

    # @staticmethod
    # async def add_card(deck, db: Session, card):
    #     deck.cards.append(card)
    #     await db.commit()

    # @staticmethod
    # async def remove_card(deck, db: Session, card):
    #     deck.cards.remove(card)
    #     await db.commit()

    # @staticmethod
    # async def rename_deck(deck, db: Session, new_name):
    #     deck.name = new_name
    #     await db.commit()

    # @staticmethod
    # async def delete_deck(
    #     deck,
    #     db: Session,
    # ):
    #     db.delete(deck)
    #     await db.commit()

    # # @staticmethod
    # # async def copy_deck_obsolete(deck, db: Session, new_deck_name):
    # #     new_deck = Deck(
    # #         name=deck.name, description=deck.description, user_id=deck.user_id
    # #     )
    # #     new_deck.name = new_deck_name
    # #     db.session.add(new_deck)
    # #     await db.commit()
    # #     return new_deck

    # def assign_deck(self, user):
    #     pass

    # def export_deck_csv(self):
    #     pass

    # def import_deck_csv(self):
    #     pass
