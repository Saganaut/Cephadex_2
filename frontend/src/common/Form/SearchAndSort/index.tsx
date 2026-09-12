import { useDebouncedEffect } from '@source/lib/hooks/useDebouncedEffect'
import type { FetchCardsParams } from '@source/lib/store/cards/actions'
import React, { useState } from 'react'

import { Search } from '../Filter/Search'
import { Sort } from '../Filter/Sort'

interface SearchAndSortProps {
    searchPlaceholder: string
    sortOptions: Array<{ value: number; label: string }>
    fetchParams: FetchCardsParams
    setFetchParams: React.Dispatch<React.SetStateAction<FetchCardsParams>>
    withSort?: boolean
    withSearch?: boolean
    style?: 'depths' | 'shallows'

    type?: 'questions' | 'quizzes' | 'decks' | 'cards'
}
// Creating a new search and sort component that preserves the existing UI but searches and sorts from the backend directly

const SearchAndSort = ({
    searchPlaceholder,
    sortOptions,
    setFetchParams,
    fetchParams,
    withSort = true,
    withSearch = true,
    style = 'depths',
}: SearchAndSortProps): React.ReactElement => {
    const [inputText, setInputText] = useState('')
    const DEBOUNCE_TIME = 300
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { value } = event.target
        setInputText(value)
    }
    useDebouncedEffect(
        async () => {
            if (inputText != null) {
                setFetchParams({
                    ...fetchParams,
                    searchQuery: inputText,
                    reset: true,
                    page: 1,
                })
            }
        },
        [inputText],
        DEBOUNCE_TIME
    )

    const setOrder = (order: 'asc' | 'desc'): void => {
        setFetchParams({ ...fetchParams, order, reset: true, page: 1 })
    }
    const setSortValue = (value: { value: number; label: string }): void => {
        setFetchParams({
            ...fetchParams,
            sortValue: value.label,
            reset: true,
            page: 1,
        })
    }

    return (
        <div
            className={`flex w-full justify-between gap-x-4 gap-y-[6px] bg-transparent sm:flex-col md:flex-row md:gap-x-[18px] md:gap-y-0 lg:gap-x-[24px] `}
        >
            {withSearch && (
                <Search
                    searchPlaceHolder={searchPlaceholder}
                    inputText={inputText}
                    handleInputChange={handleInputChange}
                    style={style}
                />
            )}

            {withSort && (
                <Sort
                    setOrder={setOrder}
                    order={fetchParams.order ?? 'desc'}
                    sortOptions={sortOptions}
                    sortValue={{
                        value: 0,
                        label: fetchParams.sortValue,
                    }}
                    setSortValue={setSortValue}
                    style={style}
                />
            )}
        </div>
    )
}

export { SearchAndSort }
