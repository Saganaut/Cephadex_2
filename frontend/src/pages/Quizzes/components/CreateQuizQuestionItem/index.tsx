import type { TempQuestionSchema } from '@source/lib/store/tempQuestions/tempQuestionsSlice'
import { Question } from '@source/pages/Quizzes/components/CreateQuizQuestionItem/Question'
import { shuffleArray } from '@utils/functions'
import React, { type ReactElement, useEffect, useState } from 'react'

import { Option } from './Option'
import { ContentText } from './Question/ContentText'

interface CreateQuizQuestionItemProps {
    card: TempQuestionSchema
    jeopardy: boolean
    handleOpenCarousel: (Card: TempQuestionSchema) => void
    deckId: number
    collapseMode: boolean
}
const CreateQuizQuestionItem: React.FC<CreateQuizQuestionItemProps> = ({
    card,
    jeopardy,
    handleOpenCarousel,
    deckId,
    collapseMode,
}): ReactElement => {
    const [isOpen, setIsOpen] = useState(false)
    const [shuffledValues, setShuffledValues] = useState<
        Array<string | undefined | null>
    >([])
    useEffect(() => {
        const { content, boc2, boc3, boc4 } = card
        setShuffledValues(shuffleArray([content, boc2, boc3, boc4]))
    }, [card])

    useEffect(() => {
        if (!collapseMode) {
            setIsOpen(true)
        }
        if (collapseMode) {
            setIsOpen(false)
        }
    }, [collapseMode])

    return (
        <div
            id="question-selection"
            className={`my-1 w-full sm:my-4  sm:rounded-[26px] ${
                card.qType === 'Mcq'
                    ? 'bg-aquamarine-900/80 dark:bg-electric-violet-900'
                    : 'bg-electric-violet-200 dark:bg-mariana-blue'
            }`}
            data-testid="question-selection"
        >
            <Question
                handleOpenCarousel={handleOpenCarousel}
                jeopardy={jeopardy}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                card={card}
                deckId={deckId}
            />

            {/* Options */}
            {isOpen && card.qType !== 'Mcq' && (
                <ContentText content={card.content ?? 'No content found'} />
            )}
            {isOpen && card.qType === 'Mcq' && (
                <div className={'mx-auto w-4/5 py-4'}>
                    {shuffledValues.map((value, index) => (
                        <Option
                            theme={'violet'}
                            key={index}
                            content={value}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
export { CreateQuizQuestionItem }
