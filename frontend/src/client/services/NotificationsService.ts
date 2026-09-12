/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationsResponse } from '../models/NotificationsResponse';
import type { NotificationsSchema } from '../models/NotificationsSchema';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NotificationsService {

    /**
     * Get Notifications
     * @returns NotificationsResponse Successful Response
     * @throws ApiError
     */
    public static getNotifications(): CancelablePromise<NotificationsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/notifications',
        });
    }

    /**
     * Delete Notifications
     * @param requestBody
     * @returns NotificationsResponse Successful Response
     * @throws ApiError
     */
    public static deleteNotifications(
        requestBody: NotificationsSchema,
    ): CancelablePromise<NotificationsResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/notifications',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Notifications
     * @param requestBody
     * @returns NotificationsResponse Successful Response
     * @throws ApiError
     */
    public static updateNotifications(
        requestBody: NotificationsSchema,
    ): CancelablePromise<NotificationsResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/notifications',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Check New Notifications
     * @returns NotificationsResponse Successful Response
     * @throws ApiError
     */
    public static checkNewNotifications(): CancelablePromise<NotificationsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/notifications/check-new',
        });
    }

    /**
     * Enable Email Notifications
     * @returns any Successful Response
     * @throws ApiError
     */
    public static enableEmailNotifications(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/email-notifications',
        });
    }

    /**
     * Disable Email Notifications
     * @returns any Successful Response
     * @throws ApiError
     */
    public static disableEmailNotifications(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/email-notifications',
        });
    }

}
