/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BannerResponse } from '../models/BannerResponse';
import type { BannerResponseAll } from '../models/BannerResponseAll';
import type { Body_create_banner } from '../models/Body_create_banner';
import type { Body_create_promo_code } from '../models/Body_create_promo_code';
import type { Body_create_school } from '../models/Body_create_school';
import type { Body_update_banner } from '../models/Body_update_banner';
import type { Body_update_school } from '../models/Body_update_school';
import type { LlmDataResponse } from '../models/LlmDataResponse';
import type { PromoCodesResponse } from '../models/PromoCodesResponse';
import type { SchoolsResponse } from '../models/SchoolsResponse';
import type { SchoolUsersResponse } from '../models/SchoolUsersResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminService {

    /**
     * Retrieve All Schools
     * @returns SchoolsResponse Successful Response
     * @throws ApiError
     */
    public static retrieveAllSchools(): CancelablePromise<SchoolsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/schools',
        });
    }

    /**
     * Create School
     * @param formData
     * @returns SchoolsResponse Successful Response
     * @throws ApiError
     */
    public static createSchool(
        formData: Body_create_school,
    ): CancelablePromise<SchoolsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/schools',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Retrieve School Promo Codes
     * @param schoolId
     * @returns PromoCodesResponse Successful Response
     * @throws ApiError
     */
    public static retrieveSchoolPromoCodes(
        schoolId: number,
    ): CancelablePromise<PromoCodesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/schools/promo_codes/{school_id}',
            path: {
                'school_id': schoolId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Retrieve All Non School Promo Codes
     * @returns PromoCodesResponse Successful Response
     * @throws ApiError
     */
    public static retrieveAllNonSchoolPromoCodes(): CancelablePromise<PromoCodesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/promo-codes',
        });
    }

    /**
     * Create Promo Code
     * @param formData
     * @returns PromoCodesResponse Successful Response
     * @throws ApiError
     */
    public static createPromoCode(
        formData: Body_create_promo_code,
    ): CancelablePromise<PromoCodesResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/promo-codes',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Expire Promo Code
     * @param codeId
     * @returns PromoCodesResponse Successful Response
     * @throws ApiError
     */
    public static expirePromoCode(
        codeId: string,
    ): CancelablePromise<PromoCodesResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/adminpromo-codes/{code_id}',
            path: {
                'code_id': codeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Redeem Promo Code
     * @param codeId
     * @returns PromoCodesResponse Successful Response
     * @throws ApiError
     */
    public static redeemPromoCode(
        codeId: string,
    ): CancelablePromise<PromoCodesResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/adminpromo-codes/redeem/{code_id}',
            path: {
                'code_id': codeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update School
     * @param schoolId
     * @param formData
     * @returns SchoolsResponse Successful Response
     * @throws ApiError
     */
    public static updateSchool(
        schoolId: number,
        formData: Body_update_school,
    ): CancelablePromise<SchoolsResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/schools/{school_id}',
            path: {
                'school_id': schoolId,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete School
     * @param schoolId
     * @returns SchoolsResponse Successful Response
     * @throws ApiError
     */
    public static deleteSchool(
        schoolId: number,
    ): CancelablePromise<SchoolsResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/schools/{school_id}',
            path: {
                'school_id': schoolId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Retrieve School Users
     * @param schoolId
     * @returns SchoolUsersResponse Successful Response
     * @throws ApiError
     */
    public static retrieveSchoolUsers(
        schoolId: number,
    ): CancelablePromise<SchoolUsersResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/schools/users/{school_id}',
            path: {
                'school_id': schoolId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Retrieve Active Banner
     * @returns BannerResponse Successful Response
     * @throws ApiError
     */
    public static retrieveActiveBanner(): CancelablePromise<BannerResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/info_banner',
        });
    }

    /**
     * Create Banner
     * @param formData
     * @returns BannerResponse Successful Response
     * @throws ApiError
     */
    public static createBanner(
        formData: Body_create_banner,
    ): CancelablePromise<BannerResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/info_banner',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Banner
     * @param bannerId
     * @param formData
     * @returns BannerResponse Successful Response
     * @throws ApiError
     */
    public static updateBanner(
        bannerId: number,
        formData: Body_update_banner,
    ): CancelablePromise<BannerResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/info_banner/{banner_id}',
            path: {
                'banner_id': bannerId,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Retreive All Banners
     * @returns BannerResponseAll Successful Response
     * @throws ApiError
     */
    public static retreiveAllBanners(): CancelablePromise<BannerResponseAll> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/info_banner/all',
        });
    }

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
