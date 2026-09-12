import { HandThumbUpIcon } from '@heroicons/react/24/outline'
import FullMarkDown from '@source/common/FullMarkDown'
import type { GameRoundResultsSchema } from '@source/types'
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface PostVotesProps {
    votes: GameRoundResultsSchema[]
}

interface DetailedVote extends GameRoundResultsSchema {
    votedForBy: number[]
}
const PostVotes: React.FC<PostVotesProps> = ({ votes }) => {
    const [details, setDetails] = useState<DetailedVote[]>([])

    useEffect(() => {
        const newArray = votes.map((obj) => {
            // Find the ids of players that voted for this answer
            const votedForBy = votes
                .filter((voteObj) => voteObj.voteId === obj.id)
                .map((voteObj) => voteObj.playerId)
                .filter((playerId) => playerId !== null)

            // Create a new object with the additional voted_for_by property
            return {
                ...obj,
                votedForBy,
            }
        })
        setDetails(newArray)
    }, [votes])

    return (
        <div className="grid xl:grid-cols-2">
            {details?.map(
                (item, index) =>
                    item.answer !== '' && (
                        <div
                            key={index}
                            className={
                                'flex max-w-[340px] items-center gap-x-[10px] sm:max-w-none'
                            }
                        >
                            <div
                                className={twMerge(
                                    'lg:mx-2 my-4 w-full rounded-3xl bg-blaze-orange px-[18px]  py-[6px] ',
                                    item.gameQuestion.isCorrectAnswer === true
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                )}
                            >
                                <div className="mb-2 flex w-fit items-center gap-2 rounded-full border-2 border-white px-4 py-1">
                                    <HandThumbUpIcon className="size-4" />
                                    <div className="whitespace-nowrap">
                                        votes: {item.votedForBy.length}
                                    </div>
                                </div>
                                <FullMarkDown
                                    content={
                                        typeof item.gameQuestion.answer ===
                                        'string'
                                            ? item.gameQuestion.answer
                                            : 'No answer available'
                                    }
                                />
                            </div>
                        </div>
                    )
            )}
        </div>
    )
}
export { PostVotes }
