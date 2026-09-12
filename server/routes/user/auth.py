import datetime as dt
import hashlib
import logging
from typing import Optional
from urllib.parse import unquote

import httpx
from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    Request,
    Response,
)
from fastapi.responses import JSONResponse, RedirectResponse
from jose import jwt
from pydantic import BaseModel
from sqlalchemy.future import select

from config import (
    Settings,
)
from dependencies.db import AsyncSession, GetDb
from dependencies.posthog import GetPostHog
from dependencies.settings import get_settings
from dependencies.user_dependencies import CurrentUser, CurrentUserOrGuest
from models.decks.deck.deck_manager import DeckManager
from models.exceptions.user_exceptions import UserExceptions
from models.models_ import (
    User,
    UserSettings,
)
from models.quiz.quiz_manager import QuizManager
from models.schools.promo_codes_repository import PromoCodesRepository
from models.send_email import Emailer
from models.user.auth_manager import AuthManager
from models.user.user_manager import UserManager
from routes.data_classes.user_schema import (
    CheckUserNameResponse,
    GoogleSignInRequest,
    LogoutResponse,
    SignInResponse,
    SignUpRequest,
    SignupResponse,
    UserDataResponse,
    UserSchema,
)

logger = logging.getLogger("App")

auth_router = APIRouter()


@auth_router.get("/microsoft_auth")
async def get_microsoft_auth_callback(  # noqa: ANN201
    code: str,
    state: str,
    posthog: GetPostHog,
    response: Response,
    db: GetDb,
    settings: Settings = Depends(get_settings),
):
    original_page = unquote(state)

    token_endpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/token"  # noqa: S105
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "client_id": settings.auth.microsoft_client_id,
        "client_secret": settings.auth.microsoft_client_secret,
        "redirect_uri": f"{settings.app.app_url}{settings.auth.microsoft_redirect_uri}",
        "code": code,
        "grant_type": "authorization_code",
        "scope": "User.Read openid",
    }
    logger.info("microsoft sign in data: %s", data)
    async with httpx.AsyncClient() as client:
        resp = await client.post(token_endpoint, data=data, headers=headers)
    if resp.status_code != 200:  # noqa: PLR2004
        raise HTTPException(status_code=400, detail="Failed to get access token")

    token_data = resp.json()
    access_token = token_data["access_token"]
    # Use the access token to get the user's information
    user_info_endpoint = settings.auth.microsoft_user_info_endpoint
    headers = {"Authorization": f"Bearer {access_token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(user_info_endpoint, headers=headers)
    if resp.status_code != 200:  # noqa: PLR2004
        raise HTTPException(status_code=400, detail="Failed to get user info")
    user_info = resp.json()
    user = await UserManager.get_user_by_external_id(db, user_info["id"], "microsoft")
    if not user:
        redirect_str = AuthManager.redirect_to_registration_page(
            token=user_info["id"],
            firstName=user_info["givenName"],
            lastName=user_info["surname"],
            email=user_info["mail"],
            externalType="microsoft",
            picture=None,
            originalPage=original_page,
            settings=settings,
        )
        return RedirectResponse(url=redirect_str)
    posthog.capture(distinct_id=user.id, event="login", properties={"type": "microsoft"})
    await UserManager.update_quantity_decks_files_quizzes_groups_with_commit(db, user)
    await db.commit()
    access_token = AuthManager.create_access_token(data={"sub": str(user.id)}, settings=settings)
    redirect_str = f"{settings.app.front_end_url}{original_page}"
    response = RedirectResponse(url=redirect_str)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=settings.auth.http_only,
        max_age=settings.auth.max_age,
        samesite=settings.auth.same_site,
        secure=True,
        domain=settings.auth.domain,
        path="/",
    )
    return response


