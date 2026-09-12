/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddDeckToGroupRequest } from '../models/AddDeckToGroupRequest';
import type { DeckDataResponse } from '../models/DeckDataResponse';
import type { StandardApiResponse } from '../models/StandardApiResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GroupDecksService {

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
