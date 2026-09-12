import type { FetchCardsParams } from '@source/lib/store/cards/actions'
import React from 'react'

import { SearchAndSort } from '../Form/SearchAndSort'

interface SearchAndSortWrapperProps {
    children: React.ReactNode
    title?: string

    searchPlaceholder: string
    sortOptions: Array<{ value: number; label: string }>
    fetchParams: FetchCardsParams
    setFetchParams: React.Dispatch<React.SetStateAction<FetchCardsParams>>

    withSort?: boolean
    withSearch?: boolean

    style?: 'depths' | 'shallows'

    type?: 'questions' | 'quizzes' | 'decks' | 'cards'
}
const SearchAndSortWrapper = ({
    children,
    title,

    searchPlaceholder = 'Search',
    sortOptions,

    setFetchParams,
    fetchParams,

    withSort = true,
    withSearch = true,
}: SearchAndSortWrapperProps): React.ReactElement => {
    return (
        <>
            <div
                className={
                    'bg-electric-violet-200 px-2 pb-4 dark:bg-mariana-blue sm:rounded-[18px] sm:px-8'
                }
            >
                {title != null && withSort ? (
                    <div className="flex items-center justify-between rounded-2xl bg-electric-violet-200 py-2  dark:bg-mariana-blue   sm:px-2 sm:pb-8 sm:pt-9">
                        {title != null && (
                            <div className="hidden whitespace-nowrap pr-4 text-2xl font-bold text-black dark:text-white sm:block">
                                {title}
                            </div>
                        )}
                        {withSort && (
                            <div className="fixed bottom-0 left-0 z-40 h-24 w-full rounded-t-xl border-t-2 border-t-white/40 bg-electric-violet-500 dark:bg-mariana-blue  sm:static sm:size-auto sm:border-0 sm:bg-transparent">
                                <div className="mx-10 mb-8 mt-6 sm:m-0">
                                    <SearchAndSort
                                        searchPlaceholder={searchPlaceholder}
                                        sortOptions={sortOptions}
                                        withSort={withSort}
                                        withSearch={withSearch}
                                        fetchParams={fetchParams}
                                        setFetchParams={setFetchParams}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-2"></div>
                )}

                <div className={'w-full '}>{children}</div>
            </div>
        </>
    )
}

export { SearchAndSortWrapper }
