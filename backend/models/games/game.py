from datetime import datetime
from run.extensions import db

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator = db.Column(db.Integer, db.ForeignKey('user.id',
                                                   ondelete='CASCADE'), nullable=False)
    current_flashcard_id = db.Column(db.Integer, db.ForeignKey('card.id', ondelete='SET NULL'))
    deck_id = db.Column(db.Integer, db.ForeignKey('deck.id', ondelete='SET NULL'))
    rounds = db.Column(db.Integer, default=0)
    time_limit = db.Column(db.Integer, default=0)
    time_created = db.Column(db.DateTime, default=datetime.utcnow)
    start_time = db.Column(db.DateTime)
    current_round = db.Column(db.Integer, default=0)
    players = db.relationship('PlayerGame', backref='game')

    def to_dict(self):
        return {
            'id': self.id,
            'creator': self.creator,
            'current_flashcard_id': self.current_flashcard_id,
            'deck_id': self.deck_id,
            'rounds': self.rounds,
            'time_limit': self.time_limit,
            'time_created': self.time_created.strftime("%Y-%m-%d %H:%M:%S") if self.time_created else None,
            'start_time': self.start_time.strftime("%Y-%m-%d %H:%M:%S") if self.start_time else None,
            'current_round': self.current_round,
        }