# Example endpoint to handle the redirect URI
@auth_router.get("/discord_callback")
async def discord_callback(  # noqa: ANN201
    posthog: GetPostHog,
    code: str,
    state: str,
    response: Response,
    db: GetDb,
    settings: Settings = Depends(get_settings),
):
    original_page = unquote(state)
    if not code:
        raise HTTPException(status_code=400, detail="Code query parameter is missing")
    token_info = AuthManager.get_discord_token(code, settings=settings)
    try:
        discord_response = AuthManager.get_discord_user_info(
            token_info["access_token"],  # type: ignore
        )
    except Exception as e:
        logger.exception("Error getting discord user info")
        raise HTTPException(status_code=400, detail="Invalid tokenss") from e
    user = await UserManager.get_user_by_external_id(db, discord_response["id"], "discord")
    picture = f"https://cdn.discordapp.com/avatars/{discord_response['id']}/{discord_response['avatar']}.png"
    if not user:
        redirect_str = AuthManager.redirect_to_registration_page(
            token=discord_response["id"],
            firstName=discord_response["username"],
            lastName="",
            email=discord_response["email"],
            externalType="discord",
            picture=picture,
            originalPage=original_page,
            settings=settings,
        )
        return RedirectResponse(url=redirect_str)
    posthog.capture(distinct_id=user.id, event="login", properties={"type": "google"})
    await UserManager.update_quantity_decks_files_quizzes_groups_with_commit(db, user)
    await db.commit()
    access_token = AuthManager.create_access_token(data={"sub": str(user.id)}, settings=settings)
    redirect_str = f"{settings.app.front_end_url}{original_page}"
    response = RedirectResponse(url=redirect_str)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=settings.auth.http_only,
        max_age=settings.auth.max_age,
        samesite=settings.auth.same_site,
        secure=True,
        domain=settings.auth.domain,
        path="/",
    )
    return response


class GuestRequest(BaseModel):
    username: Optional[str] = None


class GuestResponse(BaseModel):
    status: str
    message: str
    user: UserSchema


@auth_router.post("/auth/create-guest", response_model=GuestResponse, tags=["user"])
async def create_guest_account(  # noqa: ANN201
    db: GetDb,
    posthog: GetPostHog,
    request: Optional[GuestRequest] = Body(default=None),
    settings: Settings = Depends(get_settings),
):
    try:
        user = await UserManager.create_guest_account(
            db,
        )
        posthog.capture(distinct_id=user.id, event="new_guest")

        if request and request.username:
            user.username = request.username
            await db.commit()
        access_token = AuthManager.create_access_token(
            data={"sub": str(user.id)},
            settings=settings,
        )
        response = JSONResponse(
            content={
                "status": "success",
                "message": "Guest account created successfully",
                "user": user.to_dict(),
            },
            status_code=200,
            # headers=response.headers,
        )
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=settings.auth.http_only,
            samesite=settings.auth.same_site,
            secure=True,
            domain=settings.auth.domain,
            path="/",
        )

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error") from e


## TODO figure out how to use the redirect response google auth too
@auth_router.post("/auth/google-sign-in", response_model=SignInResponse, tags=["user"])
async def google_sign_in(  # noqa: ANN201
    request: GoogleSignInRequest,
    response: Response,
    db: GetDb,
    posthog: GetPostHog,
    # r_client: GetRedisClient,
    settings: Settings = Depends(get_settings),
):
    original_page = unquote(request.state)
    user_info = await AuthManager.verify_google_signin(request.credential, settings)
    if not user_info:
        raise HTTPException(status_code=400, detail="Invalid Google token")
    user = await UserManager.get_user_by_external_id(db, user_info["sub"], "google")
    ##! TODO find out why family_name is thowing a key error
    if not user:
        user_data = {
            "token": user_info["sub"],
            "firstName": user_info.get("given_name", ""),
            "lastName": user_info.get("family_name", ""),
            "email": user_info["email"],
            "picture": user_info.get("picture", ""),
            "externalType": "google",
        }
        return {
            "status": "failure",
            "message": "User not registered",
            "userInfo": user_data,
            "originalPage": original_page,
        }
    posthog.capture(distinct_id=user.id, event="login", properties={"type": "google"})
    await UserManager.update_quantity_decks_files_quizzes_groups_with_commit(db, user)
    access_token = AuthManager.create_access_token(
        data={"sub": str(user.id)},
        settings=settings,
    )
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=settings.auth.http_only,
        max_age=settings.auth.max_age,
        samesite=settings.auth.same_site,
        secure=True,
        domain=settings.auth.domain,
        path="/",
    )
    return {
        "status": "success",
        "message": "Successful Google sign-in",
        "userInfo": {},
        "originalPage": original_page,
    }


