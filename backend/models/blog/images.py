from datetime import datetime
from run.extensions import db


class Images(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blog_id = db.Column(
        db.Integer, db.ForeignKey("blog_post.id"), nullable=True
    )  # Corrected this line
    name = db.Column(db.String(255), nullable=True)
    type = db.Column(db.String(255), nullable=True)
    image_url = db.Column(db.String(255), nullable=False)
    thumbnail_url = db.Column(db.String(255), nullable=True)
    time_created = db.Column(db.DateTime, default=datetime.now())


def to_dict():
    return {
        "id": self.id,
        "blog-id": self.blog_id,
        "name": self.name,
        "type": self.type,
        "image-url": self.image_url,
        "thumbnail-url": self.thumbnail_url,
        "time-created": self.time_created,
    }
