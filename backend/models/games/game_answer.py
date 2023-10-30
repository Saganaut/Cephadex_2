from run.extensions import db


class GameAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(2560))
    game_id = db.Column(db.Integer, db.ForeignKey("game.id", ondelete="CASCADE"))
    round = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))
    is_correct = db.Column(db.Boolean, default=False)


def to_dict():
    return {
        "id": self.id,
        "text": self.text,
        "game_id": self.game_id,
        "round": self.round,
        "user_id": self.user_id,
        "is_correct": self.is_correct,
    }
