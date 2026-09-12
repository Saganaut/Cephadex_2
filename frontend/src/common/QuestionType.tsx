// import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import type { CardType } from '@source/client'
import type { CardType as CardType2 } from '@source/common/Form/CardTypeSelector/cardTypes'
import React, {
    // FunctionComponent,
    // ReactElement,
    // SVGProps,
    useState,
} from 'react'

// import ClozeCardIcon from '../assets/cardTypeIcons/CardTypeCloze.svg?react'
// import CustomCardIcon from '../assets/cardTypeIcons/CardTypeCustom.svg?react'
// import DefinitionsCardIcon from '../assets/cardTypeIcons/CardTypeDefinitions.svg?react'
// import McqCardIcon from '../assets/cardTypeIcons/CardTypeMcq.svg?react'
// import TranslateCardIcon from '../assets/cardTypeIcons/CardTypeTranslate.svg?react'
// import { Tooltip } from './Form/Tooltip'
import { ModalWrapper } from './Modals/ModalWrapper'

interface QuestionTypeProps {
    qType: CardType | CardType2
    section: 'game' | 'quiz'
}

const QuestionType: React.FC<QuestionTypeProps> = ({
    qType,
    section = 'quiz',
}) => {
    const [questionDetailsIsOpen, setQuestionDetailsIsOpen] = useState(false)

    const questionType: string =
        qType === 'Mcq'
            ? 'Multiple choice'
            : qType === 'Custom'
              ? 'Custom question'
              : qType === 'Definitions'
                ? 'Definition'
                : qType === 'Cloze'
                  ? 'Fill in the blanks'
                  : qType === 'Translate'
                    ? 'Translation'
                    : qType === 'Mix'
                      ? 'Mix'
                      : 'Custom'

    const toolTipExplanation: string =
        qType === 'Mcq'
            ? 'There are 3 wrong answers and 1 correct one.  Select the one you think is correct'
            : qType === 'Custom'
              ? 'This is a custom card, the type of question is unknown'
              : qType === 'Definitions'
                ? 'Write your own definition for this word'
                : qType === 'Cloze'
                  ? 'You must enter one or more words to fill in the blanks in the question'
                  : qType === 'Translate'
                    ? 'You must provide a translation for this term'
                    : qType === 'Mix'
                      ? 'Either select the correct answer from the list or provide a definition for the term'
                      : qType === 'Jeopardy'
                        ? 'You are provided the definition, you must enter the term for said definition'
                        : 'This is a custom card, the type of question is unknown'

    const gameToolTipExplanation: string =
        qType === 'Mcq'
            ? 'There are 3 wrong answers and 1 correct one.  Select the one you think is correct'
            : qType === 'Custom'
              ? 'This is a custom card, the type of question is unknown'
              : qType === 'Definitions'
                ? 'Write the best definition you can for this word'
                : qType === 'Cloze'
                  ? 'Enter one or more words to fill in the blanks in the question'
                  : qType === 'Translate'
                    ? 'Provide the most accurate translation possible'
                    : qType === 'Mix'
                      ? 'Either select the correct answer from the list or provide a definition for the term'
                      : qType === 'Jeopardy'
                        ? 'You are provided the definition, you must enter the term for said definition'
                        : 'This is a custom card, the type of question is unknown'

    // const CardTypeIcon = getCardTypeIcon(qType);

    return (
        <>
            <div
                className="no-wrap flex cursor-pointer items-center gap-2 align-middle"
                onClick={() => {
                    setQuestionDetailsIsOpen(true)
                }}
            >
                <QuestionMarkCircleIcon className="size-8 text-white" />{' '}
                <p className="hidden text-sm text-aquamarine lg:block">
                    {questionType}{' '}
                </p>
            </div>
            <ModalWrapper
                isOpen={questionDetailsIsOpen}
                setIsOpen={setQuestionDetailsIsOpen}
            >
                <div
                    className={
                        'flex flex-col items-center justify-center p-[40px]'
                    }
                >
                    <p className={'text-xl dark:text-white'}>
                        {section === 'game'
                            ? gameToolTipExplanation
                            : toolTipExplanation}
                    </p>
                </div>
            </ModalWrapper>
        </>
    )
}

export default QuestionType
