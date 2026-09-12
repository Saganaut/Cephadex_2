import { ArrowUpCircleIcon } from '@heroicons/react/20/solid'
import { IconButton } from '@source/common/Buttons/IconButton'
import React from 'react'

interface TextAnswerInputProps {
    username: string
    answer: string
    setAnswer: (value: string) => void
    handleSubmitAnswer: (endAnswers: boolean) => void
    canAnswer: boolean
}

const TextAnswerInput: React.FC<TextAnswerInputProps> = ({
    username,
    answer,
    setAnswer,
    handleSubmitAnswer,
    canAnswer,
}) => {
    return (
        <div
            className={
                'size-full rounded-[12px] bg-mariana-blue-100 px-[14px] py-[10px] '
            }
        >
            {/* User Avatar */}
            <div className={'flex items-center gap-x-[8px]'}>
                <div
                    className={'size-[36px] rounded-full bg-electric-violet'}
                />

                <h1
                    className={
                        'rounded-full bg-electric-violet-200 px-4 py-[4px] text-sm font-medium'
                    }
                >
                    {username}
                </h1>
            </div>

            <textarea
                value={answer}
                onChange={(e) => {
                    setAnswer(e.currentTarget.value)
                }}
                placeholder={'Enter your answer'}
                className={
                    ' mt-[10px] min-h-[200px] w-[90%] max-w-full resize-y bg-transparent text-white outline-none placeholder:text-electric-violet'
                }
            />

            <IconButton
                disabled={!canAnswer}
                icon={<ArrowUpCircleIcon />}
                onClick={() => {
                    handleSubmitAnswer(false)
                }}
                ariaLabel={'Submit answer'}
                to={''}
                classname={'flex-row-reverse mx-auto w-fit'}
                theme={'orange'}
                collapse={false}
            />
        </div>
    )
}

export default TextAnswerInput
