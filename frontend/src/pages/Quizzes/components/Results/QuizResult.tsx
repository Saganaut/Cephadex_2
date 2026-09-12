import Chevron from '@assets/Chevron.svg?react'
import type { QuizAndResults } from '@source/client'
import { DateDisplay } from '@source/common/DateDisplay'
import React from 'react'

interface QuizResultItemProps {
    quiz: QuizAndResults
    resultIndex: number | null
    handleExpand: (index: number) => void
}
const QuizResultItem: React.FC<QuizResultItemProps> = ({
    quiz,
    resultIndex,
    handleExpand,
}) => {
    return (
        <div
            onClick={() => {
                handleExpand(quiz.id)
            }}
            className="relative mb-1 mt-2 flex w-full cursor-pointer flex-wrap items-center justify-between rounded-2xl bg-aquamarine-100 px-[20px] py-[8px] hover:bg-aquamarine dark:bg-mariana-blue-100 dark:text-white dark:hover:bg-electric-violet dark:hover:text-white sm:flex-nowrap sm:rounded-full"
            key={quiz.id}
        >
            <h1
                className={
                    'flex h-full cursor-pointer items-center font-bold sm:w-[45%]'
                }
            >
                {quiz.name}
            </h1>

            <div className="flex items-center justify-between gap-x-[12px] py-2">
                <DateDisplay date={quiz.dueDate} style="result" />
                <p>Results : {quiz.results?.length}</p>
                <div className="absolute right-4 top-2 sm:relative sm:right-0 sm:top-0">
                    {resultIndex === quiz.id ? (
                        <div>
                            <Chevron className="size-[24px] rotate-180 fill-tolopea hover:fill-aquamarine dark:fill-white" />{' '}
                        </div>
                    ) : (
                        <Chevron className="size-[24px] fill-black hover:fill-aquamarine dark:fill-white " />
                    )}
                </div>
            </div>
        </div>
    )
}

export { QuizResultItem }
