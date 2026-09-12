/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGameRequest } from '../models/CreateGameRequest';
import type { NewGameDataResponse } from '../models/NewGameDataResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GameService {

    /**
     * Create New Flex Game
     * @param requestBody
     * @returns NewGameDataResponse Successful Response
     * @throws ApiError
     */
    public static createNewFlexGame(
        requestBody: CreateGameRequest,
    ): CancelablePromise<NewGameDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/game/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Game
     * @param gameId
     * @returns NewGameDataResponse Successful Response
     * @throws ApiError
     */
    public static getGame(
        gameId: number,
    ): CancelablePromise<NewGameDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/game/{game_id}',
            path: {
                'game_id': gameId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Join Game
     * @param gameId
     * @returns NewGameDataResponse Successful Response
     * @throws ApiError
     */
    public static joinGame(
        gameId: number,
    ): CancelablePromise<NewGameDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/game/join/{game_id}',
            path: {
                'game_id': gameId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
