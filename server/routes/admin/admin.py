import hashlib
import json
import logging
from datetime import datetime as dt
from typing import Annotated, Optional

from fastapi import APIRouter, Form, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from sqlalchemy import select

from dependencies.db import GetDb
from dependencies.user_dependencies import AdminUser, CurrentUser
from models.llm_records import LlmRecords
from models.models_ import InfoBanner
from models.schools.promo_codes_repository import PromoCodesRepository
from models.schools.school_role_repository import SchoolRoleRepository
from models.schools.schools_repository import SchoolsRepository
from routes.data_classes.user_schema import UserBaseSchema

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

logger = logging.getLogger("App")
config = ConfigDict(populate_by_name=True, alias_generator=to_camel, from_attributes=True)


class LlmRecordsSchema(BaseModel):
    id: int
    prompt: str
    sys_instruct: str
    response: str
    model: str
    response_format: str
    type: str
    subtype: str
    temperature: Optional[float] = None
    version: Optional[float] = 0.1


class InfoBannerSchema(BaseModel):
    model_config = config

    id: int
    user_id: int
    message: str
    message_type: str
    time_created: str
    time_updated: str
    end_date: str
    active: bool


class BannerResponse(BaseModel):
    status: str
    message: str
    banner: InfoBannerSchema | None


class BannerResponseAll(BaseModel):
    status: str
    message: str
    banner: list[InfoBannerSchema]


class LlmDataResponse(BaseModel):
    status: str
    message: str
    records: list[LlmRecordsSchema]


class SchoolSchema(BaseModel):
    model_config = config
    id: int
    name: str
    main_contact: str
    email: str
    phone: str
    address: str
    city: str
    country: str
    postal_code: str
    website: str
    stripe_id: str | None = None
    deleted: bool


class SchoolsResponse(BaseModel):
    model_config = config
    status: str
    message: str
    schools: list[SchoolSchema]


class SchoolUser(UserBaseSchema):
    school_id: str
    school_role: str


class SchoolUsersResponse(BaseModel):
    model_config = config
    status: str
    message: str
    users: list[SchoolUser]


class PromoCodeSchema(BaseModel):
    model_config = config
    id: int
    code: str
    type: str
    promo_type: str | None = None
    school_id: int | None = None
    expiration_date: str | None = None
    expired: bool
    school_role: str | None = None  # student, teacher, admin
    times_used: int
    max_uses: int | None = None
    credits: int | None = None


class PromoCodesResponse(BaseModel):
    model_config = config
    status: str
    message: str
    codes: list[PromoCodeSchema]


@router.get("/schools", response_model=SchoolsResponse, tags=["admin"])
async def retrieve_all_schools(
    db: GetDb,
    _: AdminUser,
) -> dict:
    schools = await SchoolsRepository.retrieve_all_schools(db)
    list_schools = [school.to_dict() for school in schools]
    return {
        "status": "success",
        "message": "Schools retrieved",
        "schools": list_schools,
    }


@router.get("/schools/promo_codes/{school_id}", response_model=PromoCodesResponse, tags=["admin"])
async def retrieve_school_promo_codes(
    db: GetDb,
    _: AdminUser,
    school_id: int,
) -> dict:
    ## retrieve admin, teacher, student codes
    codes = await PromoCodesRepository.get_and_create_promo_codes_for_school(db, school_id)
    list_codes = [code.to_dict() for code in codes]
    logger.error(codes)
    return {
        "status": "success",
        "message": "Promo codes retrieved",
        "codes": list_codes,
    }


@router.post("/schools", response_model=SchoolsResponse, tags=["admin"])
async def create_school(
    db: GetDb,
    _: AdminUser,
    data: Annotated[str, Form()],
) -> dict:
    data_dict = json.loads(data)
    new_school = await SchoolsRepository.create_new_school(
        db,
        data_dict["name"],
        data_dict["mainContact"],
        data_dict["email"],
        data_dict["phone"],
        data_dict["address"],
        data_dict["city"],
        data_dict["country"],
        data_dict["postalCode"],
        data_dict["website"],
        data_dict["stripeId"],
    )
    return {
        "status": "success",
        "message": "School created",
        "schools": [new_school.to_dict()],
    }