@auth_router.get("/auth/refresh-token/", tags=["user"])
async def refresh_token(  # noqa: ANN201
    user: CurrentUser,
    response: Response,
    request: Request,
    settings: Settings = Depends(get_settings),
):
    token = request.cookies.get("access_token")
    if user is None:
        raise HTTPException(status_code=403, detail="Unable to refresh token")
    if token is None:
        raise HTTPException(status_code=403, detail="Unable to refresh token")
    token = token.split(" ")[1] if token.startswith("Bearer ") else token
    payload = jwt.decode(token, settings.auth.secret_key, algorithms=[settings.auth.algorithm])
    expiration = payload.get("exp")  # type: ignore
    if expiration is None:
        return None
    current_time = int(dt.datetime.now().timestamp())
    if current_time + settings.auth.expiration_check < expiration:
        return None
    access_token = AuthManager.create_access_token(data={"sub": str(user.id)}, settings=settings)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=settings.auth.http_only,
        max_age=settings.auth.max_age,
        samesite=settings.auth.same_site,
        secure=True,
        domain=settings.auth.domain,
        path="/",
    )
    return {"status": "success", "loggedIn": True}


@auth_router.get("/auth/status/", response_model=UserDataResponse, tags=["user"])
async def check_user_status(user: CurrentUser, db: GetDb):  # noqa: ANN201
    if not user:
        return {"status": "failure", "loggedIn": False, "message": "Not logged in"}
    subscriber = await UserManager.check_subscriber_exists(db, user.email)
    user_dict = user.to_dict()
    if subscriber:
        user_dict["subscriber"] = True
    else:
        user_dict["subscriber"] = False
    return {
        "status": "success",
        "loggedIn": True,
        "user": user_dict,
        "message": "Logged in",
    }


##TODO need to modify this route to also clear the redis cache
@auth_router.delete("/auth/logout", response_model=LogoutResponse, tags=["user"])
async def logout(response: Response, settings: Settings = Depends(get_settings)):  # noqa: ANN201
    response.delete_cookie(
        key="access_token",
        domain=settings.auth.domain,
        path="/",
        secure=True,
        samesite=settings.auth.same_site,
    )
    return {"status": "success", "loggedIn": False}


@auth_router.get("/user", response_model=UserDataResponse, tags=["user"])
async def get_user(user: CurrentUser, db: GetDb):  # noqa: ANN201
    if user:
        user_dict = user.to_dict()
        user_data = UserSchema.model_validate(user_dict)
        subscriber = await UserManager.check_subscriber_exists(db, user.email)

        user_dict = user.to_dict()
        if subscriber:
            user_dict["subscriber"] = True
        else:
            user_dict["subscriber"] = False
        return {
            "status": "success",
            "message": "User found",
            "user": user_data,
            "loggedIn": True,  # You must include this field in the response
        }
    raise HTTPException(status_code=404, detail="User not found")


@auth_router.get(
    "/check-username/{username}",
    response_model=CheckUserNameResponse,
    tags=["account"],
)
async def check_username(username: str, db: GetDb):  # noqa: ANN201
    result = await db.execute(select(User).filter_by(username=username))
    user = result.scalars().first()
    etag_value = f"username-{username}"
    etag_hash = hashlib.sha256(etag_value.encode()).hexdigest()
    headers = {
        "Cache-Control": "public, max-age=300",
        "ETag": etag_hash,
    }
    if user is not None:
        response = {"usernameTaken": True}
    else:
        response = {"usernameTaken": False}

    return JSONResponse(content=response, headers=headers)


