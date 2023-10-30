from run.extensions import db


class UserSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user = db.Column(
        db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    language = db.Column(db.String(50))
    theme = db.Column(db.String(50))
    new_user = db.Column(db.Boolean, default=True)
    new_user_study = db.Column(db.Boolean, default=True)
    new_user_decks = db.Column(db.Boolean, default=True)
    new_user_tests = db.Column(db.Boolean, default=True)
    new_user_cards = db.Column(db.Boolean, default=True)
    srs_setting_1 = db.Column(db.Integer)
    srs_setting_2 = db.Column(db.Integer)
    srs_setting_3 = db.Column(db.Integer)
    srs_setting_4 = db.Column(db.Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user,
            "language": self.language,
            "theme": self.theme,
            "new_user": self.new_user,
            "new_user_study": self.new_user_study,
            "new_user_decks": self.new_user_decks,
            "new_user_tests": self.new_user_tests,
            "new_user_cards": self.new_user_cards,
            "srs_setting_1": self.srs_setting_1,
            "srs_setting_2": self.srs_setting_2,
            "srs_setting_3": self.srs_setting_3,
            "srs_setting_4": self.srs_setting_4,
        }
