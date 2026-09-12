/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LlmDataResponse } from '../models/LlmDataResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LlmDataService {

    /**
     * Get Llm Data
     * @returns LlmDataResponse Successful Response
     * @throws ApiError
     */
    public static getLlmData(): CancelablePromise<LlmDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/data',
        });
    }

    /**
     * Upvote Record
     * @param recordId
     * @returns LlmDataResponse Successful Response
     * @throws ApiError
     */
    public static upvoteRecord(
        recordId: number,
    ): CancelablePromise<LlmDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/data/{record_id}/upvote',
            path: {
                'record_id': recordId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Downvote Record
     * @param recordId
     * @returns LlmDataResponse Successful Response
     * @throws ApiError
     */
    public static downvoteRecord(
        recordId: number,
    ): CancelablePromise<LlmDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/data/{record_id}/downvote',
            path: {
                'record_id': recordId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
