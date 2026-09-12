import datetime as dt
import logging
from typing import Any, Optional
from urllib.parse import urlencode

import requests
from fastapi import (
    Response,
)
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from jose import jwt
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from config import Settings
from models.helpers.log_decorators import log_decorator
from models.models_ import Subscriber, User
from models.user.user_manager import UserManager
from routes.data_classes.user_schema import SignUpRequest

logger = logging.getLogger("App")

STARTING_CREDIT = 50


class NewUser(BaseModel):
    username: str
    email: EmailStr
    id_token: str
    given_name: str
    family_name: str
    external_type: str
    role: str
    how_did_your_hear_about_us: str
    what_do_you_want_to_do: str


class AuthManager:
    @staticmethod
    def get_discord_token(code: str, settings: Settings) -> Response:
        token_endpoint = "https://discord.com/api/oauth2/token"  # noqa: S105
        data = {
            "client_id": settings.auth.discord_client_id,
            "client_secret": settings.auth.discord_client_secret,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": f"{settings.app.app_url}{settings.auth.discord_redirect_uri}",
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        try:
            response = requests.post(token_endpoint, data=data, headers=headers, timeout=10)
        except Exception:
            logger.exception("Error during discord token request")
        return response.json()

    @staticmethod
    def get_discord_user_info(token: str):  # noqa: ANN205
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get("https://discord.com/api/users/@me", headers=headers, timeout=10)
        return response.json()  # Contains user info

    @staticmethod
    def create_access_token(
        data: dict,
        settings: Settings,
        expires_delta: Optional[dt.timedelta] = None,
    ) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = dt.datetime.now() + expires_delta
        else:
            expire = dt.datetime.now() + dt.timedelta(
                minutes=settings.auth.max_age,
            )
        to_encode.update({"exp": expire})
        return jwt.encode(
            to_encode,
            settings.auth.secret_key,
            algorithm=settings.auth.algorithm,
        )

    @staticmethod
    async def verify_google_signin(credential: str, settings: Settings) -> Any:  # noqa: ANN401
        try:
            return id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.auth.google_auth2_client_id,
            )
        except ValueError:
            logger.exception("Error during google sign in")
            return None

    @staticmethod
    @log_decorator
    async def add_subscriber_to_newsletter(
        db: AsyncSession,
        email: str,
        given_name: Optional[str] = None,
        family_name: Optional[str] = None,
    ) -> Optional[Subscriber]:
        try:
            existing_subscriber = await UserManager.check_subscriber_exists(db, email)

            if existing_subscriber is None:
                subscriber = Subscriber(
                    email=email,
                    first_name=given_name,
                    last_name=family_name,
                )
                db.add(subscriber)
                return subscriber
        except Exception:
            logger.exception(
                "Error during adding subscriber to newsletter:",
            )
            return None

    @staticmethod
    def extract_sign_up_user_data(request: SignUpRequest) -> dict:
        return {
            "username": request.username,
            "subscribe": request.newsletter,
            "role": request.role,
            "given_name": request.firstName,
            "family_name": request.lastName,
            "email": request.email,
            "id_token": request.token,
            "pic": request.picture,
            "how_did_your_hear_about_us": request.howDidYouHearAboutUs,
            "what_do_you_want_to_do": request.whatDoYouWantToDo,
            "external_type": request.externalType,
        }

    @staticmethod
    def turn_guest_into_regular_user(guest_user: User, **kwargs) -> User:  # noqa: ANN003
        guest_user.username = kwargs.get("username", guest_user.username)
        guest_user.guest = False
        guest_user.external_id = kwargs.get("id_token", guest_user.external_id)
        guest_user.first_name = kwargs.get("given_name", guest_user.first_name)
        guest_user.last_name = kwargs.get("family_name", guest_user.last_name)
        guest_user.external_type = kwargs.get("external_type", guest_user.external_type)
        guest_user.subscription_start_date = dt.datetime.now()
        guest_user.role = kwargs.get("role", guest_user.role)
        guest_user.hear_about_us = kwargs.get(
            "how_did_your_hear_about_us",
            guest_user.hear_about_us,
        )
        guest_user.want_to_do = kwargs.get(
            "what_do_you_want_to_do",
            guest_user.want_to_do,
        )
        guest_user.email = kwargs.get("email", guest_user.email)
        guest_user.pic = kwargs.get("pic", guest_user.pic)
        guest_user.remaining_credit = STARTING_CREDIT
        return guest_user

    @staticmethod
    def create_new_user(kwargs: dict) -> User:
        user_data = NewUser(**kwargs)  ## using pydantic for validation here

        return User(
            username=user_data.username,
            email=user_data.email,
            external_id=user_data.id_token,
            first_name=user_data.given_name,
            last_name=user_data.family_name,
            external_type=user_data.external_type,
            subscription_start_date=dt.datetime.now(),
            role=user_data.role,
            hear_about_us=user_data.how_did_your_hear_about_us,
            want_to_do=user_data.what_do_you_want_to_do,
            remaining_credit=STARTING_CREDIT,  # type: ignore
        )

    @staticmethod
    def redirect_to_registration_page(
        token: str,
        firstName: str,  # noqa: N803
        lastName: str,  # noqa: N803
        email: str,
        settings: Settings,
        externalType: str,  # noqa: N803
        picture: Optional[str] = None,
        originalPage: Optional[str] = None,  # noqa: N803
    ) -> str:
        user_data = {
            "token": token,
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "picture": picture,
            "externalType": externalType,
        }
        query_string = urlencode(user_data)
        return f"{settings.app.front_end_url}/register?{query_string}&originalPage={originalPage}"

    # username: str,
    #     id_token: str,
    #     role: str,
    #     external_type="google",
    #     timezone_data: Optional[str] = None,
    #     given_name: Optional[str] = None,
    #     family_name: Optional[str] = None,
    #     how_did_your_hear_about_us: Optional[str] = "",
    #     what_do_you_want_to_do: Optional[str] = "",
    #     subscription_plan: Optional[int] = 1,


# "server", "static",
