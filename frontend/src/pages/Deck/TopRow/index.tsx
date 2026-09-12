import type { CardSchema } from '@source/client'
import { SearchAndSort } from '@source/common/Form/SearchAndSort'
import type { FetchCardsParams } from '@source/lib/store/cards/actions'
import React from 'react'

interface TopRowProps {
    searchPlaceholder: string
    sortOptions: Array<{ value: number; label: string }>
    fetchParams: FetchCardsParams
    setFetchParams: React.Dispatch<React.SetStateAction<FetchCardsParams>>
    withSort?: boolean
    withSearch?: boolean
    style?: 'depths' | 'shallows'

    type?: 'questions' | 'quizzes' | 'decks' | 'cards'
}
const TopRow = ({
    sortOptions,
    searchPlaceholder,
    withSort,
    withSearch,
    fetchParams,
    setFetchParams,
}: TopRowProps): React.ReactElement => {
    return (
        <>
            <div className="rounded-2xl  p-2">
                <div className={'mx-auto '}>
                    <SearchAndSort
                        searchPlaceholder={searchPlaceholder}
                        sortOptions={sortOptions}
                        withSort={withSort}
                        withSearch={withSearch}
                        fetchParams={fetchParams}
                        setFetchParams={setFetchParams}
                        style="shallows"
                    />
                </div>
            </div>
        </>
    )
}

export { TopRow }
