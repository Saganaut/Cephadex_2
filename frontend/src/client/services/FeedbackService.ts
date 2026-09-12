/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeedbackRequest } from '../models/FeedbackRequest';
import type { StandardApiResponse } from '../models/StandardApiResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FeedbackService {

    /**
     * Feedback
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static feedback(
        requestBody: FeedbackRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/feedback',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
