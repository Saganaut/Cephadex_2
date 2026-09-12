import {
    createEntityAdapter,
    createSelector,
    createSlice,
} from '@reduxjs/toolkit'
import {
    ConnectionStatus,
    type PlayerGameSchema,
    PlayerStatus,
} from '@source/client'
import type { GameRoundResultsSchema } from '@source/types'
import type { RootState } from '@store/store'

import {
    answersReady,
    answerSubmitted,
    disconnectedPlayer,
    joinedPlayer,
    leaveGame,
    newHost,
    removedPlayer,
    startRound,
    votesCounted,
    voteSubmitted,
} from '../games/actions'
import { logoutUser } from '../user/actions'

const playersAdapter = createEntityAdapter<PlayerGameSchema>({
    selectId: (player) => player.id,
})

const {
    selectAll: selectAllPlayers,
    selectEntities: selectPlayerEntities,
    selectById: selectPlayerById,
} = playersAdapter.getSelectors((state: RootState) => state.players)

const initialState = playersAdapter.getInitialState({})

export const playersSlice = createSlice({
    name: 'players',
    initialState,

    reducers: {
        addPlayer: playersAdapter.addOne,
        updatePlayer: playersAdapter.updateOne,
        removePlayer: playersAdapter.removeOne,
        clearPlayers: playersAdapter.removeAll,
        upsertPlayer: playersAdapter.upsertOne,
        upsertPlayers: playersAdapter.upsertMany,
    },

    extraReducers: (builder) => {
        builder.addCase(newHost, (state, action) => {
            const combinedPlayerId = `${action.payload.gameId}-${action.payload.newHostPlayerId}`
            const player = state.entities[combinedPlayerId]
            const oldHost = Object.values(state.entities).find((p) => p?.isHost)
            if (oldHost != null) {
                state.entities[oldHost.id] = {
                    ...oldHost,
                    isHost: false,
                    connectionStatus: ConnectionStatus.DISCONNECTED,
                }
            }
            if (oldHost != null) {
                oldHost.isHost = false
            }
            if (player != null) {
                state.entities[combinedPlayerId] = { ...player, isHost: true }
            }
        })
        builder.addCase(logoutUser.fulfilled, (state) => {
            playersAdapter.removeAll(state)
        })
        builder.addCase(joinedPlayer, (state, action) => {
            playersAdapter.upsertMany(state, action.payload.players)
        })
        builder.addCase(addPlayer, (state, action) => {
            playersAdapter.upsertOne(state, action.payload)
        })
        builder.addCase(answerSubmitted, (state, action) => {
            const player = state.entities[action.payload.playerId]
            if (player != null) {
                player.status = PlayerStatus.PLAYED
            }
        })
        builder.addCase(removedPlayer, (state, action) => {
            const combinedPlayerId = `${action.payload.gameId}-${action.payload.playerId}`
            const player = state.entities[combinedPlayerId]
            if (player != null) {
                removePlayer(player.id)
            }
        })
        builder.addCase(leaveGame, (state, action) => {
            const player = state.entities[action.payload.playerId]
            if (player != null)
                player.connectionStatus = ConnectionStatus.DISCONNECTED
        })
        builder.addCase(voteSubmitted, (state, action) => {
            const player = state.entities[action.payload.playerId]
            if (player != null) {
                player.status = PlayerStatus.VOTED
            }
        })
        builder.addCase(disconnectedPlayer, (state, action) => {
            const player = state.entities[action.payload.playerId]
            if (player != null) {
                player.status = PlayerStatus.ABSENT
                player.connectionStatus = ConnectionStatus.DISCONNECTED
            }
        })
        builder.addCase(startRound, (state, action) => {
            const players = Object.values(state.entities).filter(
                (player): player is PlayerGameSchema => {
                    return (
                        player !== undefined &&
                        player.gameId === action.payload.round.gameId
                    )
                }
            )
            if (players.length > 0) {
                players.forEach((player) => {
                    player.status = PlayerStatus.PLAYING
                })
            }
        })
        builder.addCase(answersReady, (state, action) => {
            const players = Object.values(state.entities).filter(
                (player): player is PlayerGameSchema => {
                    return (
                        player !== undefined &&
                        player.gameId === action.payload.gameId
                    )
                }
            )
            const playerGamesList = convertResultsToPlayers(
                action.payload.results
            )
            if (players.length > 0) {
                players.forEach((player) => {
                    const updatedPlayerData = playerGamesList.find(
                        (updatedPlayer) => updatedPlayer.id === player.id
                    )
                    if (
                        updatedPlayerData != null &&
                        player.gameType === 'classic'
                    ) {
                        state.entities[player.id] = {
                            ...player,
                            totalPoints:
                                (player.totalPoints ?? 0) +
                                (updatedPlayerData.totalPoints ?? 0),
                            totalPointsAnswer:
                                (player.totalPointsAnswer ?? 0) +
                                (updatedPlayerData.totalPointsAnswer ?? 0),
                            totalPointsDeceiver:
                                (player.totalPointsDeceiver ?? 0) +
                                (updatedPlayerData.totalPointsDeceiver ?? 0),
                            status: PlayerStatus.READY,
                        }
                    }
                    if (
                        updatedPlayerData != null &&
                        player.gameType === 'flex'
                    ) {
                        state.entities[player.id] = {
                            ...player,
                            status: PlayerStatus.PLAYING,
                        }
                    }
                })
            }
        })
        builder.addCase(votesCounted, (state, action) => {
            const players = Object.values(state.entities).filter(
                (player): player is PlayerGameSchema => {
                    return (
                        player !== undefined &&
                        player.gameId === action.payload.gameId
                    )
                }
            )

            const playerGamesList = convertResultsToPlayers(
                action.payload.results
            )
            if (players.length > 0) {
                players.forEach((player) => {
                    const updatedPlayerData = playerGamesList.find(
                        (updatedPlayer) => updatedPlayer.id === player.id
                    )
                    if (updatedPlayerData != null) {
                        state.entities[player.id] = {
                            ...player,
                            totalPoints:
                                (player.totalPoints ?? 0) +
                                (updatedPlayerData.totalPoints ?? 0),
                            totalPointsAnswer:
                                (player.totalPointsAnswer ?? 0) +
                                (updatedPlayerData.totalPointsAnswer ?? 0),
                            totalPointsDeceiver:
                                (player.totalPointsDeceiver ?? 0) +
                                (updatedPlayerData.totalPointsDeceiver ?? 0),
                            status: PlayerStatus.READY,
                        }
                    }
                })
            }
        })
    },
})

export const { addPlayer, updatePlayer, removePlayer, clearPlayers } =
    playersSlice.actions

export default playersSlice.reducer

//TODO: Figure out how to remove this type assertion
export const selectPlayersByGameId = createSelector(
    [
        selectAllPlayers,
        (state: RootState, gameId: number | undefined) => gameId,
    ],
    (players, gameId): PlayerGameSchema[] =>
        gameId != null
            ? players.filter((player) => player.gameId === gameId)
            : []
)

function convertResultsToPlayers(
    results: GameRoundResultsSchema[]
): Array<Partial<PlayerGameSchema>> {
    const playerGamesList: Array<Partial<PlayerGameSchema>> = []
    results.map((p) => {
        const player = {
            id: `${p.gameId}-${p.playerId}`,
            playerId: p.playerId,
            gameId: p.gameId,
            totalPoints: p.totalPoints,
            totalPointsAnswer: p.pointsAnswer,
            totalPointsDeceiver: p.pointsDeceiver,
        }
        playerGamesList.push(player)
    })
    return playerGamesList
}
