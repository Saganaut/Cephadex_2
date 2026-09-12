import type { UserSchema } from '@source/client'
import type { QuizResultSchema } from '@source/client/models/QuizResultSchema'
import React from 'react'

import { ResultItem } from '../ResultItem'

interface HubResultsProps {
    quizResults: QuizResultSchema[]
    quizId: string
    user: UserSchema
    resultsTab: number
}

const HubResults: React.FC<HubResultsProps> = ({
    quizResults,
    quizId,
    resultsTab,
    user,
}) => {
    const myResults = quizResults
        .filter((result) => result !== undefined)
        .filter((result) => user?.id !== result?.creator)

    const myStudentsResults = quizResults
        .filter((result) => result !== undefined)
        .filter((result) => user?.id === result?.creator)

    return (
        <>
            <div className="mt-[20px]">
                {resultsTab === 0 &&
                    myResults.map((result) => (
                        <ResultItem
                            key={result.id}
                            result={result}
                            quizId={quizId}
                        />
                    ))}
                {resultsTab === 0 && myResults.length === 0 && (
                    <p>No results available.</p>
                )}
            </div>

            <div className="mt-[20px]">
                {resultsTab === 1 &&
                    myStudentsResults.map((result) => (
                        <ResultItem
                            key={result.id}
                            result={result}
                            quizId={quizId}
                        />
                    ))}
                {resultsTab === 1 && myStudentsResults.length === 0 && (
                    <p>No results available.</p>
                )}
            </div>
        </>
    )
}

export { HubResults }
