// import { ArrowRightCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid'
import usePlaySound from '@hooks/usePlaySound'
import { GameStatus } from '@source/client'
import { Waves } from '@source/common/Animations/loaders/waves'
// import { IconButton } from '@source/common/Buttons/IconButton'
import { Loading } from '@source/common/InfoComponents/Loading'
import { PageWrapper } from '@source/common/PageWrapper'
import { GameManagerMessageTypes } from '@source/lib/constants'
import { useFlexContext } from '@source/lib/contexts/FlexContext'
import { PlayersList } from '@source/pages/Game/components/Lobby/PlayersList'
import { AnswerInput } from '@source/pages/Game/components/Playground/components/AnswerInput'
import { CTA } from '@source/pages/Game/components/Playground/CTA'
import { Votes } from '@source/pages/Game/components/Playground/Votes'
import { PostVotes } from '@source/pages/Game/components/Playground/Votes/PostVotes'
import type { ITimerState } from '@source/types'
import React, { useEffect, useState } from 'react'

import { AnswerResults } from './components/AnswerResults'
import { QuestionHeader } from './components/QuestionHeader'
import { MobileBottomCTA } from './CTA/MobileBottomCTA'

const Playground: React.FC = () => {
    const [timerState, setTimerState] = useState<ITimerState>({
        state: 'idle',
        context: 'game',
    })
    const {
        game,
        players,
        sendMessage,
        handleHostFunctions,
        currentPlayer,
        currentRound,
        submitAnswer,
        endGameNow,
        endAnswersTime,
        endVoting,
        submitVote,
    } = useFlexContext()

    const handleQuitGame = (): void => {
        sendMessage(GameManagerMessageTypes.LEAVE_GAME)
    }

    // Logic for the sound
    const { unmute, mute, muted, start, pause } = usePlaySound()
    const [label, setLabel] = useState('Start Round')

    useEffect(() => {
        if (
            game?.status === GameStatus.IN_GAME ||
            game?.status === GameStatus.VOTING
        ) {
            start()
        } else {
            pause()
        }
        if (game?.status === GameStatus.ENDED) {
            pause()
        }
        return () => {
            pause()
        }
    }, [game?.status, pause, start])

    useEffect(() => {
        if (game == null) return
        if (game.timeLimitAnswer === 0 || game.timeLimitAnswer === null) return
        if (game.status === GameStatus.WAITING_FOR_ROUND_START) {
            setTimerState({ state: 'idle', context: 'game' })
        } else if (game.status === GameStatus.ANSWERING) {
            setTimerState({ state: 'going', context: 'game' })
        } else if (game.status === GameStatus.VOTING) {
            setSeconds(game?.timeLimitAnswer ?? 0)

            setTimerState({ state: 'going', context: 'vote' })
        } else {
            setTimerState({ state: 'idle', context: 'game' })
        }
    }, [game?.status, game?.timeLimitAnswer, game])

    useEffect(() => {
        if (game == null) return
        if (game.status === GameStatus.WAITING_FOR_ROUND_START) {
            setLabel('Start Round')
        }
        if (game.status === GameStatus.VOTING) {
            setLabel('End Voting')
        }
        if (game.status === GameStatus.ANSWERING) {
            setLabel('End Round')
        }
        if (game.status === GameStatus.POST_VOTING) {
            setLabel('Next Round')
        }
        if (game.status === GameStatus.IN_LOBBY) {
            setLabel('Start Round')
        }
        if (game.status === GameStatus.POST_ANSWERING) {
            setLabel('Next Round')
        }
        if (
            game.currentRound != null &&
            game.currentRound >= game.rounds &&
            game.status === GameStatus.POST_VOTING
        ) {
            setLabel('End Game')
        }
    }, [game?.status, game?.rounds, game?.currentRound, game])

    const [seconds, setSeconds] = useState(game?.timeLimitAnswer ?? 0)
    // If the timer is idle, set the seconds to the initial seconds
    useEffect(() => {
        if (timerState.state === 'idle') {
            setSeconds(game?.timeLimitAnswer ?? 0)
        }
    }, [timerState, game?.timeLimitAnswer])

    useEffect(() => {
        if (game == null) return
        if (game?.timeLimitAnswer === 0 || game?.timeLimitAnswer == null) {
            if (game.status === GameStatus.IN_GAME) {
                setTimerState({ state: 'idle', context: 'game' })
            }
            if (game.status === GameStatus.VOTING) {
                setTimerState({ state: 'idle', context: 'vote' })
            }
        }
    }, [game?.timeLimitAnswer, game?.status, game])

    useEffect(() => {
        if (timerState.state === 'idle') return

        const intervalId = setInterval(() => {
            if (seconds > 0) {
                setSeconds((prevSeconds) => prevSeconds - 1)
            } else {
                clearInterval(intervalId)
            }
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [timerState, seconds])

    useEffect(() => {
        if (game == null) return
        if (seconds === 0 && timerState.state === 'going') {
            if (game.status === GameStatus.ANSWERING) {
                setTimerState({ state: 'ended', context: 'game' })
                setSeconds(game?.timeLimitAnswer)
                endAnswersTime()
                return
            } else if (game.status === GameStatus.VOTING) {
                setTimerState({ state: 'ended', context: 'vote' })
                setSeconds(game?.timeLimitAnswer)
                endVoting()
                return
            }
            if (timerState.context === 'quiz') {
                setTimerState({ state: 'ended', context: 'quiz' })
                setSeconds(game?.timeLimitAnswer)
                return
            }
        }
        if (timerState.state === 'going' && seconds > 0) {
            if (game.status === GameStatus.IN_GAME) {
                setTimerState({ state: 'going', context: 'game' })
            } else if (game.status === GameStatus.VOTING) {
                setTimerState({ state: 'going', context: 'vote' })
            }
        }
    }, [
        seconds,
        game?.status,
        endAnswersTime,
        endVoting,
        game,
        timerState.context,
        timerState.state,
    ])

    if (game == null) {
        return <Loading />
    }
    if (currentPlayer == null) {
        return <Loading />
    }
    if (players.length <= 0) {
        return <Loading />
    }

    return (
        <PageWrapper>
            <div
                className={
                    'absolute bottom-0 left-0 z-[5] h-[30vh] w-full bg-playground bg-cover bg-center bg-no-repeat'
                }
            />
            <div
                className={
                    ' relative z-10 flex size-full items-start rounded-[18px] border-2 border-mariana-blue bg-transparent p-[12px] sm:border-[10px] lg:mx-9 lg:gap-x-[12px]'
                }
            >
                <div className={'h-full'}>
                    <PlayersList
                        handleQuitGame={handleQuitGame}
                        players={players}
                        innerButtons={
                            <MobileBottomCTA
                                label={label}
                                endGame={endGameNow}
                                handleHostFunctions={handleHostFunctions}
                                isHost={currentPlayer.isHost ?? false}
                                gameState={game.status ?? GameStatus.IN_LOBBY}
                                seconds={seconds}
                            />
                        }
                    />
                </div>

                <div className={'flex size-full flex-col '}>
                    <CTA
                        label={label}
                        endGame={endGameNow}
                        handleHostFunctions={handleHostFunctions}
                        audioPlaying={muted}
                        mute={mute}
                        unmute={unmute}
                        setTimerState={setTimerState}
                        timerState={timerState}
                        isHost={currentPlayer.isHost ?? false}
                        timeLimitAnswer={game.timeLimitAnswer ?? 0}
                        rounds={game.rounds ?? 0}
                        currentRound={game.currentRound}
                        seconds={seconds}
                        gameState={game.status ?? GameStatus.IN_LOBBY}
                    />

                    {/*   Start Round */}

                    {currentPlayer.isHost === false &&
                        game?.status === GameStatus.WAITING_FOR_ROUND_START && (
                            <div
                                className={
                                    'flex size-full flex-col items-center justify-center pt-[80px]'
                                }
                            >
                                <h1>Waiting for the host to start the round</h1>
                                <Waves />
                            </div>
                        )}

                    <div
                        className={`h-full min-h-[200px]  ${
                            game.status === GameStatus.WAITING_FOR_ROUND_START
                                ? 'hidden'
                                : ''
                        }`}
                    >
                        {game.status === GameStatus.ANSWERING &&
                            currentRound != null && (
                                <QuestionHeader currentRound={currentRound} />
                            )}
                        {game.status === GameStatus.ANSWERING &&
                            currentRound != null && (
                                <div className={'flex h-[69%] gap-x-[22px]'}>
                                    <AnswerInput
                                        currentRound={currentRound}
                                        endAnswersTime={endAnswersTime}
                                        submitAnswer={submitAnswer}
                                        gameId={game.id}
                                        userId={currentPlayer.playerId}
                                        timerState={timerState}
                                        username={currentPlayer.username}
                                        gameState={game.status}
                                        gameType={game.gameType}
                                    />
                                </div>
                            )}
                        {game.status === GameStatus.POST_ANSWERING &&
                            currentRound != null && (
                                <AnswerResults results={currentRound.results} />
                            )}
                        {game.status === GameStatus.VOTING &&
                            currentRound != null && (
                                <Votes
                                    round={game.currentRound}
                                    endVoting={endVoting}
                                    submitVote={submitVote}
                                    gameState={game.status}
                                    timerState={timerState}
                                    results={currentRound.results}
                                    userId={currentPlayer.playerId}
                                    userName={currentPlayer.username}
                                />
                            )}
                        {game.status === GameStatus.POST_VOTING &&
                            currentRound != null && (
                                <PostVotes votes={currentRound.results ?? []} />
                            )}
                    </div>
                    {/* {currentPlayer.isHost === true &&
                        (game.status === GameStatus.WAITING_FOR_ROUND_START ||
                            game.status === GameStatus.POST_VOTING) && (
                            <div
                                className={
                                    'flex  size-full items-center justify-center sm:block '
                                }
                            >
                                <div
                                    className={'flex items-center gap-x-[8px]'}
                                >
                                    <div
                                        className={
                                            'flex size-[32px] items-center justify-center rounded-full bg-electric-violet'
                                        }
                                    >
                                        <PlayCircleIcon
                                            className={'size-[32px] text-white'}
                                        />
                                    </div>
                                    <IconButton
                                        icon={<ArrowRightCircleIcon />}
                                        onClick={() => {
                                            handleHostFunctions()
                                        }}
                                        classname={
                                            'w-full flex-row-reverse whitespace-nowrap h-10'
                                        }
                                        ariaLabel={label}
                                        to={''}
                                        theme={'orange'}
                                        collapse={false}
                                    />
                                </div>
                            </div>
                        )} */}
                </div>
            </div>
        </PageWrapper>
    )
}
export { Playground }
