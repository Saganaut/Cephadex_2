
from config.settings import UPLOAD_FOLDER
import os
import openai
import stripe
from dotenv import load_dotenv
load_dotenv('C:/Users/kevin/Documents/Cephadex/backend/.env')

config_name = os.environ.get('ENVIRONMENT')
print(config_name)
def configure_app(app) -> None:
    print("configuring app")
    app.config['MAX_CONTENT_LENGTH'] = 104857600
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("SQLALCHEMY_DATABASE_URI")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    ##app.config.from_object('config')
    # Ensure templates are auto-reloaded
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    # Configure session to use filesystem (instead of signed cookies)
    app.config["SESSION_PERMANENT"] = False
    app.config["SESSION_TYPE"] = "filesystem"
    app.config['SESSION_COOKIE_SECURE'] = False
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_PATH'] = '/'
    openai.api_key = os.environ.get("OPENAI_API_KEY")
    stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
    endpoint_secret = os.environ.get("STRIPE_SIGNING_SECRET")


    app.config['SECURITY_PASSWORD_SALT'] = os.environ.get("SECURITY_PASSWORD_SALT", '146585145368132386173505678016728509634')
    app.config["SECURITY_EMAIL_VALIDATOR_ARGS"] = os.environ.get("SECURITY_EMAIL_VALIDATOR_ARGS")