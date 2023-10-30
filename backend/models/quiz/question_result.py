from datetime import datetime
from run.extensions import db


class QuestionResult(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    test_id = db.Column(
        db.Integer, db.ForeignKey("test.id", ondelete="SET NULL"), nullable=True
    )
    taker = db.Column(
        db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"))
    answer = db.Column(db.String(2500))
    points = db.Column(db.Integer)
    time_created = db.Column(db.DateTime, default=datetime.utcnow)
    # timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    quiz_result_id = db.Column(
        db.Integer, db.ForeignKey("test_result.id", ondelete="SET NULL")
    )
    correct = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "test-id": self.test_id,
            "taker": self.taker,
            "question-id": self.question_id,
            "answer": self.answer,
            "points": self.points,
            "time-created": self.time_created,
            "quiz-result-id": self.quiz_result_id,
            "correct": self.correct,
        }
