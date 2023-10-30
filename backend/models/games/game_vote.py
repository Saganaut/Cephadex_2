from run.extensions import db


class GameVote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    answer_id = db.Column(
        db.Integer, db.ForeignKey("game_answer.id", ondelete="CASCADE")
    )
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))
    round = db.Column(db.Integer)
    game_id = db.Column(db.Integer, db.ForeignKey("game.id", ondelete="CASCADE"))


def to_dict():
    return {
        "id": self.id,
        "answer_id": self.answer_id,
        "user_id": self.user_id,
        "round": self.round,
        "game_id": self.game_id,
    }
