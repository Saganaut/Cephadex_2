import datetime as dt
from urllib.parse import unquote
from flask import Blueprint, render_template, flash, redirect, request, url_for, jsonify
from sqlalchemy.sql import and_
from bleach import clean
from models.creators.formatters import check_comma_list
from models.models_ import Card, Deck, GroupInvite, Group, User, user_group_association
from run.extensions import db
from models.helpers.log_decorators import log_decorator
from flask_login import login_user, logout_user, current_user
from sqlalchemy.orm import contains_eager

group_bp = Blueprint(
    "group_bp", __name__, template_folder="templates/group_bp", static_folder="static"
)


############################## GROUP ###########################################
## CREATE GROUP
## DELETE GROUP


## GET ALL USERS GROUPS
## APPROVE GROUP
## REJECT GROUP


## GET ALL INVITES FOR USER
## GET ALL INVITED USERS


## INVITE TO GROUP
## REMOVE USER
## UPDATE MEMBER PERMISSIONS

## REMOVE DECK FROM GROUP
## ADD DECK TO GROUP

## GET DECKS FOR GROUP

## SEARCH PUBLIC DECKS
## IMPORT FROM GROUP


@group_bp.route("/api_0/group", methods=["POST"])
def create_group():
    data = request.get_json(silent=True)
    name = data.get("name")
    description = data.get("description")
    group_type = data.get("group_type")
    private = data.get("private")
    user_id = current_user.id
    new_group = Group(
        name=name,
        description=description,
        group_type=group_type,
        is_private=private,
        creator_id=user_id,
    )
    db.session.add(new_group)
    new_group.users.append(current_user)
    db.session.commit()
    update_member_permissions(new_group.id, user_id, "write")
    db.session.commit()
    return (
        jsonify(
            {
                "status": "success",
                "message": "Group created successfully",
                "group": new_group.to_dict(),
            }
        ),
        201,
    )


@group_bp.route("/api_0/group/<int:group_id>/", methods=["DELETE"])
@log_decorator
def delete_group(group_id):
    check_group_permission(group_id, "write")
    group = Group.query.get(group_id)
    GroupInvite.query.filter_by(group_id=group_id).delete()
    db.session.delete(group)
    db.session.commit()
    return jsonify({"message": "Group deleted successfully", "status": "success"}), 200


## GET ALL USERS GROUPS
@group_bp.route("/api_0/groups/", methods=["GET"])
@log_decorator
def get_all_groups():
    groups = get_groups_for_user(current_user.id)
    return jsonify(
        {
            "status": "success",
            "message": "Groups retrieved successfully",
            "groups": groups,
        }
    )


## APPROVE GROUP
@group_bp.route("/api_0/group/<int:group_id>/invitation", methods=["POST"])
@log_decorator
def group_approve_group(group_id):
    group_invite = GroupInvite.query.filter_by(
        id=group_id, user_id=current_user.id
    ).first()
    if group_invite:
        group = Group.query.get_or_404(group_invite.group_id)
        db.session.execute(
            user_group_association.insert().values(
                user_id=current_user.id,
                group_id=group.id,
                role="member",
                permissions="read",
            )
        )
        db.session.delete(group_invite)
        db.session.commit()
        return (
            jsonify(
                {
                    "status": "success",
                    "message": "User added to group successfully",
                    "group": group.to_dict(),
                }
            ),
            200,
        )


## REJECT GROUP
@group_bp.route("/api_0/group/<int:group_id>/invitation", methods=["DELETE"])
@log_decorator
def reject_group(group_id):
    group_invite = GroupInvite.query.filter_by(
        id=group_id, user_id=current_user.id
    ).first()
    if group_invite:
        db.session.delete(group_invite)
        db.session.commit()
        return (
            jsonify(
                {"status": "success", "message": "Invitation rejected successfully"}
            ),
            200,
        )
    else:
        return jsonify({"error": "User not invited to group"}), 400


## GET ALL INVITES FOR USER
@group_bp.route("/api_0/group/invations", methods=["GET"])
def get_group_invitations():
    query = GroupInvite.query.filter_by(user_id=current_user.id).all()
    invitations = [invite.to_dict() for invite in query]
    return jsonify(
        {
            "status": "success",
            "message": "Invitations retrieved successfully",
            "invitations": invitations,
        }
    )


## GET ALL INVITED USERS
@group_bp.route("/api_0/group/<int:group_id>/invitations/all", methods=["GET"])
def get_group_invited(group_id):
    # Perform a join operation to retrieve related data from the User table.
    invited_users = (
        db.session.query(User.username, User.first_name, User.last_name, GroupInvite)
        .join(User, GroupInvite.user_id == User.id)
        .filter(GroupInvite.group_id == group_id)
        .all()
    )
    invited = []
    for user_info in invited_users:
        username, first_name, last_name, invite = user_info
        invite_data = invite.to_dict()
        invite_data.update(
            {"username": username, "first_name": first_name, "last_name": last_name}
        )
        invited.append(invite_data)

    return jsonify(
        {
            "status": "success",
            "message": "Invited users retrieved successfully",
            "invited": invited,
        }
    )


