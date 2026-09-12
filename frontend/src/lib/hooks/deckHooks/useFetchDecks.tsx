import type { DeckSchema } from '@source/client/models/DeckSchema'
import { fetchDecks } from '@source/lib/store/decks/actions'
import { selectAllDecks } from '@source/lib/store/decks/decksSlice'
import { useAppDispatch, useAppSelector } from '@source/lib/store/hooks'
import { useEffect } from 'react'

export const useFetchDecks = (): {
    decks: DeckSchema[]
    decksStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
} => {
    const decksStatus = useAppSelector((state) => state.decks.status)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (decksStatus === 'succeeded') {
            return
        }
        if (decksStatus === 'idle') {
            void dispatch(fetchDecks())
        }
    }, [decksStatus, dispatch])

    const decks = useAppSelector(selectAllDecks)
    return { decks, decksStatus }
}
