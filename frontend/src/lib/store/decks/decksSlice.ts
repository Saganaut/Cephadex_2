import {
    createEntityAdapter,
    createSelector,
    createSlice,
    type EntityState,
} from '@reduxjs/toolkit'
import type { DeckSchema } from '@source/client'
import type { RootState } from '@store/store'

import { deleteOneDeckFile, fetchDeckFiles } from '../deckFiles/actions'
import { logoutUser } from '../user/actions'
import {
    copyPublicDeck,
    deleteDeckImg,
    deleteDeckRelationship,
    deleteOneDeck,
    fetchDeckChildren,
    fetchDeckParents,
    fetchDecks,
    fetchOneDeck,
    fetchSharedDeck,
    refreshDeckData,
    saveGroupDeck,
    sendCardsBatch,
    setParentChildRelationship,
    updateOneDeck,
} from './actions'

const decksAdapter = createEntityAdapter<DeckSchema>({
    sortComparer: (a, b) => a.id - b.id,
})

interface DeckSliceState extends EntityState<DeckSchema> {
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string
    allDecksLoaded: boolean
    decksLoaded: number[]
}

const initialState: DeckSliceState = decksAdapter.getInitialState({
    status: 'idle',
    error: '',
    allDecksLoaded: false,
    decksLoaded: [],
})
const decksSlice = createSlice({
    name: 'decks',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            //   FETCH ALL DECKS
            .addCase(fetchDecks.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchDecks.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.allDecksLoaded = true
                decksAdapter.upsertMany(state, action.payload.decks!)
            })
            .addCase(fetchDecks.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? ''
            })
            //   DELETE ONE DECK
            .addCase(deleteOneDeck.fulfilled, (state, action) => {
                state.status = 'succeeded'
                decksAdapter.removeOne(state, action.payload.deckId)
            })
            //   UPDATE ONE DECK
            .addCase(updateOneDeck.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (action.payload.result.decks !== null) {
                    decksAdapter.upsertOne(
                        state,
                        action.payload.result.decks[0]
                    )
                }
            })
            .addCase(updateOneDeck.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? ''
            })
            .addCase(updateOneDeck.pending, (state) => {
                state.status = 'loading'
            })

            .addCase(fetchOneDeck.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (action.payload.decks !== null) {
                    decksAdapter.upsertOne(state, action.payload.decks[0])

                    action.payload.decks.forEach((deck) => {
                        if (!state.decksLoaded.includes(deck.id)) {
                            state.decksLoaded.push(deck.id)
                        }
                    })
                }
            })
            .addCase(fetchOneDeck.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? ''
            })
            .addCase(fetchOneDeck.pending, (state) => {
                state.status = 'loading'
            })

            .addCase(copyPublicDeck.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (action.payload.decks != null)
                    decksAdapter.upsertOne(state, action.payload.decks[0])
            })
            //   SEND CARDS BATCH
            .addCase(sendCardsBatch.fulfilled, (state, action) => {
                state.status = 'succeeded'
            })

            .addCase(fetchDeckChildren.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const { parentDeckId, result } = action.payload
                const parentDeck = state.entities[parentDeckId]
                if (parentDeck != null) {
                    parentDeck.children = [
                        ...(parentDeck.children ?? []),
                        ...result.deckIds,
                    ]
                }
            })
            .addCase(fetchDeckParents.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const { childDeckId, result } = action.payload
                const childDeck = state.entities[childDeckId]
                if (childDeck != null) {
                    childDeck.parents = [
                        ...(childDeck.parents ?? []),
                        ...result.deckIds,
                    ]
                }
            })
            .addCase(fetchDeckFiles.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const { deckId, result } = action.payload
                const deck = state.entities[deckId]
                if (deck != null) {
                    deck.files = result.fileIds
                }
            })
            .addCase(deleteOneDeckFile.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const { deckId, fileId } = action.payload
                const deck = state.entities[deckId]
                if (deck != null) {
                    deck.files = deck.files?.filter((id) => id !== fileId)
                }
            })
            // .addCase(fetchSharedDeck.fulfilled, (state, action) => {
            //   state.status = "succeeded";
            //   if (action.payload.decks != null)
            //     decksAdapter.upsertOne(state, action.payload.decks[0]); // TODO: eventually fix this - though shouldn't be a problem
            // })
            .addCase(fetchSharedDeck.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? ''
            })
            .addCase(logoutUser.fulfilled, (state) => {
                decksAdapter.removeAll(state)
                state.status = 'idle'
                state.allDecksLoaded = false
                state.decksLoaded = []
            })
            .addCase(refreshDeckData.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (action.payload.decks !== null) {
                    decksAdapter.upsertOne(state, action.payload.decks[0])
                }
            })
            .addCase(deleteDeckImg.fulfilled, (state, action) => {
                state.status = 'succeeded'
                decksAdapter.updateOne(state, {
                    id: action.payload.deckId,
                    changes: { img: null },
                })
            })
            .addCase(saveGroupDeck.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (action.payload.decks != null)
                    decksAdapter.upsertOne(state, action.payload.decks[0])
            })
            .addCase(deleteDeckRelationship.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const { parentId, childId } = action.payload
                const parentDeck = state.entities[parentId]
                const childDeck = state.entities[childId]
                if (parentDeck != null && childDeck != null) {
                    parentDeck.children = parentDeck.children?.filter(
                        (id) => id !== childId
                    )
                    childDeck.parents = childDeck.parents?.filter(
                        (id) => id !== parentId
                    )
                }
            })
            .addCase(setParentChildRelationship.fulfilled, (state, action) => {
                state.status = 'succeeded'
                const { parentId, childId } = action.payload
                const parentDeck = state.entities[parentId]
                const childDeck = state.entities[childId]
                if (parentDeck != null && childDeck != null) {
                    parentDeck.children = [
                        ...(parentDeck.children ?? []),
                        childId,
                    ]
                    childDeck.parents = [...(childDeck.parents ?? []), parentId]
                }
            })
    },
})

export default decksSlice.reducer
export const {
    selectAll: selectAllDecks,
    selectById: selectDeckById,
    selectIds: selectDeckIds,
} = decksAdapter.getSelectors((state: RootState) => state.decks)

export const selectDeckByShareId = createSelector(
    [selectAllDecks, (_, shareId) => shareId],
    (decks, shareId) => decks.find((deck) => deck.shareId === shareId)
)

export const selectDecksByIds = createSelector(
    [(state: RootState, ids: Array<number | string>) => ids, selectAllDecks],
    (ids, decks) =>
        ids
            .map((id) => decks.find((deck) => deck.id === id))
            .filter((deck): deck is DeckSchema => deck !== undefined)
)

export const selectDeckFileIdsByDeckId = createSelector(
    [(state: RootState, deckId: number) => deckId, selectAllDecks],
    (deckId, decks) => {
        const deck = decks.find((deck) => deck.id === deckId)
        return deck?.files ?? []
    }
)

export const selectDecksByCardType = createSelector(
    [selectAllDecks, (_, cardType) => cardType],
    (decks, cardType) => {
        const filteredDecks = decks.filter((deck) => {
            return cardType.includes(deck.category)
        })
        return filteredDecks
    }
)
