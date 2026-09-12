import type { GameRoundResultsSchema } from '@source/types'
import React from 'react'

import { AnswerResultsOption } from './AnswerResultsOption'

interface AnswerResultsProps {
    results: GameRoundResultsSchema[]
}

interface ProcessedResult {
    optionText: string
    totalQtyPlayersChoseAnswer: number
    isCorrect: boolean
}

const AnswerResults: React.FC<AnswerResultsProps> = ({ results }) => {
    const [processedResults, setProcessedResults] = React.useState<
        ProcessedResult[]
    >([])

    const correctResult = results.find((result) => result.isCorrect === true)
    const remainingResults = results.filter(
        (result) => result.isCorrect === false
    )
    React.useEffect(() => {
        if (
            typeof correctResult?.gameQuestion.answer === 'string' ||
            correctResult?.gameQuestion.answer === undefined ||
            correctResult?.gameQuestion?.answer?.correctOption === undefined ||
            typeof correctResult?.gameQuestion?.answer === 'string'
        )
            return
        const newResults: ProcessedResult[] =
            correctResult?.gameQuestion.answer?.options.map((option) => {
                const totalQtyPlayersChoseAnswer = remainingResults.filter(
                    (result) => result.gameQuestion.answer === option
                ).length
                return {
                    optionText: option,
                    totalQtyPlayersChoseAnswer,
                    isCorrect:
                        correctResult?.gameQuestion.answer?.correctOption === // this should not be an issue as we are checking above
                        option,
                }
            })
        newResults.sort(
            (a, b) =>
                b.totalQtyPlayersChoseAnswer - a.totalQtyPlayersChoseAnswer
        )
        setProcessedResults(newResults)
    }, [results, correctResult?.gameQuestion, remainingResults])

    return (
        <div className="min-h-screen pt-2 ">
            {processedResults.map((result, index) => (
                <div key={index} className="mb-1">
                    <AnswerResultsOption
                        result={result}
                        totalQtyAnswers={results.length - 1}
                    />
                </div>
            ))}
        </div>
    )
}

export { AnswerResults }
export { type ProcessedResult }
