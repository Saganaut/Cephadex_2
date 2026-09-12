import type { CardType } from '@source/client'
import FullMarkDown from '@source/common/FullMarkDown'
import { ModalWrapper } from '@source/common/Modals/ModalWrapper'
import QuestionType from '@source/common/QuestionType'
import type { IGameRounds } from '@source/types'
import React from 'react'

interface QuestionHeaderProps {
    currentRound: IGameRounds
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({ currentRound }) => {
    const [expandAnswer, setExpandAnswer] = React.useState(false)

    return (
        <div
            className={
                'my-[8px] rounded-[14px] bg-electric-violet-200 py-[16px] dark:bg-electric-violet-900'
            }
        >
            <div className="flex items-center justify-start gap-2 font-bold text-electric-violet ">
                <QuestionType
                    qType={
                        (currentRound.question.questionCategory as CardType) ??
                        'Custom'
                    }
                    section="game"
                />
                <div
                    className={
                        'max-h-[100px] cursor-pointer overflow-auto px-1 text-center font-semibold text-electric-violet'
                    }
                    onClick={() => {
                        setExpandAnswer(true)
                    }}
                >
                    {currentRound.question.question != null ? (
                        <FullMarkDown
                            content={currentRound?.question.question}
                        />
                    ) : (
                        'No question found'
                    )}
                </div>
            </div>
            <ModalWrapper isOpen={expandAnswer} setIsOpen={setExpandAnswer}>
                <div
                    className={
                        'flex flex-col items-center justify-center p-[40px]'
                    }
                >
                    <div className={'text-xl dark:text-white'}>
                        <FullMarkDown
                            content={currentRound?.question.question}
                        />
                    </div>
                </div>
            </ModalWrapper>
        </div>
    )
}

export { QuestionHeader }