@router.post("/promo-codes", response_model=PromoCodesResponse, tags=["admin"])
async def create_promo_code(
    db: GetDb,
    _: AdminUser,
    data: Annotated[str, Form()],
) -> dict:
    data_dict = json.loads(data)
    datetime_date = dt.strptime(data_dict["expirationDate"], "%Y-%m-%d")
    new_code = await PromoCodesRepository.make_new_promo_code(
        db,
        data_dict["type"],
        None,
        None,
        int(data_dict["maxUses"]),
        int(data_dict["credits"]),
        datetime_date,
        data_dict["promoType"],
    )
    return {
        "status": "success",
        "message": "Promo code created",
        "codes": [new_code.to_dict()],
    }


@router.delete("promo-codes/{code_id}", response_model=PromoCodesResponse, tags=["admin"])
async def expire_promo_code(
    db: GetDb,
    _: AdminUser,
    code_id: str,
) -> dict:
    promo_code = await PromoCodesRepository.expire_promo_code(db, code_id)
    return {
        "status": "success",
        "message": "Promo code expired",
        "codes": [promo_code.to_dict()],
    }


# TODO: Move this to either user or account
@router.patch("promo-codes/redeem/{code_id}", response_model=PromoCodesResponse, tags=["admin"])
async def redeem_promo_code(
    db: GetDb,
    user: CurrentUser,
    code_id: str,
) -> dict:
    try:
        await PromoCodesRepository.handle_promo_code(db, user, code_id)
        return {
            "status": "success",
            "message": "Promo code redeemed",
            "codes": [],
        }
    except Exception as e:
        logger.exception("Error redeeming promo code")
        return {
            "status": "error",
            "message": str(e),
            "codes": [],
        }


@router.patch("/schools/{school_id}", response_model=SchoolsResponse, tags=["admin"])
async def update_school(
    school_id: int,
    db: GetDb,
    _: AdminUser,
    data: Annotated[str, Form()],
) -> dict:
    data_dict = json.loads(data)
    updates = {
        k: v
        for k, v in data_dict.items()
        if k
        in [
            "name",
            "mainContact",
            "email",
            "phone",
            "address",
            "city",
            "country",
            "postalCode",
            "website",
            "stripeId",
        ]
    }
    updated_school = await SchoolsRepository.update_school_info(db, school_id, updates)
    return {
        "status": "success",
        "message": "School updated",
        "schools": [updated_school.to_dict()],
    }


@router.delete("/schools/{school_id}", response_model=SchoolsResponse, tags=["admin"])
async def delete_school(
    db: GetDb,
    _: AdminUser,
    school_id: int,
) -> dict:
    school = await SchoolsRepository.get_school_by_id(db, school_id)
    school.deleted = True
    await db.commit()
    return {
        "status": "success",
        "message": "School deleted",
        "schools": [school.to_dict()],
    }


@router.get("/schools/users/{school_id}", response_model=SchoolUsersResponse, tags=["admin"])
async def retrieve_school_users(
    db: GetDb,
    _: AdminUser,
    school_id: int,
) -> dict:
    raw_users = await SchoolRoleRepository.get_joined_role_and_user_by_school(db, school_id)
    processed_users = []
    for s_user, role in raw_users:
        user_dict = s_user.to_dict()
        role_dict = role.to_dict()
        user_dict["school_role"] = role_dict["role"]
        user_dict["school_id"] = role_dict["schoolId"]
        processed_users.append(user_dict)
    return {
        "status": "success",
        "message": "Users retrieved",
        "users": processed_users,
    }


@router.get("/promo-codes", response_model=PromoCodesResponse, tags=["admin"])
async def retrieve_all_non_school_promo_codes(db: GetDb, _: AdminUser) -> dict:
    codes = await PromoCodesRepository.retrieve_all_non_school_codes(db)
    list_codes = [code.to_dict() for code in codes]
    return {
        "status": "success",
        "message": "Promo codes retrieved",
        "codes": list_codes,
    }


