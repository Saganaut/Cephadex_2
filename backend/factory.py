
from flask import Flask
from run.logger_setup import setup_app_logger, setup_payment_logger
from run.config import configure_app
from run.extensions import db, migrate, socketio, login_manager

import logging


def create_app():
    print("calling create_app")
    app = Flask(__name__)
    configure_app(app)

    db.init_app(app)
    migrate.init_app(app, db)
    
    socketio.init_app(app, cors_allowed_origins="*")
    login_manager.init_app(app)
    logging.getLogger('socketio').setLevel(logging.DEBUG)
    logging.getLogger('engineio').setLevel(logging.DEBUG)
    app.logger.setLevel(logging.DEBUG)
    setup_app_logger()
    setup_payment_logger()
    return app