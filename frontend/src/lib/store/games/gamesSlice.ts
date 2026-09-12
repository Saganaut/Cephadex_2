import {
    createEntityAdapter,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit'
import type { GameSchema } from '@source/client'
import type { RootState } from '@store/store'

import { logoutUser } from '../user/actions'
import {
    answersReady,
    endGame,
    joinedPlayer,
    newHost,
    startGame,
    startRound,
    votesCounted,
} from './actions'

const gamesAdapter = createEntityAdapter<GameSchema>({
    selectId: (game) => game.id,
})

const initialState = gamesAdapter.getInitialState({
    status: 'idle',
})

export const gamesSlice = createSlice({
    name: 'games',
    initialState,

    reducers: {
        addGame: gamesAdapter.addOne,
        updateGame: gamesAdapter.updateOne,
        removeGame: gamesAdapter.removeOne,
        clearGames: gamesAdapter.removeAll,
        upsertGame: gamesAdapter.upsertOne,
    },
    extraReducers: (builder) => {
        builder.addCase(logoutUser.fulfilled, (state) => {
            gamesAdapter.removeAll(state)
            state.status = 'idle'
        })
        builder.addCase(joinedPlayer, (state, action) => {
            gamesAdapter.upsertOne(state, action.payload.game)
        })
        builder.addCase(startGame, (state, action) => {
            gamesAdapter.upsertOne(state, action.payload.game)
            const currentGame = state.entities[action.payload.game.id]
            if (currentGame != null) {
                currentGame.status = action.payload.game.status
            }
        })
        builder.addCase(startRound, (state, action) => {
            const currentGame = state.entities[action.payload.round.gameId]
            if (currentGame != null) {
                currentGame.currentRound = action.payload.round.roundId
                currentGame.status = action.payload.gameStatus
            }
        })
        builder.addCase(answersReady, (state, action) => {
            const currentGame = state.entities[action.payload.gameId]
            if (currentGame != null) {
                currentGame.status = action.payload.gameStatus
                // if (currentGame.gameType === 'flex') {
                //     currentGame.status = GameStatus.VOTING
                //     return
                // }
                // currentGame.status = GameStatus.POST_ANSWERING
            }
        })
        builder.addCase(votesCounted, (state, action) => {
            const currentGame = state.entities[action.payload.gameId]
            if (currentGame != null) {
                currentGame.status = action.payload.gameStatus

                // currentGame.status = GameStatus.POST_VOTING
            }
        })
        builder.addCase(endGame, (state, action) => {
            const currentGame = state.entities[action.payload.gameId]

            if (currentGame != null) {
                currentGame.status = action.payload.game.status

                // currentGame.status = GameStatus.ENDED
            }
        })
        builder.addCase(newHost, (state, action) => {
            const currentGame = state.entities[action.payload.gameId]
            if (currentGame != null) {
                currentGame.host = action.payload.newHostPlayerId
            }
        })
    },
})

export default gamesSlice.reducer

const { selectAll: selectAllGames } = gamesAdapter.getSelectors(
    (state: RootState) => state.games
)

export const SelectGameById = createSelector(
    [selectAllGames, (state: RootState, gameId: number | undefined) => gameId],
    (games, gameId): GameSchema | undefined =>
        gameId !== undefined
            ? games.find((game) => game.id === gameId)
            : undefined
)
