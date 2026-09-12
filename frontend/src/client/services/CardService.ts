/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoGenerateRequest } from '../models/AutoGenerateRequest';
import type { CardData } from '../models/CardData';
import type { CardDataResponse } from '../models/CardDataResponse';
import type { CardDataWithPaginationResponse } from '../models/CardDataWithPaginationResponse';
import type { StandardApiResponse } from '../models/StandardApiResponse';
import type { ToggleResponseModel } from '../models/ToggleResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CardService {

    /**
     * Get Cards For Deck
     * @param deckId
     * @param searchQuery
     * @param sortValue
     * @param order
     * @param page
     * @param itemsPerPage
     * @returns CardDataWithPaginationResponse Successful Response
     * @throws ApiError
     */
    public static getCardsForDeck(
        deckId: number,
        searchQuery?: (string | null),
        sortValue: string = 'date',
        order: string = 'desc',
        page: number = 1,
        itemsPerPage: number = 24,
    ): CancelablePromise<CardDataWithPaginationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/{deck_id}/cards',
            path: {
                'deck_id': deckId,
            },
            query: {
                'search_query': searchQuery,
                'sort_value': sortValue,
                'order': order,
                'page': page,
                'items_per_page': itemsPerPage,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Card
     * @param deckId
     * @param cardId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteCard(
        deckId: number,
        cardId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/deck/{deck_id}/card/{card_id}',
            path: {
                'deck_id': deckId,
                'card_id': cardId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Edit Card
     * @param deckId
     * @param cardId
     * @param requestBody
     * @returns CardDataResponse Successful Response
     * @throws ApiError
     */
    public static editCard(
        deckId: number,
        cardId: number,
        requestBody: CardData,
    ): CancelablePromise<CardDataResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/deck/{deck_id}/card/{card_id}',
            path: {
                'deck_id': deckId,
                'card_id': cardId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Copy Card To Deck
     * Copies a card to another deck
     * @param deckId
     * @param cardId
     * @param deckToCopyToId
     * @returns CardDataResponse Successful Response
     * @throws ApiError
     */
    public static copyCardToDeck(
        deckId: number,
        cardId: number,
        deckToCopyToId: number,
    ): CancelablePromise<CardDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deck_id}/card/{card_id}/deck/{deckToCopyToId}',
            path: {
                'deck_id': deckId,
                'card_id': cardId,
                'deckToCopyToId': deckToCopyToId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create New Card
     * Creates a new card in a deck
     * @param deckId
     * @param requestBody
     * @returns CardDataResponse Successful Response
     * @throws ApiError
     */
    public static createNewCard(
        deckId: number,
        requestBody: CardData,
    ): CancelablePromise<CardDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deck_id}/card/',
            path: {
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
     * Toggle Favorite Card
     * @param cardId
     * @returns ToggleResponseModel Successful Response
     * @throws ApiError
     */
    public static toggleFavoriteCard(
        cardId: number,
    ): CancelablePromise<ToggleResponseModel> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/deck/{card_id}/favorite/',
            path: {
                'card_id': cardId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Auto Generate Cards
     * @param deckId
     * @param requestBody
     * @returns CardDataResponse Successful Response
     * @throws ApiError
     */
    public static autoGenerateCards(
        deckId: number,
        requestBody: AutoGenerateRequest,
    ): CancelablePromise<CardDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deck_id}/generate-new-cards',
            path: {
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
     * Regenerate Card
     * @param deckId
     * @param cardId
     * @returns CardDataResponse Successful Response
     * @throws ApiError
     */
    public static regenerateCard(
        deckId: number,
        cardId: number,
    ): CancelablePromise<CardDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deck_id}/card/{card_id}/regenerate',
            path: {
                'deck_id': deckId,
                'card_id': cardId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
