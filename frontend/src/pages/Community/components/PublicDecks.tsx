import { SimpleFilter } from '@common/Form/SimpleFilter'
import type { PublicDeckSchema } from '@source/client'
import { DeckCard } from '@source/common/Cards/Decks/DeckCard'
import { Crickets } from '@source/common/InfoComponents/Crickets'
import { Loading } from '@source/common/InfoComponents/Loading'
import { CardViewerModal } from '@source/common/Modals/CardViewerModal'
import { SelectWrapper } from '@source/common/SelectWrapper'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

interface PublicDecksProps {
    sortedArray?: PublicDeckSchema[]
    order: 'desc' | 'asc'
    setOrder: React.Dispatch<React.SetStateAction<'desc' | 'asc'>>
    sortValue: { value: number; label: string }
    setSortValue: React.Dispatch<
        React.SetStateAction<{ value: number; label: string }>
    >
    sortOptions: Array<{ value: number; label: string }>
}

const PublicDecks: React.FC<PublicDecksProps> = ({
    sortOptions,
    sortValue,
    setSortValue,
    order,
    setOrder,
    sortedArray,
}) => {
    // DECKS FROM REDUX
    const [cardViewerIsOpen, setCardViewerIsOpen] = React.useState(false)
    const [selectedDeck, setSelectedDeck] =
        React.useState<PublicDeckSchema | null>(null)
    const onDeckClick = (deck: PublicDeckSchema): void => {
        setSelectedDeck(deck)
        setCardViewerIsOpen(true)
    }
    return (
        <div className={'rounded-[18px]  bg-transparent '}>
            <div className="flex justify-end">
                <div className="max-w-[300px]  rounded-full p-2 ">
                    <div
                        className={
                            '   mx-auto  max-w-[300px] rounded-full p-1 dark:bg-mariana-blue'
                        }
                    >
                        <SimpleFilter
                            searchPlaceHolder={'Search For Decks'}
                            sortOptions={sortOptions}
                            sortValue={sortValue}
                            setSortValue={setSortValue}
                            order={order}
                            setOrder={setOrder}
                        />
                    </div>
                </div>
            </div>
            <div className={'w-full'}>
                {sortedArray == null && <Loading />}
                {sortedArray != null && sortedArray?.length === 0 && (
                    <Crickets message="We have scoured the seven seas and found no decks that match your search. Consider making one yourself! It's pretty easy." />
                )}
                {sortedArray != null && sortedArray?.length > 0 && (
                    <>
                        {/* <h1
              className={
                "pb-2 text-2xl font-medium text-tolopea dark:text-white"
              }
            >
              Public Decks
            </h1>{" "} */}

                        <SelectWrapper withFilter={false}>
                            <div
                                className={
                                    'mt-4 grid size-full sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                }
                            >
                                <AnimatePresence>
                                    {sortedArray.map((deck, index) => (
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
                                            className="mx-auto mb-8 w-full px-2"
                                        >
                                            <DeckCard
                                                key={index}
                                                deck={deck}
                                                type="public"
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </SelectWrapper>
                    </>
                )}
            </div>
            {selectedDeck !== null && (
                <CardViewerModal
                    isOpen={cardViewerIsOpen}
                    setIsOpen={setCardViewerIsOpen}
                    deck={selectedDeck}
                />
            )}
        </div>
    )
}
export { PublicDecks }
