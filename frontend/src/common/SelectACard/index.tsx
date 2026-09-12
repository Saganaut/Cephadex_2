import type { CardSchema } from '@source/client'
import { CardCard } from '@source/common/Cards/Cards/CardCard'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SelectWrapper } from '../SelectWrapper'

interface SelectACardProps {
    onCardClick: (cardId: number) => void
    cardSearchQuery: any
    deckId: number
    cards: CardSchema[]
}

const sortOptions = [
    {
        value: 0,
        label: 'Date',
    },
    {
        value: 1,
        label: 'Term',
    },
]
const SelectACard: React.FC<SelectACardProps> = ({
    cards,
    deckId,
    onCardClick,
}) => {
    const [sortedArray, setSortedArray] = useState<CardSchema[]>()
    const [cardSearchQuery, setCardSearchQuery] = useState('')
    const [sortValue, setSortValue] = useState<{
        value: number
        label: string
    }>(sortOptions[0] as { value: number; label: string })

    const navigate = useNavigate()
    return (
        <SelectWrapper
            title="Select a card"
            withFilter={true}
            searchPlaceHolder={'Search For Cards'}
            dataArray={cards}
            sortOptions={sortOptions}
            sortValue={sortValue}
            setSortValue={setSortValue}
            setSortedArray={setSortedArray}
            setFilterValue={setCardSearchQuery}
        >
            <div
                className={
                    'grid size-full grid-cols-1 gap-x-[30px] gap-y-[24px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
                }
            >
                <AnimatePresence>
                    {sortedArray
                        ?.filter((card) =>
                            card.term
                                .toUpperCase()
                                .includes(cardSearchQuery.toUpperCase())
                        )
                        .map((card, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 100 }}
                                transition={{
                                    delay: 0.05 * index,
                                    ease: 'easeOut',
                                }}
                                onClick={() => {
                                    onCardClick(card.id)
                                }}
                                key={index}
                            >
                                <CardCard
                                    key={index}
                                    card={card}
                                    deckId={deckId}
                                    cardType="standard"
                                />
                            </motion.div>
                        ))}
                </AnimatePresence>
            </div>
            {sortedArray != null && sortedArray?.length <= 0 && (
                <div className={'mx-auto text-center font-medium text-white'}>
                    <p>
                        That&apos;s weird - you don&apos;t have any cards in
                        this deck...{' '}
                        <span
                            className={
                                'cursor-pointer text-aquamarine underline'
                            }
                            onClick={() => {
                                navigate('/create-deck')
                            }}
                        >
                            Create some now.
                        </span>
                    </p>
                </div>
            )}
        </SelectWrapper>
    )
}

export { SelectACard }
