from run.extensions import db


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    question = db.Column(db.String(1000), nullable=False)
    term = db.Column(db.String(1000), nullable=False)
    content = db.Column(db.String(1000), nullable=False)
    boc_2 = db.Column(db.String(1000), nullable=True)
    boc_3 = db.Column(db.String(1000), nullable=True)
    boc_4 = db.Column(db.String(1000), nullable=True)
    formula = db.Column(db.String(255), nullable=True)
    prompt_option = db.Column(db.String(255), nullable=True)
    q_type = db.Column(db.String(50), nullable=True)
    q_order = db.Column(db.Integer, nullable=True)
    points = db.Column(db.Integer, nullable=True)


def to_dict(self):
    return {
        "id": self.id,
        "question": self.question,
        "term": self.term,
        "content": self.content,
        "boc_2": self.boc_2,
        "boc_3": self.boc_3,
        "boc_4": self.boc_4,
        "formula": self.formula,
        "prompt_option": self.prompt_option,
        "q_type": self.q_type,
        "q_order": self.q_order,
        "points": self.points,
    }
