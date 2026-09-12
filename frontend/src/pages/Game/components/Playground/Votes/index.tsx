import type { GameStatus } from '@source/client'
import FullMarkDown from '@source/common/FullMarkDown'
import { Loading } from '@source/common/InfoComponents/Loading'
import type {
    GameRoundResultsSchema,
    IAnswers,
    ITimerState,
    IVote,
} from '@source/types'
import { shuffleArray } from '@utils/functions'
import React, { useEffect, useMemo, useState } from 'react'

interface VotesProps {
    results: GameRoundResultsSchema[]
    userId: number
    userName: string
    timerState: ITimerState
    round: number
    gameState: GameStatus
    endVoting: () => void
    submitVote: (vote: IVote) => void
}

const Votes: React.FC<VotesProps> = ({
    results,
    userName,
    userId,
    timerState,
    round,
    gameState,
    endVoting,
    submitVote,
}) => {
    const [shuffledVotes, setShuffledVotes] = useState<IAnswers[]>([])

    const extractAnswersFromResults = (
        results: GameRoundResultsSchema[]
    ): IAnswers[] => {
        return useMemo(() => {
            return results.map((result) => {
                const answerObject: IAnswers = {}

                if (typeof result.gameQuestion.answer === 'string') {
                    answerObject[result.id] = result.gameQuestion.answer ?? ''
                }
                return answerObject
            })
        }, [results])
    }

    const answers = extractAnswersFromResults(results)
    useEffect(() => {
        if (
            gameState === 'Voting' &&
            timerState.state === 'ended' &&
            timerState.context === 'vote'
            //&& answers != null
        ) {
            endVoting()
        }
    }, [gameState, timerState, endVoting])

    useEffect(() => {
        if (answers != null) {
            setShuffledVotes(shuffleArray(answers))
        }
    }, [answers])

    if (answers == null) return <Loading />

    return (
        <>
            {shuffledVotes.map((item, index) => (
                <div
                    onClick={() => {
                        const vote = {
                            round,
                            voteId: Object.keys(item)[0] ?? '0',
                            voteText: item[Object.keys(item)[0] ?? -1] ?? '',
                            playerId: userId,
                            username: userName,
                        }
                        submitVote(vote)
                    }}
                    className={
                        ' my-4  w-fit max-w-[95%] cursor-pointer overflow-auto rounded-3xl bg-blaze-orange px-[18px] py-[6px] hover:scale-105 md:max-w-none lg:mx-10'
                    }
                    key={index}
                >
                    <FullMarkDown
                        content={
                            item[Object.keys(item)[0] ?? -1] ?? 'No content'
                        }
                    />
                </div>
            ))}
        </>
    )
}

export { Votes }
