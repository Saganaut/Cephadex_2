/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BlogDataResponse } from '../models/BlogDataResponse';
import type { BlogsDataResponse } from '../models/BlogsDataResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BlogService {

    /**
     * Get Blog Post
     * takes either a blog slug or "latest" as a param
     * @param slug
     * @returns BlogDataResponse Successful Response
     * @throws ApiError
     */
    public static getBlogPost(
        slug: (string | null),
    ): CancelablePromise<BlogDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/info/blog/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get All Blog Posts
     * retursn all blogs in descending order of time created, does not include images
     * @returns BlogsDataResponse Successful Response
     * @throws ApiError
     */
    public static getAllBlogPosts(): CancelablePromise<BlogsDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/info/all-blogs',
        });
    }

}