## INVITE TO GROUP
@group_bp.route("/api_0/group/<int:groupId>/invite/", methods=["POST"])
@log_decorator
def invite_to_group(groupId):
    data = request.get_json(silent=True)
    emails = data.get("user_emails")
    group = Group.query.get(groupId)
    if group is None:
        return jsonify({"error": "Group not found"}), 404
    if isinstance(emails, str):
        emails_list = [email.strip() for email in emails.split(",") if email.strip()]
    else:
        return jsonify({"error": "Invalid input format"}), 400
    not_registered_users = []
    for email in emails_list:
        user = User.query.filter_by(email=email).first()
        if user is None:
            not_registered_users.append(email)
            continue
        already_invited = GroupInvite.query.filter_by(
            user_id=user.id, group_id=group_id
        ).first()
        if already_invited is not None or user in group.users:
            continue
        new_invite = GroupInvite(
            name=group.name,
            invited_by_email=current_user.email,
            invited_by_id=current_user.id,
            user_id=user.id,
            group_id=group_id,
            time_created=dt.datetime.now(dt.timezone.utc),
        )
        db.session.add(new_invite)
    if not_registered_users or db.session.new:
        db.session.commit()
    if not_registered_users:
        return (
            jsonify(
                {
                    "status": "fail",
                    "message": "The following users are not registered: "
                    + ", ".join(not_registered_users),
                }
            ),
            200,
        )

    return jsonify({"status": "success", "message": "Users invited successfully"}), 200


## UPDATE MEMBER PERMISSIONS
@group_bp.route("/api_0/group/<int:group_id>/member/permissions", methods=["PUT"])
@log_decorator
def update_member_permissions(group_id):
    check_group_permission(group_id, "write")
    data = request.get_json(silent=True)
    permissions_to_change = data["permissions_to_change"]
    for user in permissions_to_change:
        target_user_id = user["id"]
        new_permissions = user["permissions"]
        new_role = user["role"]
        db.session.query(user_group_association).filter(
            user_group_association.c.group_id == group_id,
            user_group_association.c.user_id == target_user_id,
        ).update(
            {
                user_group_association.c.permissions: new_permissions,
                user_group_association.c.role: new_role,
            }
        )
    db.session.commit()
    return jsonify(
        {"status": "success", "message": "Member permissions updated successfully"}
    )


## REMOVE USER
@group_bp.route("/api_0/group/<int:group_id>/member/<int:user_id>", methods=["DELETE"])
@log_decorator
def remove_user_group(group_id, user_id):
    check_group_permission(group_id, "write")
    association = (
        db.session.query(user_group_association)
        .filter(
            and_(
                user_group_association.c.user_id == user_id,
                user_group_association.c.group_id == group_id,
            )
        )
        .first()
    )
    if association:
        db.session.execute(
            user_group_association.delete().where(
                and_(
                    user_group_association.c.user_id == user_id,
                    user_group_association.c.group_id == group_id,
                )
            )
        )
        db.session.commit()
    return jsonify({"message": "User removed successfully", "status": "success"}), 200


############## DECK ############


## REMOVE DECK FROM GROUP
@group_bp.route("/api_0/group/<group_id>/deck/<deck_id>", methods=["DELETE"])
@log_decorator
def remove_deck_from_group(group_id, deck_id):
    check_group_permission(group_id, "write")
    group = Group.query.filter_by(id=group_id).first()
    deck = Deck.query.filter_by(id=deck_id).first()
    group.decks.remove(deck)
    db.session.commit()
    return (
        jsonify(
            {"status": "success", "message": "Deck removed from group successfully"}
        ),
        200,
    )


## GET DECKS FOR GROUP
@group_bp.route("/api_0/group/<int:group_id>/decks/", methods=["GET"])
@log_decorator
def get_decks_for_group(group_id):
    query = Deck.query.filter_by(group_id=group_id).all()
    decks = []
    for deck in query:
        decks.append(deck.to_dict_public())
    return jsonify({"status": "success", "decks": decks}), 200


## ADD DECK TO GROUP
@group_bp.route("/api_0/group/<int:group_id>/deck/", methods=["POST"])
@log_decorator
def add_deck_to_group(group_id):
    data = request.get_json(silent=True)
    check_group_permission(group_id, "write")
    deck_id = data["deck_id"]
    existing_deck = Deck.query.get(deck_id)
    new_deck = Deck(
        user_id=current_user.id,
        name=existing_deck.name,
        description=existing_deck.description,
        group_id=group_id,
        time_created=dt.datetime.now(dt.timezone.utc),
    )
    db.session.add(new_deck)
    for card in existing_deck.cards:
        new_card = Card(
            term=card.term,
            content=card.content,
            boc_2=card.boc_2,
            boc_3=card.boc_3,
            boc_4=card.boc_4,
            img=card.img,
            sound=card.sound,
            subject=card.subject,
            topic=card.topic,
            category=card.category,
            prompt_option=card.prompt_option,
            prompt_option2=card.prompt_option2,
            trans_option=card.trans_option,
            len_option=card.len_option,
            qmin_option=card.qmin_option,
            qmax_option=card.qmax_option,
            diff_lvl=card.diff_lvl,
        )
        new_deck.cards.append(new_card)
    db.session.commit()
    return (
        jsonify(
            {
                "status": "success",
                "message": "Deck added succesfully",
                "deck": new_deck.to_dict_public(),
            }
        ),
        200,
    )


