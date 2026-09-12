from pydantic import BaseModel, EmailStr


class EmailListRequest(BaseModel):
    emails: list[EmailStr]


class IdListRequest(BaseModel):
    ids: list[int]
