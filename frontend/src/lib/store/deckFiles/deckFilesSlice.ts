import {
    createEntityAdapter,
    createSelector,
    createSlice,
    type EntityState,
} from '@reduxjs/toolkit'
import type { DeckFilesSchema } from '@source/client'
import type { RootState } from '@store/store'

import { logoutUser } from '../user/actions'
import {
    deleteOneDeckFile,
    fetchDeckFiles,
    getOneFile,
    renameOneFile,
} from './actions'

const deckFilesAdapter = createEntityAdapter<DeckFilesSchema>({
    sortComparer: (a, b) => a.id - b.id,
})

interface DeckFilesSliceState extends EntityState<DeckFilesSchema> {
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string
    filesLoaded: number[]
}

const initialState: DeckFilesSliceState = deckFilesAdapter.getInitialState({
    status: 'idle',
    error: '',
    filesLoaded: [],
})
const deckFilesSlice = createSlice({
    name: 'decks',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchDeckFiles.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchDeckFiles.fulfilled, (state, action) => {
                state.status = 'succeeded'
                deckFilesAdapter.upsertMany(state, action.payload.result.files!)
                if (action.payload.result.files != null) {
                    for (const file of action.payload.result.files) {
                        state.filesLoaded.push(file.id)
                    }
                }
            })
            .addCase(fetchDeckFiles.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? ''
            })
            .addCase(deleteOneDeckFile.fulfilled, (state, action) => {
                state.status = 'succeeded'
                deckFilesAdapter.removeOne(state, action.payload.fileId)
            })
            .addCase(logoutUser.fulfilled, (state) => {
                deckFilesAdapter.removeAll(state)
                state.status = 'idle'
            })
            .addCase(renameOneFile.fulfilled, (state, action) => {
                state.status = 'succeeded'
                deckFilesAdapter.updateOne(state, {
                    id: action.payload.fileId,
                    changes: { name: action.payload.name },
                })
            })
            .addCase(getOneFile.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (action.payload.files != null) {
                    if (action.payload.files.length > 0) {
                        deckFilesAdapter.upsertOne(
                            state,
                            action.payload.files[0]
                        )
                    }
                }
            })

        //   UPDATE ONE DECK
        // .addCase(updateOneDeckFile.fulfilled, (state, action) => {
        //   state.status = "succeeded";
        //   const deck = state.entities[action.payload.deckId];
        //   if (deck != null) {
        //     const updatedDeck = { ...deck, ...action.payload.body };
        //     deckFilesAdapter.updateOne(state, {
        //       id: action.payload.deckId,
        //       changes: updatedDeck,
        //     });
        //   }
        // })
    },
})

export default deckFilesSlice.reducer
export const {
    selectAll: selectAllDeckFiles,
    selectById: selectDeckFileById,
    selectIds: selectDeckFileIds,
} = deckFilesAdapter.getSelectors((state: RootState) => state.deckFiles)

export const selectDeckFilesByIds = createSelector(
    [
        (state: RootState, ids: Array<number | string>) => ids,
        selectAllDeckFiles,
    ],
    (ids, files) => {
        if (ids == null) return null
        return files.filter((file) => ids.includes(file.id))
    }
)