@router.get("/info_banner", response_model=BannerResponse, tags=["admin"])
async def retrieve_active_banner(
    db: GetDb,
) -> JSONResponse:
    query = await db.execute(select(InfoBanner).where(InfoBanner.active == True))  # noqa: E712
    banners = query.scalars().all()
    if not banners:
        response = {
            "status": "success",
            "message": "No active banners",
            "banner": None,
        }
    else:
        response = {
            "status": "success",
            "message": "Active banners retrieved",
            "banner": banners[0].to_dict(),
        }
    etag_value = "info-banner"
    etag_hash = hashlib.sha256(etag_value.encode()).hexdigest()
    headers = {
        "Cache-Control": "public, max-age=3600",
        "ETag": etag_hash,
    }
    return JSONResponse(content=response, headers=headers)


@router.post("/info_banner", response_model=BannerResponse, tags=["admin"])
async def create_banner(db: GetDb, user: AdminUser, data: Annotated[str, Form()]):  # noqa: ANN201
    data_dict = json.loads(data)

    banner = InfoBanner(
        user_id=user.id,
        message=data_dict["message"],
        message_type=data_dict["messageType"],
        active=data_dict["active"],
    )
    db.add(banner)
    await db.commit()

    return {
        "status": "success",
        "message": "Banner created",
        "banner": banner.to_dict(),
    }


@router.put("/info_banner/{banner_id}", response_model=BannerResponse, tags=["admin"])
async def update_banner(  # noqa: ANN201
    banner_id: int,
    db: GetDb,
    _: AdminUser,
    data: Annotated[str, Form()],
):
    data_dict = json.loads(data)
    query = await db.execute(select(InfoBanner).where(InfoBanner.id == banner_id))
    banner = query.scalars().first()
    if banner is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Banner not found")
    banner.message = data_dict["message"]
    banner.message_type = data_dict["messageType"]
    banner.active = data_dict["active"]
    await db.commit()

    return {
        "status": "success",
        "message": "Banner updated",
        "banner": banner.to_dict(),
    }


@router.get("/info_banner/all", response_model=BannerResponseAll, tags=["admin"])
async def retreive_all_banners(  # noqa: ANN201
    db: GetDb,
    _: AdminUser,
):
    query = await db.execute(select(InfoBanner))
    banners = query.scalars().all()
    if not banners:
        response = {
            "status": "success",
            "message": "No banners",
            "banner": None,
        }
    else:
        banner_list = [banner.to_dict() for banner in banners]

        response = {
            "status": "success",
            "message": "Banners retrieved",
            "banner": banner_list,
        }
    return response


@router.get("/data", response_model=LlmDataResponse, tags=["llm_data"])
async def get_llm_data(  # noqa: ANN201
    db: GetDb,
    _: AdminUser,
):
    query = await db.execute(
        select(LlmRecords)
        .order_by(LlmRecords.time_created.desc())
        .where(LlmRecords.rating == None),  # noqa: E711
    )
    records = query.scalars().all()
    record_list = [record.to_dict() for record in records]

    return {
        "status": "success",
        "message": "llm data retrieved",
        "records": record_list,
    }


@router.post("/data/{record_id}/upvote", response_model=LlmDataResponse, tags=["llm_data"])
async def upvote_record(  # noqa: ANN201
    record_id: int,
    db: GetDb,
    _: AdminUser,
):
    query = await db.execute(select(LlmRecords).where(LlmRecords.id == record_id))
    record = query.scalars().first()
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    record.rating = 1
    await db.commit()
    record = record.to_dict()
    return {"status": "success", "message": "Record upvoted", "records": [record]}


@router.post("/data/{record_id}/downvote", response_model=LlmDataResponse, tags=["llm_data"])
async def downvote_record(  # noqa: ANN201
    record_id: int,
    db: GetDb,
    _: AdminUser,
):
    query = await db.execute(select(LlmRecords).where(LlmRecords.id == record_id))
    record = query.scalars().first()
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    record.rating = 0
    await db.commit()
    record = record.to_dict()
    return {"status": "success", "message": "Record downvoted", "records": [record]}
