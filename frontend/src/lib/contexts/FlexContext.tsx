import CephCircleSad from '@assets/bubbles/CephCircleSad.png'
import {
    type GameSchema,
    GameService,
    GameStatus,
    type PlayerGameSchema,
} from '@source/client'
import { GameManagerMessageTypes } from '@source/lib/constants'
import { useMessagingModal } from '@source/lib/contexts/MessagingContext'
import { getGameWSURL } from '@source/pages/Game/config'
import type { IGameRounds, IVote } from '@source/types'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { selectPlayersByGameId } from '@store/players/playersSlice'
import { getUserStatus } from '@store/user/actions'
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    ReadyState,
    type SendJsonMessage,
    type SendMessage,
    useWebSocket,
} from '../hooks/useWebSocket'
import {
    selectRoundById,
    upsertRound,
} from '../store/gameRounds/gameRoundsSlice'
import {
    answersReady,
    answerSubmitted,
    endGame,
    endVotes,
    joinedPlayer,
    leaveGame,
    newHost,
    startGame,
    startRound,
    votesCounted,
    voteSubmitted,
} from '../store/games/actions'
import { SelectGameById } from '../store/games/gamesSlice'
import type { RootState } from '../store/store'

interface LinkAndQR {
    link: string | null
    qrCode: string | null
}
//TODO: narrow down gameID to number or string
interface FlexContextProps {
    gameId?: number
    sendMessage: SendMessage
    sendJsonMessage: SendJsonMessage
    readyState: ReadyState
    setShareGameData: React.Dispatch<React.SetStateAction<LinkAndQR | null>>
    shareGameData: LinkAndQR | null
    players: PlayerGameSchema[]
    game?: GameSchema
    currentPlayer?: PlayerGameSchema
    handleHostFunctions: () => void
    endGameNow: () => void
    currentRound?: IGameRounds
    submitAnswer: (answer: string) => void
    endAnswersTime: () => void
    endVoting: () => void
    submitVote: (vote: IVote) => void
    startGameNow: () => void
    startRoundNow: () => void
    leaveGameNow: () => void
    time: number
}

const FlexContext = createContext<FlexContextProps | undefined>(undefined)

interface FlexProviderProps {
    children: React.ReactNode
}

