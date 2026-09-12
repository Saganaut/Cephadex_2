import { ArrowSmallUpIcon } from '@heroicons/react/20/solid'
import React from 'react'

import { Dropdown } from '../../Dropdown'

interface SortProps {
    setOrder:
        | React.Dispatch<React.SetStateAction<'asc' | 'desc'>>
        | ((order: 'asc' | 'desc') => void)

    order: 'asc' | 'desc'
    sortOptions?: Array<{ value: number; label: string }>
    sortValue?: { value: number; label: string }
    setSortValue?:
        | React.Dispatch<React.SetStateAction<{ value: number; label: string }>>
        | ((value: { value: number; label: string }) => void)

    style?: 'shallows' | 'depths'
}
const Sort: React.FC<SortProps> = ({
    setOrder,
    order,
    sortOptions,
    sortValue,
    setSortValue,
    style,
}) => {
    return (
        <>
            <div className={'flex gap-x-[4px] sm:w-full '}>
                <div
                    className={`${
                        style === 'shallows'
                            ? 'bg-aquamarine/40 dark:bg-mariana-blue-100 '
                            : 'dark:bg-tolopea'
                    }  flex h-full w-[38px] min-w-[38px] items-center justify-center rounded-full`}
                >
                    <button
                        type="button"
                        className={`flex h-full min-h-[36px] w-[36px] min-w-[36px] items-center justify-center rounded-full ${
                            style === 'shallows'
                                ? 'bg-aquamarine/40 dark:bg-mariana-blue-100 '
                                : 'bg-black-white dark:bg-tolopea'
                        }`}
                        onClick={() => {
                            const nextSortOrder =
                                order === 'asc' ? 'desc' : 'asc'
                            setOrder(nextSortOrder)
                        }}
                    >
                        <ArrowSmallUpIcon
                            className={`w-[20px] text-tolopea dark:text-aquamarine ${
                                order === 'desc' ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                </div>

                <div className="hidden sm:block">
                    <Dropdown
                        style={'sort'}
                        options={sortOptions}
                        value={sortValue}
                        name={'sortField'}
                        onChange={setSortValue}
                        secondStyle={style}
                    />
                </div>
            </div>
        </>
    )
}

export { Sort }
