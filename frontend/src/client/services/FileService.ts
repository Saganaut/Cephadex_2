/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileDataResponse } from '../models/FileDataResponse';
import type { StandardApiResponse } from '../models/StandardApiResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FileService {

    /**
     * Get Files
     * @param deckId
     * @returns FileDataResponse Successful Response
     * @throws ApiError
     */
    public static getFiles(
        deckId: number,
    ): CancelablePromise<FileDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/{deck_id}/files',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Single File
     * @param fileId
     * @returns FileDataResponse Successful Response
     * @throws ApiError
     */
    public static getSingleFile(
        fileId: number,
    ): CancelablePromise<FileDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/file/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Download File As Pdf
     * @param deckId
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadFileAsPdf(
        deckId: number,
        fileId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/{deck_id}/file/{file_id}/pdf',
            path: {
                'deck_id': deckId,
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get File
     * @param deckId
     * @param fileId
     * @returns FileDataResponse Successful Response
     * @throws ApiError
     */
    public static getFile(
        deckId: number,
        fileId: number,
    ): CancelablePromise<FileDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/{deck_id}/file/{file_id}',
            path: {
                'deck_id': deckId,
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete File
     * @param deckId
     * @param fileId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteFile(
        deckId: number,
        fileId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/deck/{deck_id}/file/{file_id}',
            path: {
                'deck_id': deckId,
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Rename File
     * @param deckId
     * @param fileId
     * @param newName
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static renameFile(
        deckId: number,
        fileId: number,
        newName: string,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/deck/{deck_id}/file/{file_id}',
            path: {
                'deck_id': deckId,
                'file_id': fileId,
            },
            query: {
                'new_name': newName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
