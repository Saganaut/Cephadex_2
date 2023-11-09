from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO(logger=True,async_mode='eventlet', engineio_logger=True, cors_allowed_origins='*')
login_manager = LoginManager()


