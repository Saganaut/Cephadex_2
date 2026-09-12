/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_call_credit_counter } from '../models/Body_call_credit_counter';
import type { Body_extract } from '../models/Body_extract';
import type { CreditResponse } from '../models/CreditResponse';
import type { ExtractResponse } from '../models/ExtractResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CreateService {

    /**
     * Extract
     * Take the form data from the extraction form and creates an extractor instance
     * that will handle the extraction process,
     * returns a slug corresponding to the notification that will be sent to the user
     * when the extraction is complete.
     * Since this route has some CPU bound tasks it is not async, additionally
     * the whisper API has no async support
     * @param formData
     * @returns ExtractResponse Successful Response
     * @throws ApiError
     */
    public static extract(
        formData: Body_extract,
    ): CancelablePromise<ExtractResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/create/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Call Credit Counter
     * Take the same request model as the extract endpoint and returns the credit
     * that the extraction
     * will cost
     * In practice the only fields that are used are file, text, link and link expanded.
     * Since this route has some CPU bound tasks it is not async
     * @param formData
     * @returns CreditResponse Successful Response
     * @throws ApiError
     */
    public static callCreditCounter(
        formData: Body_call_credit_counter,
    ): CancelablePromise<CreditResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/create/credit',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
