import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    type AutoGenerateRequest,
    type CardData,
    type CardDataResponse,
    type CardSchema,
    CardService,
    DeckService,
    type IdListRequest,
} from '@source/client'
import api from '@source/lib/services/cachedApiCalls'

export interface FetchCardsParams {
    deckId: number
    searchQuery?: string
    sortValue: string
    order?: 'asc' | 'desc'
    page?: number
    itemsPerPage?: number
    reset?: boolean
}

export const fetchCards = createAsyncThunk(
    'cards/fetchCards',
    async (params: FetchCardsParams, { dispatch, getState }) => {
        const result = await dispatch(
            api.endpoints.getCardsForDeck.initiate(params)
        )
        return result.data
    }
)

export const regenerateOneCard = createAsyncThunk(
    'cards/regenerateOneCard',
    async ({ deckId, cardId }: { deckId: number; cardId: number }) => {
        try {
            const response = await CardService.regenerateCard(deckId, cardId)
            return {
                cardId,
                message: response.message,

                deckId,
                body:
                    response.cards != null
                        ? response.cards[0]
                        : ([] as unknown as CardSchema),
            }
        } catch (error: any) {
            throw new Error(
                error.message ?? 'Something went wrong while updating the card'
            )
        }
    }
)

export const createOneCard = createAsyncThunk(
    'cards/createOneCard',
    async ({ cardData, deckId }: { deckId: number; cardData: CardData }) => {
        const response = await CardService.createNewCard(deckId, cardData)
        return response
    }
)

export const generateNewCards = createAsyncThunk(
    'cards/generateNewCards',
    async ({ deckId, cardData }: { deckId: number; cardData: CardData[] }) => {
        const requestBody: AutoGenerateRequest = { cardData }
        const response = await CardService.autoGenerateCards(
            deckId,
            requestBody
        )
        return response
    }
)

export const importCardsFromAnki = createAsyncThunk(
    'decks/importDecksFromAnki',
    async ({ deckId, cardData }: { deckId: number; cardData: any }) => {
        const result = await DeckService.importAnkiCards(deckId, cardData)
        return result
    }
)

export const importCardsFromCSV = createAsyncThunk(
    'decks/importDecksFromCSV',
    async ({ deckId, formData }: { deckId: number; formData: any }) => {
        const result = await DeckService.importCardsFromCsv(deckId, formData)
        return result
    }
)

export const importCardsFromOtherDecks = createAsyncThunk(
    'decks/importCardsFromOtherDecks',
    async ({ deckId, request }: { deckId: number; request: IdListRequest }) => {
        const result = await DeckService.importCardsFromOtherDecks(
            deckId,
            request
        )
        return result
    }
)

export const copyCardToDeck = createAsyncThunk(
    'cards/copyCardToDeck',
    async ({
        deckId,
        cardId,
        deckToCopyToId,
    }: {
        deckId: number
        cardId: number
        deckToCopyToId: number
    }) => {
        const result = await CardService.copyCardToDeck(
            deckId,
            cardId,
            deckToCopyToId
        )
        return result
    }
)

export const editCard = createAsyncThunk<
    CardDataResponse,
    {
        deckId: number
        cardId: number
        body: CardData
    }
>('cards/editCard', async ({ deckId, cardId, body }) => {
    const result = await CardService.editCard(deckId, cardId, body)
    return result
})

// export const deleteCard = createAsyncThunk(
//   "cards/deleteCard",
//   async ({ deckId, cardId }: { deckId: number; cardId: number }) => {
//     const result = await DeckService.deleteCard(deckId, cardId);
//     return result;
//   }
// );