const FlexContextProvider: React.FC<FlexProviderProps> = ({ children }) => {
    const { rawGameId } = useParams()
    const navigate = useNavigate()
    const { setModalState } = useMessagingModal()
    const dispatch = useAppDispatch()
    const [shareGameData, setShareGameData] = useState<LinkAndQR | null>(null)
    const [time, setTime] = useState(0)
    useEffect(() => {
        void dispatch(getUserStatus()) // this is necessary for players that are just creating a guest account to be logged in
    }, [dispatch])

    const gameId = rawGameId != null ? parseInt(rawGameId, 10) : undefined
    const user = useAppSelector((state) => state.user)
    const game = useAppSelector((state: RootState) =>
        SelectGameById(state, gameId)
    )
    const players = useAppSelector((state: RootState) =>
        selectPlayersByGameId(state, gameId)
    )
    const currentRound = useAppSelector((state: RootState) =>
        selectRoundById(state, game?.id, game?.currentRound)
    )
    const currentPlayer = players.find((p) => p.playerId === user.user?.id)

    const urlGenerator = useCallback(
        () => getGameWSURL(gameId, user.user?.id),
        [gameId, user.user?.id]
    )

    const getObjectReadyAndStringify = (
        type: string,
        data?: object
    ): string => {
        const message = { type, ...data }
        return JSON.stringify(message)
    }
    const { sendMessage, readyState, sendJsonMessage } = useWebSocket(
        urlGenerator,
        {
            reconnect: false,
            reconnectAttempts: 0,
            onMessage: messageParser,
            onOpenMessage: getObjectReadyAndStringify(
                GameManagerMessageTypes.JOINED_PLAYER
            ),
            onCloseMessage: getObjectReadyAndStringify(
                GameManagerMessageTypes.LEAVE_GAME
            ),
        }
    )
    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            sendMessage(
                getObjectReadyAndStringify(
                    GameManagerMessageTypes.JOINED_PLAYER
                )
            )
        }
    }, [readyState, sendMessage])

    useEffect(() => {
        const handleQueryJoin = async (): Promise<void> => {
            if (gameId == null) return
            const handlePlayerJoin = async (): Promise<void> => {
                try {
                    if (gameId != null) {
                        const response = await GameService.joinGame(gameId)
                        if (response.message === 'gameEnded') {
                            navigate(`/game`)
                            setModalState({
                                isOpen: true,
                                message: 'This game has already ended!',
                                img: CephCircleSad,
                                title: 'Game ended!',
                                type: 'error',
                                optionalProps: {},
                                withFooter: false,
                            })
                            return
                        }
                        if (response.message === 'gameStarted') {
                            if (response.round != null)
                                dispatch(
                                    upsertRound(response.round as IGameRounds)
                                )
                        }
                        if (response.message === 'lobby') {
                            setShareGameData({
                                qrCode: response.qrCode ?? null,
                                link: response.link,
                            })
                        }
                        setTime(response?.game?.timeLimitAnswer ?? 0)
                    }
                } catch (error) {
                    console.error('Error joining game', error)
                    setModalState({
                        isOpen: true,
                        message:
                            'There was an error joining the game.  Please try again or contact us for support.',
                        img: CephCircleSad,
                        title: 'Error!',
                        type: 'error',
                        optionalProps: {},
                        withFooter: false,
                    })
                }
            }
            await handlePlayerJoin()
        }
        void handleQueryJoin()
    }, [gameId, dispatch, navigate, setModalState])

    function messageParser(event: WebSocketEventMap['message']): void {
        const message = event.data
        const parsedMessage = message === 'ping' ? message : JSON.parse(message)
        if (parsedMessage === 'ping' || parsedMessage.type === 'pong') {
            return
        }
        switch (parsedMessage.type) {
            case GameManagerMessageTypes.JOINED_PLAYER: {
                dispatch(joinedPlayer({ messageData: parsedMessage.data }))
                break
            }
            case GameManagerMessageTypes.START_GAME: {
                dispatch(startGame({ messageData: parsedMessage.data }))
                break
            }
            case GameManagerMessageTypes.ANSWERS_READY: {
                // game status voting, set answers
                dispatch(answersReady({ messageData: parsedMessage.data }))
                break
            }
            case GameManagerMessageTypes.LEAVE_GAME: {
                dispatch(leaveGame({ messageData: parsedMessage.data }))
                break
            }
            case GameManagerMessageTypes.END_GAME: {
                dispatch(endGame({ messageData: parsedMessage.data }))
                break
            }
            case GameManagerMessageTypes.NEW_HOST: {
                dispatch(newHost({ messageData: parsedMessage.data }))
                break
            }
            case GameManagerMessageTypes.START_ROUND: {
                dispatch(startRound({ messageData: parsedMessage.data }))
                break
            }
            case GameManagerMessageTypes.ANSWER_SUBMITTED: {
                dispatch(answerSubmitted({ messageData: parsedMessage.data }))
                break
            }
            case GameManagerMessageTypes.VOTE_SUBMITTED: {
                dispatch(voteSubmitted({ messageData: parsedMessage.data }))
                break
            }
            //TODO: check if this case does anything, seems not?
            case GameManagerMessageTypes.END_VOTES: {
                dispatch(endVotes({ messageData: parsedMessage.data }))
                break
            }
            case GameManagerMessageTypes.ERROR: {
                setModalState({
                    isOpen: true,
                    message: parsedMessage.data.message,
                    img: CephCircleSad,
                    title: 'Error',
                    type: 'error',
                    optionalProps: {},
                    withFooter: false,
                })
                break
            }
            case GameManagerMessageTypes.MESSAGE_RESPONSE: {
                if (parsedMessage.content === 'ENDING_ROUND') {
                }
                break
            }
            case GameManagerMessageTypes.VOTES_COUNTED: {
                dispatch(votesCounted({ messageData: parsedMessage.data }))
                break
            }
            default: {
                if (parsedMessage === 'ping') {
                } else {
                }
                break
            }
        }
    }

    const submitAnswer = (answer: string): void => {
        const messageType = GameManagerMessageTypes.SUBMIT_ANSWER
        const data = {
            answer,
        }
        const message = { type: messageType, ...data }
        sendJsonMessage(message)
    }

    const submitVote = (vote: IVote): void => {
        const messageType = GameManagerMessageTypes.SUBMIT_VOTE
        const message = { type: messageType, vote }
        sendJsonMessage(message)
    }

    const endGameNow = (): void => {
        sendJsonMessage({ type: GameManagerMessageTypes.END_GAME })
    }
    const endAnswersTime = (): void => {
        sendJsonMessage({ type: GameManagerMessageTypes.END_ANSWERS })
    }

    const endVoting = (): void => {
        sendJsonMessage({ type: GameManagerMessageTypes.END_VOTES })
    }

    const startRoundNow = (): void => {
        sendJsonMessage({ type: GameManagerMessageTypes.START_ROUND })
    }

    const startGameNow = (): void => {
        sendJsonMessage({ type: GameManagerMessageTypes.START_GAME })
    }

    const leaveGameNow = (): void => {
        sendJsonMessage({ type: GameManagerMessageTypes.LEAVE_GAME })
    }

    //TODO: Refactor this, too much repetition between mobile and regular version
    const handleHostFunctions = (): void => {
        if (
            game?.status === GameStatus.WAITING_FOR_ROUND_START &&
            game.currentRound != null &&
            game.currentRound < game.rounds
        ) {
            startRoundNow()
            return
        }
        if (
            (game?.status === GameStatus.WAITING_FOR_ROUND_START ||
                game?.status === GameStatus.POST_VOTING) &&
            game.currentRound <= game.rounds
        ) {
            startRoundNow()
            return
        }
        if (game?.status === GameStatus.VOTING) {
            endVoting()
            return
        }
        if (game?.status === GameStatus.ANSWERING) {
            endAnswersTime()
            return
        }
        if (game?.status === GameStatus.IN_GAME) {
            endAnswersTime()
        }
        if (game?.status === GameStatus.POST_ANSWERING) {
            if (game.currentRound != null && game.currentRound < game.rounds) {
                startRoundNow()
            } else {
                endGameNow()
            }
        }
        // startRoundNow()
    }
    return (
        <FlexContext.Provider
            value={{
                sendMessage,
                sendJsonMessage,
                readyState,
                gameId,
                game,
                shareGameData,
                setShareGameData,
                players,
                handleHostFunctions,
                currentPlayer,
                endGameNow,
                currentRound,
                submitAnswer,
                endAnswersTime,
                endVoting,
                submitVote,
                startGameNow,
                startRoundNow,
                leaveGameNow,
                time,
            }}
        >
            {children}
        </FlexContext.Provider>
    )
}

const useFlexContext = (): FlexContextProps => {
    return useContext(FlexContext)
}

export { FlexContextProvider }
export { FlexContext }
export { useFlexContext }
