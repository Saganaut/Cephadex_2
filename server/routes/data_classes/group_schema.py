from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr
from pydantic.alias_generators import to_camel

from .deck_schema import DeckSchema

config = ConfigDict(
    populate_by_name=True, alias_generator=to_camel, from_attributes=True
)


class GroupSchema(BaseModel):
    model_config = config

    id: int
    name: str
    description: str | None
    group_type: str | None
    time_created: str
    time_updated: str | None
    creator_id: int | None
    img: str | None
    is_private: bool = True
    type: str = "Group"
    fav: bool = False


class GroupSchemaWithPermissions(GroupSchema):
    permissions: Optional[str] = "read"
    role: Optional[str] = "member"


class GroupInviteSchema(BaseModel):
    model_config = config

    id: int
    group_name: str
    group_id: int | None
    user_id: Optional[int] = None
    invited_by_id: Optional[int] = None
    invited_by_email: Optional[str] = None
    time_created: Optional[str] = None
    time_updated: Optional[str] = None
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None  ## what is this used for?
    invited_by_username: str | None


class InvitedUsersDataResponse(BaseModel):
    status: str
    message: str
    groupInvites: list[GroupInviteSchema] | None


class GroupMemberBaseSchema(BaseModel):
    model_config = config

    id: int
    username: Optional[str] = None
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    account_type: Optional[str] = None
    account_status: Optional[str] = None
    # gender: Optional[str] = None
    pic: Optional[str] = None
    contacted_email: Optional[bool] = False
    # dob: Optional[str] = None
    # timezone: Optional[str] = None
    subscription_plan: Optional[int] = 1
    guest: Optional[bool] = False
    active: Optional[bool] = True


class GroupMemberSchema(GroupMemberBaseSchema):
    model_config = config

    group_role: Optional[str] = "member"
    permissions: Optional[str] = "read"


class GroupFullSchema(BaseModel):
    model_config = config

    group: GroupSchemaWithPermissions
    invites: Optional[list[GroupInviteSchema]] = None
    members: Optional[list[GroupMemberSchema]] = None
    decks: Optional[list[DeckSchema]] = None
    invited_emails: Optional[list[str]] = None


class CreateGroupDataRequest(BaseModel):
    model_config = config

    name: str
    description: str | None
    group_type: str | None
    private: bool = True


class GroupDataResponse(BaseModel):
    status: str
    message: str
    groups: list[GroupSchema] | None


class GroupFullDataResponse(BaseModel):
    status: str
    message: str
    group: list[GroupFullSchema] | None


class PermissionChange(BaseModel):
    id: int
    permissions: str
    role: str


class PermissionChangeRequest(BaseModel):
    permissionsToChange: list[PermissionChange]


class AddDeckToGroupRequest(BaseModel):
    decks: list[int]


class AllInvitationsForUserResponse(BaseModel):
    model_config = config

    status: str
    message: str
    group_invites: Optional[list[GroupInviteSchema]] = None


class inviteeSchema(BaseModel):
    model_config = config

    id: int
    email: EmailStr
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class emailInvites(BaseModel):
    email: EmailStr


class InviteRequest(BaseModel):
    """
    emails: str
    """

    invitees: Optional[list[inviteeSchema]] = []
    emails: Optional[list[emailInvites]] = []


class GroupInviteResponse(BaseModel):
    model_config = config

    status: str
    message: str
    invited_users: Optional[list[GroupInviteSchema]] = None


class DeleteInvitationsRequest(BaseModel):
    model_config = config

    invites_to_delete: list[GroupInviteSchema]
