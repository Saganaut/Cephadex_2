import { GameStatus } from '@source/client'
import { type IGameRounds, type ITimerState, RoundStatus } from '@source/types'
import React, { useEffect, useState } from 'react'

import { McqAnswerInput } from './McqAnswerInput'
import TextAnswerInput from './TextAnswerInput'

interface AnswerInputProps {
    username: string | null | undefined
    gameState: GameStatus
    userId: number | null | undefined
    gameId: number | undefined
    timerState: ITimerState
    submitAnswer: (answer: string) => void
    endAnswersTime: () => void
    currentRound: IGameRounds
    gameType: string
}
const AnswerInput: React.FC<AnswerInputProps> = ({
    username,
    timerState,
    gameState,
    submitAnswer,
    endAnswersTime,
    currentRound,
    gameType,
}) => {
    // const socketRef = useRef<WebSocket | null>(null);
    const [answer, setAnswer] = useState('')
    const [canAnswer, setCanAnswer] = useState(true)

    useEffect(() => {
        if (currentRound.status === RoundStatus.AnswersSubmitted) {
            const handleRoundEnd = (answer: string): void => {
                submitAnswer(answer)
                setCanAnswer(false)
            }
            handleRoundEnd(answer)
        }
    }, [currentRound.status, answer, submitAnswer])

    const handleSubmitAnswer = (endAnswers: boolean): void => {
        submitAnswer(answer)
        setCanAnswer(false)

        if (
            timerState.state === 'ended' ||
            gameState === GameStatus.VOTING ||
            (gameState === GameStatus.IN_GAME && endAnswers)
        ) {
            endAnswersTime()
        }
    }
    useEffect(() => {
        if (timerState.state === 'ended') {
            handleSubmitAnswer(true)
        }
        if (timerState.state === 'idle') {
            setAnswer('')
            setCanAnswer(true)
        }
    }, [timerState.state])

    return (
        <>
            {gameType === 'flex' ? (
                <TextAnswerInput
                    username={username ?? 'username not found'}
                    answer={answer}
                    setAnswer={setAnswer}
                    handleSubmitAnswer={handleSubmitAnswer}
                    canAnswer={canAnswer}
                />
            ) : (
                <McqAnswerInput
                    username={username ?? 'username not found'}
                    answer={answer}
                    setAnswer={setAnswer}
                    handleSubmitAnswer={handleSubmitAnswer}
                    canAnswer={canAnswer}
                    currentRound={currentRound}
                />
            )}
        </>
    )
}
export { AnswerInput }
