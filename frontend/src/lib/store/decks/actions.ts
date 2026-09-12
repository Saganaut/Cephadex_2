import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
    DeckService,
    type GetCardsDueRequest,
    GroupService,
    StudyService,
} from '@source/client'
import type { RootState } from '@store/store'

import { selectAllDecks } from './decksSlice'

export const fetchDecks = createAsyncThunk('decks/fetchDecks', async () => {
    const result = await DeckService.getAllDecks()
    return result
})

export const fetchOneDeck = createAsyncThunk(
    'decks/fetchOneDeck',
    async (deckId: number) => {
        const result = await DeckService.getDeck(deckId)
        return result
    }
)

export const deleteOneDeck = createAsyncThunk(
    'decks/deleteOneDeck',
    async (deckId: number) => {
        const result = await DeckService.deleteDeck(deckId)
        return {
            deckId,
            result,
            message: result.message,
        }
    }
)

export const updateOneDeck = createAsyncThunk(
    'decks/updateOneDeck',
    async ({ body, deckId }: { body: any; deckId: number }) => {
        const result = await DeckService.updateDeck(deckId, body)
        return {
            deckId,
            body,
            result,
            message: result.message,
        }
    }
)
export const sendCardsBatch = createAsyncThunk(
    'decks/sendCardsBatch',
    async ({ body, deckId }: { body: GetCardsDueRequest; deckId: number }) => {
        try {
            const response = await StudyService.getCardsDue(deckId, body)
            return {
                deckId,
                response,
                message: response.message,
                // body: response.cards != null ? response.cards[0] : {},
            }
        } catch (error: any) {
            throw new Error(
                error.message ?? 'Something went wrong while updating the card'
            )
        }
    }
)

export const selectDecksBySearchTerm = createSelector(
    [
        (state: RootState) => state,
        (_: RootState, searchTerm: string) => searchTerm,
    ],

    (state, searchTerm) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase()
        return selectAllDecks(state).filter(
            (deck) =>
                deck.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                deck.subject?.toLowerCase().includes(lowerCaseSearchTerm)
        )
    }
)

export const copyPublicDeck = createAsyncThunk(
    'decks/copyPublicDeck',
    async (deckId: number) => {
        const result = await DeckService.copyPublicDeck(deckId)
        return result
    }
)

export const fetchDeckChildren = createAsyncThunk(
    'decks/fetchDeckChildren',
    async (parentDeckId: number) => {
        const result = await DeckService.getChildren(parentDeckId)
        return { parentDeckId, result, message: result.message }
    }
)

export const fetchDeckParents = createAsyncThunk(
    'decks/fetchDeckParents',
    async (childDeckId: number) => {
        const result = await DeckService.getParents(childDeckId)
        return { childDeckId, result, message: result.message }
    }
)

export const fetchSharedDeck = createAsyncThunk(
    'decks/fetchShareDeck',
    async (SharedDeckId: string) => {
        const result = await DeckService.getSharedDeck(SharedDeckId)
        return result
    }
)

export const copySharedDeck = createAsyncThunk(
    'decks/copySharedDeck',
    async (SharedDeckId: string) => {
        const result = await DeckService.copySharedDeck(SharedDeckId)
        return result
    }
)

export const refreshDeckData = createAsyncThunk(
    'decks/refreshDeckData',
    async (deckId: number) => {
        const result = await DeckService.refreshDeckData(deckId)
        return result
    }
)

export const deleteDeckImg = createAsyncThunk(
    'decks/deleteDeckImg',
    async (deckId: number) => {
        const result = await DeckService.deleteDeckPicture(deckId)
        return {
            deckId,
            result,
            message: result.message,
        }
    }
)

export const saveGroupDeck = createAsyncThunk(
    'decks/saveGroupDeck',
    async ({ deckId, groupId }: { deckId: number; groupId: number }) => {
        const result = await GroupService.saveDeckFromGroup(groupId, deckId)
        return result
    }
)

export const setParentChildRelationship = createAsyncThunk(
    'decks/setParentChildRelationship',
    async ({ parentId, childId }: { parentId: number; childId: number }) => {
        const result = await DeckService.setParentChildRelationship(
            parentId,
            childId
        )
        return { parentId, childId, result }
    }
)

export const deleteDeckRelationship = createAsyncThunk(
    'decks/deleteDeckRelationship',
    async ({ parentId, childId }: { parentId: number; childId: number }) => {
        const result = await DeckService.deleteParentChildRelationship(
            parentId,
            childId
        )
        return { parentId, childId, result }
    }
)
