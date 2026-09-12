import { createAction } from '@reduxjs/toolkit'
import type { GameSchema, GameStatus, PlayerGameSchema } from '@source/client'
import type { GameRoundResultsSchema, IGameRounds } from '@source/types'

interface IStartGame {
    game: GameSchema
    players: PlayerGameSchema[]
}

interface IJoinedPlayer extends IStartGame {
    username: string
    playerId: number
}

interface IGameSignal {
    gameId: number
    playerId: number
    username: string
}

export const addPlayer = createAction(
    'games/addPlayer',
    ({ data }: { data: PlayerGameSchema }) => {
        return {
            payload: { player: data },
        }
    }
)

export const joinedPlayer = createAction(
    'games/joinedPlayer',
    ({ messageData }: { messageData: IJoinedPlayer }) => {
        return {
            payload: {
                game: messageData.game,
                players: messageData.players,
                username: messageData.username,
                playerId: messageData.playerId,
            },
        }
    }
)

export const startGame = createAction(
    'games/startGame',
    ({ messageData }: { messageData: IStartGame }) => {
        return {
            payload: {
                game: messageData.game,
                players: messageData.players,
            },
        }
    }
)

interface IStartRound {
    round: IGameRounds
    timeLimit: number
    gameStatus: GameStatus
}

export const startRound = createAction(
    'games/startRound',
    ({ messageData }: { messageData: IStartRound }) => {
        return {
            payload: {
                round: messageData.round,
                timeLimit: messageData.timeLimit,
                gameStatus: messageData.gameStatus,
            },
        }
    }
)

export const answerSubmitted = createAction(
    'games/answerSubmitted',
    ({ messageData }: { messageData: IGameSignal }) => {
        return {
            payload: {
                gameId: messageData.gameId,
                playerId: messageData.playerId,
                username: messageData.username,
                id: `${messageData.gameId}-${messageData.playerId}`,
            },
        }
    }
)

export const removedPlayer = createAction(
    'games/removedPlayer',
    ({ messageData }: { messageData: IGameSignal }) => {
        return {
            payload: {
                gameId: messageData.gameId,
                playerId: messageData.playerId,
                username: messageData.username,
                id: `${messageData.gameId}-${messageData.playerId}`,
            },
        }
    }
)
export const voteSubmitted = createAction(
    'games/voteSubmitted',
    ({ messageData }: { messageData: IGameSignal }) => {
        return {
            payload: {
                gameId: messageData.gameId,
                playerId: messageData.playerId,
                username: messageData.username,
                id: `${messageData.gameId}-${messageData.playerId}`,
            },
        }
    }
)
export const disconnectedPlayer = createAction(
    'games/disconnectedPlayer',
    ({ messageData }: { messageData: IGameSignal }) => {
        return {
            payload: {
                gameId: messageData.gameId,
                playerId: messageData.playerId,
                username: messageData.username,
                id: `${messageData.gameId}-${messageData.playerId}`,
            },
        }
    }
)

interface IRoundResultsWS {
    gameId: number
    roundId: number
    results: GameRoundResultsSchema[]
    gameStatus: GameStatus
}

export const answersReady = createAction(
    'games/answersReady',
    ({ messageData }: { messageData: IRoundResultsWS }) => {
        return {
            payload: {
                gameId: messageData.gameId,
                roundId: messageData.roundId,
                results: messageData.results,
                gameStatus: messageData.gameStatus,
            },
        }
    }
)

export const votesCounted = createAction(
    'games/votesCounted',
    ({ messageData }: { messageData: IRoundResultsWS }) => {
        return {
            payload: {
                gameId: messageData.gameId,
                roundId: messageData.roundId,
                results: messageData.results,
                gameStatus: messageData.gameStatus,
            },
        }
    }
)

interface IEndGameWS {
    results: PlayerGameSchema[]
    gameId: number
    game: GameSchema
}

export const endGame = createAction(
    'games/endGame',
    ({ messageData }: { messageData: IEndGameWS }) => {
        return {
            payload: {
                players: messageData.results,
                gameId: messageData.gameId,
                game: messageData.game,
            },
        }
    }
)
export const leaveGame = createAction(
    'games/leaveGame',
    ({ messageData }: { messageData: IGameSignal }) => {
        return {
            payload: {
                gameId: messageData.gameId,
                playerId: messageData.playerId,
                username: messageData.username,
                id: `${messageData.gameId}-${messageData.playerId}`,
            },
        }
    }
)

export const newHost = createAction(
    'games/newHost',
    ({ messageData }: { messageData: IGameSignal }) => {
        return {
            payload: {
                gameId: messageData.gameId,
                newHostUsername: messageData.username,
                newHostPlayerId: messageData.playerId,
                newHostId: `${messageData.gameId}-${messageData.playerId}`,
            },
        }
    }
)

//TODO: CHeck if necessary
export const endVotes = createAction(
    'games/endVotes',
    ({ messageData }: { messageData: unknown }) => {
        return {
            payload: {},
        }
    }
)
//TODO: CHeck if necessary
export const endingRound = createAction(
    'games/endingRound',
    ({ messageData }: { messageData: unknown }) => {
        return {
            payload: {},
        }
    }
)

// function convertServerPlayersTypeToClient(
//   players: PlayerGameSchema[],
//   game: GameSchema
// ): IPlayer[] {
//   const updatedPlayers: Unknown[] = players.map((p) => ({
//     ...p,
//     id: `${game.id}-${p.playerId}`, // probably wont be necessary after backend modifications
//     gameId: game.id,
//     isPlayer: true,
//     color: getRandomItem(bgColors) ?? "bg-electric-violet",
//     pointsAnswer: p.pointsAnswer ?? 0,
//     pointsDeceiver: p.pointsDeceiver ?? 0,
//     isOnline: true,
//   }));
//   return updatedPlayers;
// }

// function convertSeverGameTypeToClient(gameData: GameSchema): IGame {
//     const gameType = gameData.currentQuestion.type

//     if (!Object.values(GameTypes).includes(gameType)) {
//         throw new Error(`Invalid game type: ${gameType}`)
//     }

//     const validatedGameType = gameType
//     const validStates: Array<IGameState['state']> = [
//         'WaitingForRoundStart',
//         'Voting',
//         'PostVoting',
//         'InGame',
//         'InLobby',
//         'Ended',
//     ]

//     const status: IGameState['state'] = validStates.includes(
//         gameData.status as IGameState['state']
//     )
//         ? (gameData.status as IGameState['state'])
//         : 'InGame'
//     const newGame = {
//         id: gameData.id,
//         type: validatedGameType,
//         creator: gameData.creator,
//         creatorUsername: gameData.creatorUsername,
//         currentHostUsername: gameData.hostUsername ?? gameData.creatorUsername,
//         currentHost: gameData.host ?? gameData.creator,
//         deckId: gameData.deckId,
//         rounds: gameData.rounds,
//         timeLimit: gameData.timeLimitAnswer,
//         timeLimitVote: gameData.timeLimitAnswer,
//         timeCreated: gameData.timeCreated,
//         startTime: gameData.startTime,
//         currentRound: gameData.currentRound,
//         status,
//         pointsCorrect: gameData.pointsCorrect,
//         pointsDeceiver: gameData.pointsDeceiver,
//         hostUsername: gameData.hostUsername ?? gameData.creatorUsername,
//     }

//     return newGame
// }
