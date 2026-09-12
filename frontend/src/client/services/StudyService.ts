/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetCardsDueRequest } from '../models/GetCardsDueRequest';
import type { GetCardsDueResponse } from '../models/GetCardsDueResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StudyService {

    /**
     * Get Cards Due
     * Take an optional param with number of cards due to load, defaults to 20
     * @param deckId
     * @param requestBody
     * @returns GetCardsDueResponse Successful Response
     * @throws ApiError
     */
    public static getCardsDue(
        deckId: number,
        requestBody: GetCardsDueRequest,
    ): CancelablePromise<GetCardsDueResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/study/{deck_id}/cards-due',
            path: {
                'deck_id': deckId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
