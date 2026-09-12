import type { PublicCardSchema } from '@source/client'
import { CardCardPublic } from '@source/common/Cards/Cards/CardCard/CardCardPublic'
// import { SimpleFilter } from "@source/common/Form/SimpleFilter";
import { Loading } from '@source/common/InfoComponents/Loading'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface CardViewerProps {
    sortedArray?: PublicCardSchema[]
    order: 'desc' | 'asc'
    setOrder: React.Dispatch<React.SetStateAction<'desc' | 'asc'>>
    sortValue: { value: number; label: string }
    setSortValue: React.Dispatch<
        React.SetStateAction<{ value: number; label: string }>
    >
    sortOptions: Array<{ value: number; label: string }>
    setCardSearchQuery: React.Dispatch<React.SetStateAction<string>>
    setSortedArray: React.Dispatch<React.SetStateAction<PublicCardSchema[]>>
    setPage: React.Dispatch<React.SetStateAction<number>>
    deckId: number
}
const CardViewer: React.FC<CardViewerProps> = ({
    sortedArray,
    order,
    setOrder,
    setPage,
    sortValue,
    setSortValue,
    sortOptions,
    setCardSearchQuery,
    setSortedArray,
    deckId,
}) => {
    const [loading, setLoading] = useState(false)
    const loaderRef = useRef(null)
    const fetchMoreCards = useCallback(async () => {
        if (loading) return
        setLoading(true)
        setPage((prevPage) => prevPage + 1)
        setLoading(false)
    }, [loading, setPage, setLoading])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0]
                if (first == null) return
                if (first.isIntersecting) {
                    void fetchMoreCards()
                }
            },
            { threshold: 0.5 } // Adjust this value according to your needs
        )

        const currentLoaderRef = loaderRef.current
        if (currentLoaderRef != null) {
            observer.observe(currentLoaderRef)
        }

        // Cleanup
        return () => {
            if (currentLoaderRef != null) {
                observer.unobserve(currentLoaderRef)
            }
        }
    }, [fetchMoreCards])

    return (
        <div className={''}>
            <div className=" flex max-w-[200px]">
                {/* <SimpleFilter
          searchPlaceHolder={"Search For Cards"}
          sortOptions={sortOptions}
          sortValue={sortValue}
          setSortValue={setSortValue}
          order={order}
          setOrder={setOrder}
        /> */}
            </div>
            <div
                className={
                    'grid size-full gap-y-[24px] md:grid-cols-2 lg:grid-cols-3'
                }
            >
                {sortedArray?.length === 0 && (
                    <div
                        className={'mx-auto text-center font-medium text-white'}
                    >
                        That&apos;s odd, this deck does not contain any cards.
                    </div>
                )}
                <AnimatePresence>
                    {sortedArray?.length !== 0 && sortedArray !== undefined && (
                        <>
                            {sortedArray.map((card, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 100 }}
                                    transition={{
                                        delay: 0.05 * index,
                                        ease: 'easeOut',
                                    }}
                                    key={index}
                                    className=" px-2"
                                >
                                    <CardCardPublic
                                        deckId={deckId}
                                        card={card}
                                    />
                                </motion.div>
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </div>
            <div ref={loaderRef} className=" flex justify-center">
                {loading && <Loading />}
            </div>
        </div>
    )
}

export { CardViewer }
