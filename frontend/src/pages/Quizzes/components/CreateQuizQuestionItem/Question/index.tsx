import DragIcon from '@assets/DragIcon.svg'
import DragIconLight from '@assets/DragIconLight.svg'
import { InputField } from '@common/Form/InputField'
import { RadioButton } from '@common/Form/RadioButton'
import { EditCardContentModal } from '@common/Modals/EditCardContentModal'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import type { CardSchema, QuestionSchema } from '@source/client'
import { AddButton } from '@source/common/Buttons/IconButtons/AddButton'
import { EditButton } from '@source/common/Buttons/IconButtons/EditButton'
import {
    toggleSelected,
    updateOneTempQuestion,
} from '@source/lib/store/tempQuestions/actions'
import type { TempQuestionSchema } from '@source/lib/store/tempQuestions/tempQuestionsSlice'
import { useAppDispatch } from '@store/hooks'
import React, { useEffect, useState } from 'react'

import { QuestionText } from './QuestionText'

export interface CombinedSchema extends CardSchema, QuestionSchema {
    id: number
    term: string
    img: string
}

interface QuestionProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    card: TempQuestionSchema
    jeopardy: boolean
    handleOpenCarousel: (Card: TempQuestionSchema) => void
    deckId: number
}
const Question: React.FC<QuestionProps> = ({
    isOpen,
    setIsOpen,
    card,
    handleOpenCarousel,
    deckId,
}) => {
    const [openEditModal, setOpenEditModal] = useState(false)
    const [marks, setMarks] = useState<number | null>(card.points ?? 1)
    const dispatch = useAppDispatch()

    const toggleSelectedTempQuestion = (): void => {
        if (card.id != null) {
            dispatch(toggleSelected(card.id))
        }
    }

    useEffect(() => {
        const updatePoints = (points = 1): void => {
            if (card.selected) {
                dispatch(
                    updateOneTempQuestion({ ...card, points: points ?? 1 })
                )
            }
        }
        updatePoints(marks ?? 1)
    }, [marks, card, dispatch])

    return (
        <div
            className={`flex w-full  items-center justify-between rounded-full ${
                card.qType === 'Mcq'
                    ? 'bg-aquamarine-900/40 dark:bg-electric-violet-900'
                    : 'bg-electric-violet-200 dark:bg-mariana-blue'
            } px-[16px] py-[12px] md:px-[22px]`}
            data-testid="create-quiz-question"
        >
            <div className={'flex items-center gap-x-[15px]'}>
                <img src={card.qType === 'Mcq' ? DragIcon : DragIconLight} />
                <ChevronDownIcon
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                    className={`${
                        isOpen ? '' : '-rotate-90'
                    }  size-[22px] shrink-0 cursor-pointer text-tolopea dark:text-white sm:size-[28px]`}
                />
                <div className="flex grow">
                    <RadioButton
                        theme={card.qType === 'Mcq' ? 'marina-blue' : 'violet'}
                        isChecked={card.selected}
                        handleInputChange={() => {
                            toggleSelectedTempQuestion()
                        }}
                        label=""
                    />
                    <QuestionText
                        content={card.question ?? 'No content found'}
                    />
                </div>
            </div>
            <div
                className={
                    'flex max-w-[90px] shrink flex-wrap md:max-w-none md:flex-nowrap md:items-center md:gap-x-[12px]'
                }
            >
                <div className={'flex items-center gap-x-[8px]'}>
                    <p className="hidden md:block">Marks</p>
                    <div className={'w-[80px]'}>
                        <InputField
                            name={'marks'}
                            value={marks}
                            setValue={setMarks}
                            type={'number'}
                            placeholder={'1'}
                            className={'rounded-[12px] p-[4px] text-center'}
                            onChange={(e) => {
                                const value = e.target.value
                                if (value === '') {
                                    setMarks(null)
                                    return
                                }
                                setMarks(value !== '' ? parseInt(value, 10) : 1)
                            }}
                        />
                    </div>
                </div>

                <h1
                    className={
                        'hidden w-[100px] rounded-full bg-blaze-orange px-2 py-1 text-center text-xs dark:bg-tolopea md:block'
                    }
                >
                    {card.qType}
                </h1>
                <div className="flex flex-nowrap gap-2 pt-2 md:pt-0">
                    <AddButton
                        onClick={() => {
                            handleOpenCarousel(card)
                        }}
                        style={'vivid'}
                    />
                    <EditButton
                        onClick={() => {
                            setOpenEditModal(!openEditModal)
                        }}
                        style="shallows"
                    />
                </div>
            </div>

            {/* TODO : Fix this */}
            <EditCardContentModal
                isOpen={openEditModal}
                setIsOpen={setOpenEditModal}
                activeCard={card}
                deckId={String(deckId)}
                type={'Quiz'}
            />
        </div>
    )
}
export { Question }
