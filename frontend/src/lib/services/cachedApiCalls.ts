import {
    createApi,
    fetchBaseQuery,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import {
    type CardDataWithPaginationResponse,
    DeckService,
} from '@source/client'

import type { FetchCardsParams } from '../store/cards/actions'
const backendUrl = import.meta.env.VITE_BACKEND_URL

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: backendUrl, // Base URL
    }),
    tagTypes: ['Deck'],
    endpoints: (builder) => ({
        getCardsForDeck: builder.query<
            CardDataWithPaginationResponse,
            FetchCardsParams
        >({
            queryFn: async ({
                deckId,
                searchQuery,
                sortValue,
                order,
                page,
                itemsPerPage,
            }: FetchCardsParams) => {
                try {
                    const data = await DeckService.getCardsForDeck(
                        deckId,
                        searchQuery,
                        sortValue,
                        order,
                        page,
                        itemsPerPage
                    )
                    return { data }
                } catch (error) {
                    return { error: error as FetchBaseQueryError }
                }
            },
            providesTags: (
                result,
                error,
                { deckId, searchQuery, sortValue, order, page, itemsPerPage }
            ) => [
                {
                    type: 'Deck',
                    id: `${deckId}-${searchQuery}-${sortValue}-${order}-${page}-${itemsPerPage}`,
                },
            ],
        }),
    }),
})

export default api
