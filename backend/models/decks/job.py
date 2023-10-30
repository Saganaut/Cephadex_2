from datetime import datetime
from run.extensions import db


class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user = db.Column(
        db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), nullable=True
    )
    slug = db.Column(db.String(64), nullable=False)
    task_type = db.Column(db.String(64), nullable=True)
    state = db.Column(db.String(10), nullable=False, default="queued")
    result = db.Column(db.Integer, default=0)
    payload = db.Column(db.Text, nullable=True)
    priority = db.Column(db.Integer, nullable=False, default=0)
    start_time = db.Column(db.DateTime, nullable=True)
    end_time = db.Column(db.DateTime, nullable=True)
    time_created = db.Column(db.DateTime, default=datetime.utcnow)
    time_updated = db.Column(db.DateTime, nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    error_traceback = db.Column(db.Text, nullable=True)
    error_type = db.Column(db.String(64), nullable=True)
    item_number = db.Column(db.Integer, nullable=True)
    item_quantity = db.Column(db.Integer, nullable=True)
    processed_content = db.Column(db.Text, nullable=True)
    deck_id = db.Column(
        db.Integer, db.ForeignKey("deck.id", ondelete="CASCADE"), nullable=True
    )
    save_source = db.Column(db.Boolean, default=False)
    qty_cards_created = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
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
