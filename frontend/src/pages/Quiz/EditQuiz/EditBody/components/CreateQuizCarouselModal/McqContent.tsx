import type { QuestionSchema } from '@source/client'
import { Option } from '@source/pages/Quizzes/components/CreateQuizQuestionItem/Option'
import React from 'react'

interface McqContentProps {
    card: QuestionSchema
}

const McqContent: React.FC<McqContentProps> = ({ card }) => {
    return (
        <div className={'w-full py-4'}>
            <Option
                theme={'transparent'}
                key={0}
                content={card.content}
                index={0}
            />
            <Option
                theme={'transparent'}
                key={1}
                content={card.boc2}
                index={1}
            />
            <Option
                theme={'transparent'}
                key={2}
                content={card.boc3}
                index={2}
            />
            <Option
                theme={'transparent'}
                key={3}
                content={card.boc4}
                index={3}
            />
        </div>
    )
}

export { McqContent }
