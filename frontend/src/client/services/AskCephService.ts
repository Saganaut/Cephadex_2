/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AskCephRequest } from '../models/AskCephRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AskCephService {

    /**
     * Ask
     * Type question: wrong, explain, question
     * request form should include card_id, question, latest_paragraph
     * @param typeQuestion
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static ask(
        typeQuestion: string,
        requestBody: AskCephRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ask-ceph/{type_question}',
            path: {
                'type_question': typeQuestion,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
