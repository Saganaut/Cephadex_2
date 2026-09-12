/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NewsletterRequest } from '../models/NewsletterRequest';
import type { StandardApiResponse } from '../models/StandardApiResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NewsletterService {

    /**
     * Check Subscription For User
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static checkSubscriptionForUser(): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/newsletter',
        });
    }

    /**
     * Subscribe
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static subscribe(
        requestBody: NewsletterRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/newsletter',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Unsubscribe
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static unsubscribe(
        requestBody: NewsletterRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/newsletter',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
