import type { CardSchema, DeckSchema, QuizSchema } from '@source/client'
import { useDebouncedEffect } from '@source/lib/hooks/useDebouncedEffect'
import type { TempQuestionSchema } from '@source/lib/store/tempQuestions/tempQuestionsSlice'
import React, { useState } from 'react'

import { useArraySort } from './hooks'
import { Search } from './Search'
import { Sort } from './Sort'

interface FilterProps {
    setFilterValue?: (value: string) => void
    dataArray: CardSchema[] | TempQuestionSchema[] | QuizSchema[] | DeckSchema[]
    searchPlaceHolder: string
    sortOptions?: Array<{ value: number; label: string }>
    sortValue?: { value: number; label: string }
    setSortValue?: React.Dispatch<
        React.SetStateAction<{ value: number; label: string }>
    >
    editedSortValue?: { value: number; label: string }
    setSortedArray?:
        | React.Dispatch<React.SetStateAction<CardSchema[]>>
        | React.Dispatch<React.SetStateAction<TempQuestionSchema[]>>
        | React.Dispatch<React.SetStateAction<QuizSchema[]>>
        | React.Dispatch<React.SetStateAction<DeckSchema[]>>
    withSort?: boolean
    withSearch?: boolean
    style?: 'depths' | 'shallows'
    defaultOrder?: 'asc' | 'desc'
    type?: 'questions' | 'quizzes' | 'decks' | 'cards'
}

// TODO make filter non case sensitive
const Filter: React.FC<FilterProps> = ({
    sortOptions,
    sortValue,
    setSortValue,
    setFilterValue,
    dataArray,
    setSortedArray,
    withSort = true,
    searchPlaceHolder,
    withSearch = true,
    style = 'depths',
    defaultOrder,
    type = 'cards',
    editedSortValue,
}) => {
    const sortValueToPassToHook = editedSortValue ?? sortValue
    const [inputText, setInputText] = useState('')
    //TODO: Need better type handling for useArraySort
    const { order, setOrder } = useArraySort(
        dataArray,
        sortValueToPassToHook,
        withSort,
        setSortedArray,
        defaultOrder
    )
    // TODO: Make sure the filter works on all components , where it is used
    const DEBOUNCE_TIME = 300
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { value } = event.target
        setInputText(value)
    }

    useDebouncedEffect(
        async () => {
            if (setFilterValue != null) {
                setFilterValue(inputText)
            }
        },
        [inputText],
        DEBOUNCE_TIME
    )

    return (
        <div
            className={`flex w-full justify-between gap-x-4 gap-y-[6px] bg-transparent sm:flex-col md:flex-row md:gap-x-[18px] md:gap-y-0 lg:gap-x-[24px] `}
        >
            {withSearch && (
                <Search
                    searchPlaceHolder={searchPlaceHolder}
                    inputText={inputText}
                    handleInputChange={handleInputChange}
                    style={style}
                />
            )}

            {withSort && (
                <Sort
                    setOrder={setOrder}
                    order={order}
                    sortOptions={sortOptions}
                    sortValue={sortValue}
                    setSortValue={setSortValue}
                    style={style}
                />
            )}
        </div>
    )
}

export { Filter }
