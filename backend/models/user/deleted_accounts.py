from datetime import datetime
from run.extensions import db


class DeletedAccounts(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer)
    email = db.Column(db.String(255))
    time_created = db.Column(db.DateTime)
    time_deleted = db.Column(db.DateTime, default=datetime.utcnow)
    reason = db.Column(db.String(255))
    reason_details = db.Column(db.Text)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "email": self.email,
            "time_created": self.time_created.isoformat(),
            "time_deleted": self.time_deleted.isoformat(),
            "reason": self.reason,
            "reason_details": self.reason_details,
        }
