/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeckDataResponse } from '../models/DeckDataResponse';
import type { PublicCardDataResponse } from '../models/PublicCardDataResponse';
import type { PublicDeckDataResponse } from '../models/PublicDeckDataResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PublicDeckService {

    /**
     * Search Public Decks
     * @param searchQuery
     * @param sortValue
     * @param order
     * @param page
     * @param itemsPerPage
     * @returns PublicDeckDataResponse Successful Response
     * @throws ApiError
     */
    public static searchPublicDecks(
        searchQuery: string,
        sortValue: string = 'name',
        order: string = 'desc',
        page: number = 1,
        itemsPerPage: number = 12,
    ): CancelablePromise<PublicDeckDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/public-decks/search/',
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
     * Toggle Like Deck
     * @param deckId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static toggleLikeDeck(
        deckId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deck_id}/like',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Cards For Public Deck
     * @param deckId
     * @returns PublicCardDataResponse Successful Response
     * @throws ApiError
     */
    public static getCardsForPublicDeck(
        deckId: number,
    ): CancelablePromise<PublicCardDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/public/{deck_id}/cards',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Copy Public Deck
     * @param deckId
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static copyPublicDeck(
        deckId: number,
    ): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/public/{deck_id}',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
