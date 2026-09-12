# ##!! DEPRECATED DO NOT USRE
# from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
# from sqlalchemy.orm import relationship
# import datetime as dt
# from models.relational_tables.association_tables import cards_shared
# from startup.setup_db import Base


# class SharedDecks(Base):
#     __tablename__ = "shared_decks"
#     id: int = Column(Integer, primary_key=True, autoincrement=True)  # type: ignore
#     name: str = Column(String(50), nullable=False)  # type: ignore
#     description: str = Column(String(255), nullable=False)  # type: ignore
#     sender: int = Column(  # type: ignore
#         Integer,
#         ForeignKey("user.id", ondelete="SET NULL"),
#         nullable=True,
#     )
#     receiver: int = Column(  # type: ignore
#         Integer,
#         ForeignKey("user.id", ondelete="SET NULL"),
#         nullable=True,
#     )
#     receiver_name: str = Column(String(50), nullable=True)  # type: ignore
#     sender_name: str = Column(String(50), nullable=True)  # type: ignore
#     time_created: datetime = Column(DateTime, default=dt.datetime.now())  # type: ignore
#     creator: int = Column(Integer)  # type: ignore
#     public: bool = Column(Boolean, default=False)  # type: ignore
#     edited: bool = Column(Boolean, default=False)  # type: ignore
#     cards = relationship("Card", secondary=cards_shared, backref="decks", lazy="select")
#     share_id: str = Column(String(36), nullable=True, unique=True)  # type: ignore

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "name": self.name,
#             "description": self.description if self.description else None,
#             "sender": self.sender if self.sender else None,
#             "receiver": self.receiver if self.receiver else None,
#             "time_created": self.time_created.isoformat()
#             if isinstance(self.time_created, dt.datetime)
#             else self.time_created,
#             "creator": self.creator if self.creator else None,
#             "public": self.public if self.public else 0,
#             "edited": self.edited if self.edited else 0,
#             "share_id": self.share_id if self.share_id else None,
#         }
