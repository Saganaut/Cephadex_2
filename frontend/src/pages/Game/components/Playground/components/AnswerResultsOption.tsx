import FullMarkDown from '@source/common/FullMarkDown'
import React from 'react'

import type { ProcessedResult } from './AnswerResults'

interface AnswerResultsOptionProps {
    result: ProcessedResult
    totalQtyAnswers: number
}

const AnswerResultsOption: React.FC<AnswerResultsOptionProps> = ({
    result,
    totalQtyAnswers,
}) => {
    const width = (result.totalQtyPlayersChoseAnswer / totalQtyAnswers) * 100
    return (
        <div
            className={` rounded-xl border-2 border-electric-violet bg-slate-200 p-2 dark:bg-tolopea ${result.isCorrect ? 'border-4 border-green-400' : ''}`}
        >
            <div className="mb-1 max-h-[150px] overflow-auto">
                <FullMarkDown content={result.optionText} />
            </div>
            <div className="w-full overflow-hidden rounded-xl bg-electric-violet-200 dark:bg-mariana-blue-100">
                <div
                    className="h-4 rounded-xl bg-mariana-blue-100 p-0.5 text-center text-xs font-medium leading-none dark:bg-aquamarine-900 dark:text-aquamarine"
                    style={{ width: `${width}%` }}
                ></div>
            </div>
        </div>
    )
}

export { AnswerResultsOption }
