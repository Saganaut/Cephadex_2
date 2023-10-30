from datetime import datetime
from run.extensions import db


class DeckFiles(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    file_name = db.Column(db.String(100))
    file_path = db.Column(db.String(50))
    file_type = db.Column(db.String(500))	
    file_size = db.Column(db.String(50))
    text_string = db.Column(db.Text)
    create_type = db.Column(db.String(50))
    time_created = db.Column(db.DateTime, default=datetime.utcnow)
    fav = db.Column(db.Boolean, default = False)

    def to_dict(self):
        return {
            "id": self.id,
            "file_name": self.file_name,
            "file_path": self.file_path,
            "file_type": self.file_type,
            "file_size": self.file_size,
            "text_string": self.text_string,
            "create_type": self.create_type,
            "time_created": self.time_created.isoformat() if self.time_created else None,  # converting time to string
            "fav": self.fav

        
        }