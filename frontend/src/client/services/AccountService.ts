/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountDeletionRequest } from '../models/AccountDeletionRequest';
import type { Body_update_profile_picture } from '../models/Body_update_profile_picture';
import type { CheckUserNameResponse } from '../models/CheckUserNameResponse';
import type { SignUpRequest } from '../models/SignUpRequest';
import type { SignupResponse } from '../models/SignupResponse';
import type { StandardApiResponse } from '../models/StandardApiResponse';
import type { UsageRecordResponse } from '../models/UsageRecordResponse';
import type { UserDataResponse } from '../models/UserDataResponse';
import type { UserSettingsDataResponse } from '../models/UserSettingsDataResponse';
import type { UserSettingsSchema } from '../models/UserSettingsSchema';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AccountService {

    /**
     * Get User Settings
     * @returns UserSettingsDataResponse Successful Response
     * @throws ApiError
     */
    public static getUserSettings(): CancelablePromise<UserSettingsDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/settings',
        });
    }

    /**
     * Update User Settings
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static updateUserSettings(
        requestBody: UserSettingsSchema,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Check Username
     * @param username
     * @returns CheckUserNameResponse Successful Response
     * @throws ApiError
     */
    public static checkUsername(
        username: string,
    ): CancelablePromise<CheckUserNameResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/check-username/{username}',
            path: {
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Sign Up
     * @param requestBody
     * @returns SignupResponse Successful Response
     * @throws ApiError
     */
    public static signUp(
        requestBody: SignUpRequest,
    ): CancelablePromise<SignupResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/sign-up',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Account
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteAccount(
        requestBody: AccountDeletionRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/account',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Account
     * @param requestBody
     * @returns UserDataResponse Successful Response
     * @throws ApiError
     */
    public static updateAccount(
        requestBody: UserUpdateRequest,
    ): CancelablePromise<UserDataResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/account',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Profile Picture
     * @param formData
     * @returns UserDataResponse Successful Response
     * @throws ApiError
     */
    public static updateProfilePicture(
        formData: Body_update_profile_picture,
    ): CancelablePromise<UserDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/profile-picture',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Profile Picture
     * @returns UserDataResponse Successful Response
     * @throws ApiError
     */
    public static deleteProfilePicture(): CancelablePromise<UserDataResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/profile-picture',
        });
    }

    /**
     * Remaining Credit
     * @returns UsageRecordResponse Successful Response
     * @throws ApiError
     */
    public static remainingCredit(): CancelablePromise<UsageRecordResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/remaining-credit',
        });
    }

    /**
     * Create Customer Session
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createCustomerSession(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/customer-session',
        });
    }

}
