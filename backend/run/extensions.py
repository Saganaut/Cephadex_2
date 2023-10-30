# from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
# bcrypt = Bcrypt()
migrate = Migrate()
socketio = SocketIO()

def init_extensions(app):
    db.init_app(app)
    # bcrypt.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app, cors_allowed_origins="*")

    return db,  migrate, socketio

# bcrypt,