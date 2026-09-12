/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CardViewerService {

    /**
     * Search Public Cards
     * @param deckId
     * @param searchQuery
     * @param deckType
     * @param sortValue
     * @param order
     * @param page
     * @param itemsPerPage
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchPublicCards(
        deckId: number,
        searchQuery: string,
        deckType: string = 'public',
        sortValue: string = 'name',
        order: string = 'desc',
        page: number = 1,
        itemsPerPage: number = 12,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/card-viewer/{deck_id}',
            path: {
                'deck_id': deckId,
            },
            query: {
                'search_query': searchQuery,
                'deck_type': deckType,
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

}
