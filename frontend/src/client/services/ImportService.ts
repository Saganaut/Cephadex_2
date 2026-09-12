/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnkiImportRequest } from '../models/AnkiImportRequest';
import type { Body_import_cards_from_csv } from '../models/Body_import_cards_from_csv';
import type { CardDataResponse } from '../models/CardDataResponse';
import type { IdListRequest } from '../models/IdListRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ImportService {

    /**
     * Import Anki Cards
     * @param deckId
     * @param requestBody
     * @returns CardDataResponse Successful Response
     * @throws ApiError
     */
    public static importAnkiCards(
        deckId: number,
        requestBody: AnkiImportRequest,
    ): CancelablePromise<CardDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deckId}/import/anki-cards',
            query: {
                'deck_id': deckId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Import Cards From Other Decks
     * @param deckId
     * @param requestBody
     * @returns CardDataResponse Successful Response
     * @throws ApiError
     */
    public static importCardsFromOtherDecks(
        deckId: number,
        requestBody: IdListRequest,
    ): CancelablePromise<CardDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deckId}/import/other-decks',
            query: {
                'deck_id': deckId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Import Cards From Csv
     * @param deckId
     * @param formData
     * @returns CardDataResponse Successful Response
     * @throws ApiError
     */
    public static importCardsFromCsv(
        deckId: number,
        formData: Body_import_cards_from_csv,
    ): CancelablePromise<CardDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deckId}/import/CSV',
            path: {
                'deckId': deckId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
