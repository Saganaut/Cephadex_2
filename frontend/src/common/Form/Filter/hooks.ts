import type React from 'react'
import { useEffect, useState } from 'react'

interface HasId {
    id: number
}

interface useArraySortResponse {
    order: 'desc' | 'asc'
    setOrder: React.Dispatch<React.SetStateAction<'desc' | 'asc'>>
}

export const useArraySort = <T extends HasId>(
    dataArray: T[],
    sortValue: { value: number; label: keyof T | 'none' } | undefined,
    withSort: boolean | undefined,
    setSortedArray: React.Dispatch<React.SetStateAction<T[]>> | undefined,
    defaultOrder: 'desc' | 'asc' = 'asc'
    // eslint-disable-next-line @typescript-eslint/max-params
): useArraySortResponse => {
    const [order, setOrder] = useState<'desc' | 'asc'>(defaultOrder)
    useEffect(() => {
        if (withSort === false) return
        const arr = [...dataArray]
        if (sortValue != null && sortValue.label === 'none') {
            if (setSortedArray != null) {
                setSortedArray([...dataArray])
                return
            }
        }

        if (sortValue != null && sortValue.value === 0) {
            arr?.sort((a, b) => {
                if (hasTimeCreated(a) && hasTimeCreated(b)) {
                    return a.timeCreated - b.timeCreated
                } else {
                    return a.id - b.id
                }
            })
        } else if (sortValue != null && sortValue.value >= 1) {
            if (typeof sortValue.label !== 'string') return
            const label = sortValue.label.toLowerCase() as keyof T
            arr.sort((a, b) => {
                const aValue = a[label]
                const bValue = b[label]
                // Use optional chaining and toString() to avoid errors
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    const aString = aValue.toLowerCase()
                    const bString = bValue.toLowerCase()
                    return aString.localeCompare(bString)
                }
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return aValue - bValue
                }
                return 0
            })
        }

        if (order === 'desc') {
            arr.reverse()
        }
        if (setSortedArray != null) {
            setSortedArray(arr)
        }
    }, [sortValue, order, dataArray, setSortedArray, withSort])

    return { order, setOrder }
}

function hasTimeCreated<T>(obj: T): obj is T & { timeCreated: number } {
    return obj != null && typeof (obj as any).timeCreated === 'number' // eslint-disable-line @typescript-eslint/no-explicit-any
}
