import {
    createEntityAdapter,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit'
import type { IGameRounds } from '@source/types'
import type { RootState } from '@store/store'

import { answersReady, startRound, votesCounted } from '../games/actions'
import { logoutUser } from '../user/actions'

const gameRoundsAdapter = createEntityAdapter<IGameRounds>({
    selectId: (round) => round.id,
})

const initialState = gameRoundsAdapter.getInitialState({
    status: 'idle',
})

export const gameRoundsSlice = createSlice({
    name: 'gameRounds',
    initialState,
    reducers: {
        addRound: gameRoundsAdapter.addOne,
        updateRound: gameRoundsAdapter.updateOne,
        upsertRound: gameRoundsAdapter.upsertOne,
    },
    extraReducers: (builder) => {
        builder.addCase(logoutUser.fulfilled, (state) => {
            gameRoundsAdapter.removeAll(state)
            state.status = 'idle'
        })
        builder.addCase(startRound, (state, action) => {
            gameRoundsAdapter.upsertOne(state, action.payload.round)
        })
        builder.addCase(answersReady, (state, action) => {
            const combinedId = `${action.payload.gameId}-${action.payload.roundId}`
            const currentRound = state.entities[combinedId]
            if (currentRound != null) {
                currentRound.results = action.payload.results
            }
        })
        builder.addCase(votesCounted, (state, action) => {
            const combinedId = `${action.payload.gameId}-${action.payload.roundId}`
            const currentRound = state.entities[combinedId]
            if (currentRound != null)
                currentRound.results = action.payload.results
        })
    },
})

export default gameRoundsSlice.reducer
export const { selectIds: selectRoundsIds, selectAll: selectAllRounds } =
    gameRoundsAdapter.getSelectors((state: RootState) => state.gameRounds)

export const selectRoundById = createSelector(
    [
        selectAllRounds,
        (
            state: RootState,
            gameId: number | undefined,
            roundId: number | undefined
        ) => ({ gameId, roundId }),
    ],
    (rounds, { gameId, roundId }): IGameRounds | undefined =>
        gameId !== undefined && roundId !== undefined
            ? rounds.find((round) => round.id === `${gameId}-${roundId}`)
            : undefined
)
export const { addRound, updateRound, upsertRound } = gameRoundsSlice.actions