## IMPORT FROM GROUP
@group_bp.route("/api_0/group/<int:group_id>/deck/<int:deck_id>/save", methods=["POST"])
@log_decorator
def save_deck_from_group(deck_id, group_id):
    check_group_permission(group_id, "read")
    existing_deck = Deck.query.get(deck_id)
    new_deck = Deck(
        user_id=current_user.id,
        name=existing_deck.name,
        description=existing_deck.description,
        group_id=group_id,
        time_created=dt.datetime.now(dt.timezone.utc),
    )
    for card in existing_deck.cards:
        new_card = Card(
            term=card.term,
            content=card.content,
            boc_2=card.boc_2,
            boc_3=card.boc_3,
            boc_4=card.boc_4,
            img=card.img,
            sound=card.sound,
            subject=card.subject,
            topic=card.topic,
            category=card.category,
            prompt_option=card.prompt_option,
            prompt_option2=card.prompt_option2,
            trans_option=card.trans_option,
            len_option=card.len_option,
            qmin_option=card.qmin_option,
            qmax_option=card.qmax_option,
            diff_lvl=card.diff_lvl,
        )
        new_deck.cards.append(new_card)
    db.session.add(new_deck)
    db.session.commit
    return (
        jsonify(
            {
                "message": "Deck imported successfully",
                "status": "success",
                "deck": new_deck.to_dict_public(),
            }
        ),
        200,
    )


def get_group_member_roles(group_id):
    results = (
        db.session.query(
            User.id, User.username, User.email, user_group_association.c.role
        )
        .join(user_group_association)
        .filter(user_group_association.c.group_id == group_id)
        .all()
    )
    group_member_roles = []
    for result in results:
        group_member_roles.append(
            {
                "id": result.id,
                "username": result.username,
                "first_name": result.first_name,
                "last_name": result.last_name,
                "email": result.email,
                "role": result.role,
                "permission": result.permissions,
            }
        )
    return group_member_roles


def get_all_groups_member_roles(user_id):
    c_user_id = user_id
    user_groups = (
        db.session.query(Group)
        .join(user_group_association)
        .filter(user_group_association.c.user_id == c_user_id)
        .all()
    )
    all_groups_member_roles = {}
    for group in user_groups:
        group_member_roles = get_group_member_roles(group.id)
        all_groups_member_roles[group.id] = group_member_roles
    return all_groups_member_roles


def get_group_member_permissions(group_id):
    c_group_id = group_id
    results = (
        db.session.query(
            User.id, User.username, User.email, user_group_association.c.permissions
        )
        .join(user_group_association)
        .filter(user_group_association.c.group_id == c_group_id)
        .all()
    )
    group_member_permissions = {}
    for result in results:
        if result.username is not None:
            username_or_email = result.username
        else:
            username_or_email = result.email
        group_member_permissions[result.id] = {
            "username": username_or_email,
            "permissions": result.permissions,
        }
    return group_member_permissions


def get_all_groups_member_permissions(user_id):
    c_user_id = user_id
    user_groups = (
        db.session.query(Group)
        .join(user_group_association)
        .filter(user_group_association.c.user_id == c_user_id)
        .all()
    )
    all_groups_member_permissions = {}
    for group in user_groups:
        group_member_permissions = get_group_member_permissions(group.id)
        all_groups_member_permissions[group.id] = group_member_permissions
    return all_groups_member_permissions


def get_invited_users_info(user_id):
    # Get all the groups the user is a part of
    user_groups_query = (
        db.session.query(Group.id)
        .join(user_group_association)
        .filter(user_group_association.c.user_id == user_id)
        .all()
    )
    # Extract the group IDs from the Row objects
    user_groups = [row[0] for row in user_groups_query]
    return (
        db.session.query(User.id, User.username, User.email)
        .join(GroupInvite, GroupInvite.user_id == User.id)
        .filter(GroupInvite.group_id.in_(user_groups))
        .all()
    )


def check_group_permission(group_id, permission):
    association = (
        db.session.query(user_group_association)
        .filter_by(user_id=current_user.id, group_id=group_id)
        .first()
    )
    if (
        association
        and association.permissions
        and permission in association.permissions
    ):
        return True
    return (
        jsonify(
            {
                "error": "You do not have permission to modify this group, please contact group owners"
            }
        ),
        400,
    )


def get_groups_for_user(user_id):
    query = (
        db.session.query(
            Group, user_group_association.c.role, user_group_association.c.permissions
        )
        .join(user_group_association, Group.id == user_group_association.c.group_id)
        .filter(user_group_association.c.user_id == user_id)
    )
    results = query.all()
    groups_info = [
        {
            "group": group.to_dict(),
            "role": role,
            "permissions": permissions,
        }
        for group, role, permissions in results
    ]
    return groups_info
