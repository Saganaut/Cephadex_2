from run.extensions import db

class PlayerGame(db.Model):
    __tablename__ = 'player_game'
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    username = db.Column(db.String(64))
    game_id = db.Column(db.Integer, db.ForeignKey('game.id', ondelete='CASCADE'), primary_key=True)
    score = db.Column(db.Integer, default=0)
    turns_as_main_player = db.Column(db.Integer, default=0)
    points = db.Column(db.Integer, default = 0)

    def to_dict(self):
        return {
            'id': self.id,
            'player_id': self.player_id,
            'username': self.username,
            'game_id': self.game_id,
            'score': self.score,
            'turns_as_main_player': self.turns_as_main_player,
            'points': self.points,
        }