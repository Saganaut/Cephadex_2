import type { DeckSchema } from '@source/client'
import { DeckCard } from '@source/common/Cards/Decks/DeckCard'
import { fetchDecks } from '@store/decks/actions'
import { selectAllDecks, selectDecksByCardType } from '@store/decks/decksSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Crickets } from '../InfoComponents/Crickets'
import { Loading } from '../InfoComponents/Loading'
import { SelectWrapper } from '../SelectWrapper'

interface SelectADeckProps {
    onDeckClick: ((args?: unknown) => void) | ((deck: DeckSchema) => void)
    setDeckLength?: React.Dispatch<React.SetStateAction<number>>
    withFilter?: boolean
    filter?: { deckType: string[] }
}
const sortOptions = [
    {
        value: 0,
        label: 'Date',
    },
    {
        value: 1,
        label: 'Name',
    },
]
const SelectADeck: React.FC<SelectADeckProps> = ({
    onDeckClick,
    setDeckLength,
    // withFilter,
    filter,
}) => {
    const [cardTypes, setCardTypes] = useState<string[]>([])

    const dispatch = useAppDispatch()
    // DECKS FROM REDUX
    const decks = useAppSelector(selectAllDecks)

    const filteredDecks = useAppSelector((state) =>
        selectDecksByCardType(state, cardTypes)
    )
    useEffect(() => {
        if (filter != null) {
            setCardTypes(filter.deckType)
        }
    }, [filter])

    const decksStatus = useAppSelector((state) => state.decks.status)
    const allDecksLoaded = useAppSelector((state) => state.decks.allDecksLoaded)

    const [delayed, setDelayed] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDelayed(true)
        }, 3000)
        return () => {
            clearTimeout(timer)
        }
    }, [])

    const navigate = useNavigate()

    useEffect(() => {
        if (!allDecksLoaded) {
            void dispatch(fetchDecks())
        } else {
            if (decksStatus === 'succeeded') {
                setDeckLength != null && setDeckLength(decks.length)
                return
            }
            if (decksStatus === 'idle') {
                void dispatch(fetchDecks())
            }
        }
    }, [dispatch, decksStatus, allDecksLoaded, setDeckLength, decks.length])

    const [deckSearchQuery, setDeckSearchQuery] = useState('')
    const [sortValue, setSortValue] = useState<{
        value: number
        label: string
    }>(sortOptions[0] as { value: number; label: string })
    const [sortedArray, setSortedArray] = useState<DeckSchema[]>()
    if (decksStatus === 'loading') return <Loading />

    return (
        <SelectWrapper
            title="Select a deck"
            withFilter={true}
            searchPlaceHolder={'Search For Decks'}
            dataArray={filter != null ? filteredDecks : decks}
            sortOptions={sortOptions}
            sortValue={sortValue}
            setSortValue={setSortValue}
            setSortedArray={setSortedArray}
            setFilterValue={setDeckSearchQuery}
            defaultOrder="desc"
        >
            <div
                id="select-a-deck"
                className={`no-survey-yet grid size-full gap-y-[24px] pb-32 sm:pb-8 md:grid-cols-2 lg:grid-cols-3 ${
                    delayed ? 'delayed-survey' : ''
                }`}
            >
                <AnimatePresence>
                    {/* DECKS */}s
                    {sortedArray
                        ?.filter((deck) =>
                            deck.name
                                .toUpperCase()
                                .includes(deckSearchQuery.toUpperCase())
                        )
                        .map((deck, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 100 }}
                                transition={{
                                    delay: 0.05 * index,
                                    ease: 'easeOut',
                                }}
                                onClick={() => {
                                    onDeckClick(deck)
                                }}
                                key={index}
                                className="box mx-auto w-full sm:px-2"
                            >
                                <DeckCard
                                    key={index}
                                    deck={deck}
                                    type="standard"
                                    isCard={false}
                                />
                            </motion.div>
                        ))}
                </AnimatePresence>
            </div>
            {sortedArray != null && sortedArray?.length <= 0 && (
                <div className={'mx-auto text-center font-medium text-white'}>
                    <div>
                        <Crickets message={"You don't have any decks yet"} />
                        <p>
                            <span
                                className={
                                    'cursor-pointer text-aquamarine underline'
                                }
                                onClick={() => {
                                    navigate('/create-deck')
                                }}
                            >
                                create one now!
                            </span>
                        </p>
                    </div>{' '}
                </div>
            )}
        </SelectWrapper>
    )
}
export { SelectADeck }
