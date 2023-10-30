from datetime import datetime
from run.extensions import db

## TO DO what happens to group if creator deletes account
class Group(db.Model):
    __tablename__ = "group"
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=no-member
    name = db.Column(db.String(255))  # pylint: disable=no-member
    description = db.Column(db.String(255))  # pylint: disable=no-member
    group_type = db.Column(db.String(255))  # pylint: disable=no-member
    time_created = db.Column(db.DateTime, default=datetime.utcnow)  # pylint: disable=no-member
    time_updated = db.Column(db.DateTime, onupdate=datetime.utcnow)  # pylint: disable=no-member
    creator_id = db.Column(db.Integer, db.ForeignKey("user.id"))  # pylint: disable=no-member
    creator = db.relationship("User", foreign_keys=[creator_id])  # pylint: disable=no-member
    avatar = db.Column(db.String(255)) # pylint: disable=no-member
    is_private = db.Column(db.Boolean, default=False)  # pylint: disable=no-member
    decks = db.relationship("Deck", back_populates="group")  # pylint: disable=no-member
    fav = db.Column(db.Boolean, default = False)


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "group_type": self.group_type,
            "time_created": self.time_created,
            "time_updated": self.time_updated,
            "creator_id": self.creator_id,
            "avatar": self.avatar,
            "is_private": self.is_private,
            "fav": self.fav
        }