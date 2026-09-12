from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    Table,
    UniqueConstraint,
)

from startup.setup_db import Base

# relational database cards & decks


cards = Table(
    "cards",
    Base.metadata,
    Column("card_id", Integer, ForeignKey("card.id", ondelete="CASCADE")),
    Column("deck_id", Integer, ForeignKey("deck.id", ondelete="CASCADE")),
)

source_files = Table(
    "source_files",
    Base.metadata,
    Column("deck_file_id", Integer, ForeignKey("deck_files.id", ondelete="CASCADE")),
    Column("deck_id", Integer, ForeignKey("deck.id", ondelete="CASCADE")),
)

questions = Table(
    "questions",
    Base.metadata,
    Column("test_id", Integer, ForeignKey("test.id", ondelete="CASCADE")),
    Column("question_id", Integer, ForeignKey("question.id", ondelete="CASCADE")),
    Column("position", Integer),
    Column("text", String(255)),
    Column("image", String(255)),
)
distribution = Table(
    "distribution",
    Base.metadata,
    Column("test_id", Integer, ForeignKey("test.id", ondelete="CASCADE")),
    Column("taker_id", Integer, ForeignKey("user.id", ondelete="CASCADE")),
)

deck_relationships = Table(
    "deck_relationships",
    Base.metadata,
    Column("parent_deck", Integer, ForeignKey("deck.id", ondelete="CASCADE")),
    Column("child_deck", Integer, ForeignKey("deck.id", ondelete="CASCADE")),
)

user_group_association = Table(
    "user_group_association",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("user.id", ondelete="CASCADE")),
    Column("group_id", Integer, ForeignKey("group.id", ondelete="CASCADE")),
    Column("role", String(20)),
    Column("permissions", String(50)),
    UniqueConstraint("user_id", "group_id", name="uix_user_group"),
)


# skills_category_skill = Table(
#     "skills_category_skill",
#     Base.metadata,
#     Column("skill_id", Integer, ForeignKey("skill.id"), primary_key=True),
#     Column("category_id", Integer, ForeignKey("skills_category.id"), primary_key=True),
# )
