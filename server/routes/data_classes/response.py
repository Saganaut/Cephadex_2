from typing import Optional

from pydantic import BaseModel


class StandardApiResponse(BaseModel):
    status: str
    message: str
    data: Optional[dict] = None


class LinkAndQrCodeResponse(BaseModel):
    status: str
    shareLink: str
    qrCode: str
    message: str


class ToggleResponseModel(BaseModel):
    status: str
    message: str
    favorite: bool
