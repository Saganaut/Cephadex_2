from datetime import datetime
from run.extensions import db


class GroupInvite(db.Model):
    __tablename__ = "group_invite"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    group_id = db.Column(db.Integer, db.ForeignKey("group.id", ondelete="CASCADE"))
    group = db.relationship("Group", foreign_keys=[group_id])
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))
    invited_by_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"))
    invited_by_email = db.Column(db.String(255))
    time_created = db.Column(db.DateTime, default=datetime.utcnow)
    time_updated = db.Column(db.DateTime, onupdate=datetime.utcnow)

    def to_dict(self):

        return {
            'id': self.id,
            'name': self.name,
            'group-id': self.group_id,
            'user-id': self.user_id,
            'invited-by-id': self.invited_by_id,
            'invited-by-email': self.invited_by_email,
            'time-created': self.time_created.isoformat() if self.time_created else None,
            'time-updated': self.time_updated.isoformat() if self.time_updated else None,
        }