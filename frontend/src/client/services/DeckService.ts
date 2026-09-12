/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnkiImportRequest } from '../models/AnkiImportRequest';
import type { AutoGenerateRequest } from '../models/AutoGenerateRequest';
import type { Body_import_cards_from_csv } from '../models/Body_import_cards_from_csv';
import type { Body_update_deck } from '../models/Body_update_deck';
import type { CardData } from '../models/CardData';
import type { CardDataResponse } from '../models/CardDataResponse';
import type { CardDataWithPaginationResponse } from '../models/CardDataWithPaginationResponse';
import type { DeckDataResponse } from '../models/DeckDataResponse';
import type { DeckIdRequest } from '../models/DeckIdRequest';
import type { EmailListRequest } from '../models/EmailListRequest';
import type { FileDataResponse } from '../models/FileDataResponse';
import type { GetSharedDeckDataResponse } from '../models/GetSharedDeckDataResponse';
import type { IdListRequest } from '../models/IdListRequest';
import type { LinkAndQrCodeResponse } from '../models/LinkAndQrCodeResponse';
import type { PublicCardDataResponse } from '../models/PublicCardDataResponse';
import type { PublicDeckDataResponse } from '../models/PublicDeckDataResponse';
import type { SharedDeckDataResponse } from '../models/SharedDeckDataResponse';
import type { StandardApiResponse } from '../models/StandardApiResponse';
import type { ToggleResponseModel } from '../models/ToggleResponseModel';
import type { UpdateDeckRequest } from '../models/UpdateDeckRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DeckService {

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

    /**
     * Get Shared Decks
     * Returns a list of all decks shared with user
     * @returns SharedDeckDataResponse Successful Response
     * @throws ApiError
     */
    public static getSharedDecks(): CancelablePromise<SharedDeckDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/shared',
        });
    }

    /**
     * Get Shared Deck
     * @param deckSharingId
     * @returns GetSharedDeckDataResponse Successful Response
     * @throws ApiError
     */
    public static getSharedDeck(
        deckSharingId: string,
    ): CancelablePromise<GetSharedDeckDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/shared/{deck_sharing_id}',
            path: {
                'deck_sharing_id': deckSharingId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Shared Deck
     * Deletes a deck sharing entry, not the actual deck
     * @param deckSharingId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteSharedDeck(
        deckSharingId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/deck/shared/{deck_sharing_id}',
            path: {
                'deck_sharing_id': deckSharingId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Copy Shared Deck
     * Approves a shared deck, adding it to the users regular decks
     * @param deckSharingId
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static copySharedDeck(
        deckSharingId: string,
    ): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/shared/{deck_sharing_id}',
            path: {
                'deck_sharing_id': deckSharingId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Share Deck
     * Shares one or more decks to others.  If the email is associated with a user it
     * copies the deck and makes a shared deck entry for that user.  It also sends an email to both
     * users and non users with a link
     * to the shared deck
     * @param deckId
     * @param requestBody
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static shareDeck(
        deckId: number,
        requestBody: EmailListRequest,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/shared/{deck_id}/share',
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
     * Get Share Link For Deck
     * Returns a link and a QR code for a deck - accessible by anyone
     * @param deckId
     * @returns LinkAndQrCodeResponse Successful Response
     * @throws ApiError
     */
    public static getShareLinkForDeck(
        deckId: number,
    ): CancelablePromise<LinkAndQrCodeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/{deck_id}/link',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

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
     * Get Deck Csv
     * All CSV have the following columns headers = "front, back 1, back 2, back 3,
     * back 4, formula, image, sound, category, subject, topic, srs interval, times asked,
     * times correct\n
     * @param deckId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getDeckCsv(
        deckId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/{deck_id}/csv',
            path: {
                'deck_id': deckId,
            },
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

    /**
     * Get All Decks
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static getAllDecks(): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/all',
        });
    }

    /**
     * Toggle Favorite Deck
     * @param deckId
     * @returns ToggleResponseModel Successful Response
     * @throws ApiError
     */
    public static toggleFavoriteDeck(
        deckId: number,
    ): CancelablePromise<ToggleResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/{deck_id}/favorite',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

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
     * Delete Deck
     * Deletes a deck
     * @param deckId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteDeck(
        deckId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/deck/{deck_id}',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Deck
     * Updates deck description, values are optional. Only updates when there is a value in
     * the field.
     * For public it takes an int, 0 for false 1 for true. Does not update cards or files.
     * @param deckId
     * @param formData
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static updateDeck(
        deckId: number,
        formData: Body_update_deck,
    ): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/deck/{deck_id}',
            path: {
                'deck_id': deckId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Deck
     * Gets a deck by deck_id
     * @param deckId
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static getDeck(
        deckId: number,
    ): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/{deck_id}',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Deck Picture
     * @param deckId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteDeckPicture(
        deckId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/deck/{deck_id}/picture',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Deck
     * Creates an empty deck
     * @param requestBody
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static createDeck(
        requestBody: UpdateDeckRequest,
    ): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/',
            body: requestBody,
            mediaType: 'application/json',
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
     * Refresh Deck Data
     * Updates deck data, takes a dict with key value pairs of field and value
     * @param deckId
     * @returns DeckDataResponse Successful Response
     * @throws ApiError
     */
    public static refreshDeckData(
        deckId: number,
    ): CancelablePromise<DeckDataResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/deck/data/{deck_id}',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

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

    /**
     * Generate Images For Deck
     * Generates images for all cards in a deck
     * @param deckId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateImagesForDeck(
        deckId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/generate-images/{deck_id}',
            path: {
                'deck_id': deckId,
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

    /**
     * Get Children
     * Gets all children of a deck
     * @param deckId
     * @returns DeckIdRequest Successful Response
     * @throws ApiError
     */
    public static getChildren(
        deckId: number,
    ): CancelablePromise<DeckIdRequest> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/{deck_id}/children',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Parents
     * Gets all parents of a deck
     * @param deckId
     * @returns DeckIdRequest Successful Response
     * @throws ApiError
     */
    public static getParents(
        deckId: number,
    ): CancelablePromise<DeckIdRequest> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/deck/{deck_id}/parents',
            path: {
                'deck_id': deckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Set Parent Child Relationship
     * Sets a parent child relationship between two decks
     * @param parentDeckId
     * @param childDeckId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static setParentChildRelationship(
        parentDeckId: number,
        childDeckId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/deck/parent/{parent_deck_id}/child/{child_deck_id}',
            path: {
                'parent_deck_id': parentDeckId,
                'child_deck_id': childDeckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Parent Child Relationship
     * Deletes a parent child relationship between two decks
     * @param parentDeckId
     * @param childDeckId
     * @returns StandardApiResponse Successful Response
     * @throws ApiError
     */
    public static deleteParentChildRelationship(
        parentDeckId: number,
        childDeckId: number,
    ): CancelablePromise<StandardApiResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/deck/parent/{parent_deck_id}/child/{child_deck_id}',
            path: {
                'parent_deck_id': parentDeckId,
                'child_deck_id': childDeckId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
