import React from 'react'

import { Filter } from '../Form/Filter'

interface SelectWrapperProps<T> {
    children: React.ReactNode
    title?: string
    withFilter: boolean
    setFilterValue?: (value: string) => void
    dataArray?: T[]
    searchPlaceHolder?: string
    sortOptions?: Array<{ value: number; label: string }>
    sortValue?: { value: number; label: string }
    setSortValue?: React.Dispatch<
        React.SetStateAction<{ value: number; label: string }>
    >
    setSortedArray?: React.Dispatch<React.SetStateAction<T[] | T>>
    withSort?: boolean
    withSearch?: boolean
    style?: 'depths' | 'shallows'
    defaultOrder?: 'asc' | 'desc'
}
const SelectWrapper = <T,>({
    children,
    dataArray,
    sortOptions,
    sortValue,
    setSortValue,
    setSortedArray,
    setFilterValue,
    withFilter,
    title,
    searchPlaceHolder = 'Search',
    defaultOrder,
}: SelectWrapperProps<T>): React.ReactElement => {
    return (
        <>
            {' '}
            <div
                className={
                    'bg-electric-violet-200 px-2 pb-4 dark:bg-mariana-blue sm:rounded-[18px] sm:px-8'
                }
            >
                {title != null && withFilter ? (
                    <div className="flex items-center justify-between rounded-2xl bg-electric-violet-200 py-2  dark:bg-mariana-blue   sm:px-2 sm:pb-8 sm:pt-9">
                        {title != null && (
                            <div className="hidden whitespace-nowrap pr-4 text-2xl font-bold text-black dark:text-white sm:block">
                                {title}
                            </div>
                        )}
                        {withFilter && (
                            <div className="fixed bottom-0 left-0 z-40 h-24 w-full rounded-t-xl border-t-2 border-t-white/40 bg-electric-violet-500 dark:bg-mariana-blue  sm:static sm:size-auto sm:border-0 sm:bg-transparent">
                                <div className="mx-10 mb-8 mt-6 sm:m-0">
                                    <Filter
                                        searchPlaceHolder={searchPlaceHolder}
                                        dataArray={dataArray}
                                        sortOptions={sortOptions}
                                        sortValue={sortValue}
                                        setSortValue={setSortValue}
                                        setSortedArray={setSortedArray}
                                        setFilterValue={setFilterValue}
                                        defaultOrder={defaultOrder}
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

export { SelectWrapper }
