/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddDeckToGroupRequest } from '../models/AddDeckToGroupRequest';
import type { AllInvitationsForUserResponse } from '../models/AllInvitationsForUserResponse';
import type { Body_update_group } from '../models/Body_update_group';
import type { CreateGroupDataRequest } from '../models/CreateGroupDataRequest';
import type { DeckDataResponse } from '../models/DeckDataResponse';
import type { DeleteInvitationsRequest } from '../models/DeleteInvitationsRequest';
import type { GroupDataResponse } from '../models/GroupDataResponse';
import type { GroupFullDataResponse } from '../models/GroupFullDataResponse';
import type { GroupInviteResponse } from '../models/GroupInviteResponse';
import type { InvitedUsersDataResponse } from '../models/InvitedUsersDataResponse';
import type { InviteRequest } from '../models/InviteRequest';
import type { LinkAndQrCodeResponse } from '../models/LinkAndQrCodeResponse';
import type { PermissionChangeRequest } from '../models/PermissionChangeRequest';
import type { StandardApiResponse } from '../models/StandardApiResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GroupService {

    /**
     * Get All Groups For User
     * Return all groups that the user is a member of
     * @returns GroupDataResponse Successful Response
     * @throws ApiError
     */
    public static getAllGroupsForUser(): CancelablePromise<GroupDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/group/all',
        });
    }

    /**
     * Create Group
     * Create a group with the given name and description
     * @param requestBody
     * @returns GroupDataResponse Successful Response
     * @throws ApiError
     */
    public static createGroup(
        requestBody: CreateGroupDataRequest,
    ): CancelablePromise<GroupDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/group/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Group
     * @param groupId
     * @param formData
     * @returns GroupDataResponse Successful Response
     * @throws ApiError
     */
    public static updateGroup(
        groupId: number,
        formData: Body_update_group,
    ): CancelablePromise<GroupDataResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/group/{group_id}',
            path: {
                'group_id': groupId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Group
     * Delete a group if the user is the creator
     * @param groupId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteGroup(
        groupId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/group/{group_id}',
            path: {
                'group_id': groupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Group
     * @param groupId
     * @returns GroupFullDataResponse Successful Response
     * @throws ApiError
     */
    public static getGroup(
        groupId: number,
    ): CancelablePromise<GroupFullDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/group/{group_id}',
            path: {
                'group_id': groupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Group Picture
     * Delete the group picture
     * @param groupId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteGroupPicture(
        groupId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/group/{group_id}/picture',
            path: {
                'group_id': groupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get All Groups For User
     * Return all groups that the user is a member of
     * @returns LinkAndQrCodeResponse Successful Response
     * @throws ApiError
     */
    public static getAllGroupsForUser1(): CancelablePromise<LinkAndQrCodeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/group/link-and-qr/{group_id}',
        });
    }

    /**
     * Accept Group Invite
     * @param groupId
     * @returns GroupDataResponse Successful Response
     * @throws ApiError
     */
    public static acceptGroupInvite(
        groupId: number,
    ): CancelablePromise<GroupDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/group/invitation/{group_id}/accept',
            path: {
                'group_id': groupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Decline Group Invite
     * @param groupId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static declineGroupInvite(
        groupId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/group/invitation/{group_id}/decline',
            path: {
                'group_id': groupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get All Group Invites
     * @returns AllInvitationsForUserResponse Successful Response
     * @throws ApiError
     */
    public static getAllGroupInvites(): CancelablePromise<AllInvitationsForUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/group/invitation/all',
        });
    }

    /**
     * Get All Invited Users
     * @param groupId
     * @returns InvitedUsersDataResponse Successful Response
     * @throws ApiError
     */
    public static getAllInvitedUsers(
        groupId: number,
    ): CancelablePromise<InvitedUsersDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/group/{group_id}/invited-users',
            path: {
                'group_id': groupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Invitations
     * @param groupId
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteInvitations(
        groupId: number,
        requestBody: DeleteInvitationsRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/group/{group_id}/invited-users',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Invite To Group
     * @param groupId
     * @param requestBody
     * @returns GroupInviteResponse Successful Response
     * @throws ApiError
     */
    public static inviteToGroup(
        groupId: number,
        requestBody: InviteRequest,
    ): CancelablePromise<GroupInviteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/group/{group_id}/invite/',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Member Permissions
     * Permissions values include "read" and "write",
     * roles include "member", "admin", and "creator"
     * @param groupId
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static updateMemberPermissions(
        groupId: number,
        requestBody: PermissionChangeRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/group/{group_id}/permissions',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Remove User Group
     * @param groupId
     * @param userId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static removeUserGroup(
        groupId: number,
        userId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/group/{group_id}/member/{user_id}',
            path: {
                'group_id': groupId,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Decks For Group
     * @param groupId
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static getDecksForGroup(
        groupId: number,
    ): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/group/{group_id}/deck',
            path: {
                'group_id': groupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add Deck To Group
     * @param groupId
     * @param requestBody
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static addDeckToGroup(
        groupId: number,
        requestBody: AddDeckToGroupRequest,
    ): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/group/{group_id}/deck',
            path: {
                'group_id': groupId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Remove Deck From Group
     * @param groupId
     * @param deckId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static removeDeckFromGroup(
        groupId: number,
        deckId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/group/{group_id}/deck/{deck_id}',
            path: {
                'group_id': groupId,
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Save Deck From Group
     * @param groupId
     * @param deckId
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static saveDeckFromGroup(
        groupId: number,
        deckId: number,
    ): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/group/{group_id}/deck/{deck_id}/import',
            path: {
                'group_id': groupId,
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
