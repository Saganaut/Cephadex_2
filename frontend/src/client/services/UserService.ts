/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountDeletionRequest } from '../models/AccountDeletionRequest';
import type { Body_update_profile_picture } from '../models/Body_update_profile_picture';
import type { CheckUserNameResponse } from '../models/CheckUserNameResponse';
import type { FeedbackRequest } from '../models/FeedbackRequest';
import type { GoogleSignInRequest } from '../models/GoogleSignInRequest';
import type { GuestRequest } from '../models/GuestRequest';
import type { GuestResponse } from '../models/GuestResponse';
import type { LogoutResponse } from '../models/LogoutResponse';
import type { NewsletterRequest } from '../models/NewsletterRequest';
import type { NotificationsResponse } from '../models/NotificationsResponse';
import type { NotificationsSchema } from '../models/NotificationsSchema';
import type { SignInResponse } from '../models/SignInResponse';
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

export class UserService {

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

    /**
     * Get Microsoft Auth Callback
     * @param code
     * @param state
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMicrosoftAuthCallback(
        code: string,
        state: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/microsoft_auth',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Discord Callback
     * @param code
     * @param state
     * @returns any Successful Response
     * @throws ApiError
     */
    public static discordCallback(
        code: string,
        state: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/discord_callback',
            query: {
                'code': code,
                'state': state,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Guest Account
     * @param requestBody
     * @returns GuestResponse Successful Response
     * @throws ApiError
     */
    public static createGuestAccount(
        requestBody?: (GuestRequest | null),
    ): CancelablePromise<GuestResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/auth/create-guest',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Google Sign In
     * @param requestBody
     * @returns SignInResponse Successful Response
     * @throws ApiError
     */
    public static googleSignIn(
        requestBody: GoogleSignInRequest,
    ): CancelablePromise<SignInResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/auth/google-sign-in',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Refresh Token
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshToken(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/auth/refresh-token/',
        });
    }

    /**
     * Check User Status
     * @returns UserDataResponse Successful Response
     * @throws ApiError
     */
    public static checkUserStatus(): CancelablePromise<UserDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/auth/status/',
        });
    }

    /**
     * Logout
     * @returns LogoutResponse Successful Response
     * @throws ApiError
     */
    public static logout(): CancelablePromise<LogoutResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/auth/logout',
        });
    }

    /**
     * Get User
     * @returns UserDataResponse Successful Response
     * @throws ApiError
     */
    public static getUser(): CancelablePromise<UserDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/user',
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
     * Update User Data
     * @param updateType
     * @returns UserDataResponse Successful Response
     * @throws ApiError
     */
    public static updateUserData(
        updateType: string,
    ): CancelablePromise<UserDataResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/data/{type}',
            query: {
                'update_type': updateType,
            },
            errors: {
                422: `Validation Error`,
            },
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

    /**
     * Search Users
     * @param userInfo
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchUsers(
        userInfo: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/search/{user_info}',
            path: {
                'user_info': userInfo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