##TODO: add a promoCode check with debounce on the front and back
@auth_router.post("/sign-up", response_model=SignupResponse, tags=["account"])
async def sign_up(  # noqa: ANN201
    request: SignUpRequest,
    response: Response,
    db: GetDb,
    posthog: GetPostHog,
    user: CurrentUserOrGuest,
    settings: Settings = Depends(get_settings),
):
    try:
        user_data = AuthManager.extract_sign_up_user_data(request)
        if user == "guest":
            user = AuthManager.create_new_user(user_data)
            db.add(user)
        else:
            user = AuthManager.turn_guest_into_regular_user(user, **user_data)
            await db.merge(user)
        await db.flush()
        user_settings = UserSettings(user=user.id)
        db.add(user_settings)
        if request.newsletter is True:
            await AuthManager.add_subscriber_to_newsletter(
                db,
                user_data["email"],
                user_data["given_name"],
                user_data["family_name"],
            )
        if request.promoCode is not None and request.promoCode != "":
            await PromoCodesRepository.handle_promo_code(db, user, request.promoCode)

        Emailer.send_email(settings.email, user_data["email"], user_data["given_name"], "welcome")
        await db.flush()
        user_dict = user.to_dict()
        access_token = AuthManager.create_access_token(
            data={"sub": str(user.id)},
            settings=settings,
        )
        try:
            await add_sample_deck(user, db)
            await add_sample_quiz(user, db)
            user.quantity_decks = 1
            user.quantity_quizzes = 1
            user.quantity_cards = 26
        except Exception:
            logger.exception("Error adding sample deck and quiz ")
        subscription_plan = await UserManager.retrieve_sub_plan(db, user)
        new_record = await UserManager.initialize_new_usage_record(db, user, subscription_plan)
        user.remaining_credit = round(new_record.remaining_count / settings.token.tokens_per_page)

        await db.commit()
        posthog.capture(
            user.id,
            "register",
            {
                "type": user.external_type,
                "hear_about_us": user.hear_about_us,
                "role": user.role,
            },
        )
        subscriber = await UserManager.check_subscriber_exists(db, user.email)
        if subscriber:
            user_dict["subscriber"] = True
        else:
            user_dict["subscriber"] = False
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=settings.auth.http_only,
            max_age=settings.auth.max_age,
            samesite=settings.auth.same_site,
            domain=settings.auth.domain,
            path="/",
        )
        return {
            "status": "success",
            "message": "Registration successful!",
            "user": user_dict,
            "settings": user_settings,
        }
    except UserExceptions.InvalidPromoCodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid promo code.  Please enter a correct one or leave it blank.",
        ) from None
    except Exception as e:
        await db.rollback()
        logger.exception("Error during sign up ")
        raise HTTPException(status_code=400, detail="Error during sign up") from e


## copy deck 1159
async def add_sample_deck(user: User, db: AsyncSession):  # noqa: ANN201
    ## check if sample deck and cards is cached
    ## get sample deck
    kwargs = {"copied": True, "copy_source": 1159}

    deck = await DeckManager.retrieve_deck_and_load_cards(db, 1159)
    new_deck = await DeckManager.copy_deck(db, deck, **kwargs)
    await db.flush()
    new_deck = await DeckManager.retrieve_deck_and_load_cards(db, new_deck.id)
    if new_deck is None:
        logger.error(
            "Error during sign up.  In add_sample_deck retrieve_deck_and_load_cards returned None",
        )
    else:
        new_deck.user_id = user.id
        new_cards = await DeckManager.copy_deck_cards(deck, new_deck)
        db.add_all(new_cards)
    ## copy sample deck and cards
    ## cache sample deck


async def add_sample_quiz(user: User, db: AsyncSession):  # noqa: ANN201
    quiz = await QuizManager.retrieve_quiz_and_load_questions(db, 156)
    new_quiz = await QuizManager.copy_quiz(db, quiz, user)
    await db.flush()
    new_quiz = await QuizManager.retrieve_quiz_and_load_questions(db, new_quiz.id)
    new_quiz = await QuizManager.copy_quiz_questions(db, quiz, new_quiz)

    ## check if sample quiz and cards is cached
    ## get sample quiz
    ## copy sample quiz and questions
    ## cache sample quiz
