/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnkiImportRequest } from '../models/AnkiImportRequest';
import type { StandardApiResponse } from '../models/StandardApiResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AnkiService {

    /**
     * Import Anki Deck
     * Import a deck from anki, looks for a deck of the same name as the anki deck, if none exists
     * it creates one data is a dict with to keys, qtyCards and deck
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static importAnkiDeck(
        requestBody: AnkiImportRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/anki/import',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Export Deck To Anki
     * Export a deck to anki, user must be on a desktop,
     * have anki installed with teh anki connect add on
     * @param deckId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static exportDeckToAnki(
        deckId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deck_id}/anki/export',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
