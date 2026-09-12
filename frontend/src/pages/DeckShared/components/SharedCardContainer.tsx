import { Filter } from '@common/Form/Filter'
import {
    type CardSchema,
    DeckService,
    type PublicCardSchema,
} from '@source/client'
import { CardCardPublic } from '@source/common/Cards/Cards/CardCard/CardCardPublic'
import { Loading } from '@source/common/InfoComponents/Loading'
import { SelectWrapper } from '@source/common/SelectWrapper'
import React, { useCallback, useEffect, useRef, useState } from 'react'

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
const MAX_ITEMS_PER_PAGE = 24

interface SharedCardContainerProps {
    onCardClick: (cardId: number) => void
    deckId: number
    cards: PublicCardSchema[]
}
const SharedCardContainer: React.FC<SharedCardContainerProps> = ({
    deckId,
    onCardClick,
    cards,
}) => {
    const [sortValue, setSortValue] = useState<{
        value: number
        label: string
    }>(sortOptions[0])
    const [page, setPage] = useState(1)
    const [order, setOrder] = useState<'desc' | 'asc'>('desc')
    const [sortedArray, setSortedArray] = useState<CardSchema[]>([])
    const [cardSearchQuery, setCardSearchQuery] = useState('')

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
                if (first.isIntersecting) {
                    void fetchMoreCards()
                }
            },
            { threshold: 0.5 }
        )

        const currentLoaderRef = loaderRef.current
        if (currentLoaderRef != null) {
            observer.observe(currentLoaderRef)
        }
        return () => {
            if (currentLoaderRef != null) {
                observer.unobserve(currentLoaderRef)
            }
        }
    }, [fetchMoreCards])

    const handleSearch = useCallback(async (): Promise<void> => {
        const response = await DeckService.searchPublicCards(
            deckId,
            cardSearchQuery,
            'group',
            sortValue.label,
            order,
            page,
            MAX_ITEMS_PER_PAGE
        )
        if (response.cards != null) {
            setSortedArray((currentCards) => [
                ...currentCards,
                ...response.cards,
            ])
        }
        if (response.totalPages != null) {
            if (response.totalPages === page) {
                setPage(response.totalPages)
            }
        }
    }, [cardSearchQuery, sortValue, order, page, deckId])

    useEffect(() => {
        void handleSearch()
    }, [page, sortValue, order])

    return (
        <SelectWrapper withFilter={false}>
            {' '}
            <div className={'rounded-[18px]  bg-transparent md:p-[32px]'}>
                <div className="rounded-2xl  p-2">
                    {/* <div className={"mx-auto "}>
            <Filter
              searchPlaceHolder={"Search For Decks"}
              dataArray={sortedArray}
              sortOptions={sortOptions}
              sortValue={sortValue}
              setSortValue={setSortValue}
              // setSortedArray={setSortedArray}
              setFilterValue={setCardSearchQuery}
            />
          </div> */}
                </div>
                <div className={'w-full'}>
                    <h1 className={'pb-2 font-medium text-white'}></h1>
                    <div
                        className={
                            'grid size-full sm:grid-cols-2 lg:grid-cols-3'
                        }
                    >
                        {sortedArray
                            ?.filter((card) =>
                                card.term
                                    .toUpperCase()
                                    .includes(cardSearchQuery.toUpperCase())
                            )
                            .map((card, index) => (
                                <div
                                    onClick={() => {
                                        onCardClick(card.id)
                                    }}
                                    key={index}
                                    className="mx-auto mb-8 w-full px-2"
                                >
                                    <CardCardPublic
                                        key={index}
                                        card={card}
                                        deckId={Number(deckId)}
                                    />
                                </div>
                            ))}
                    </div>
                    {sortedArray != null && sortedArray?.length <= 0 && (
                        <div
                            className={
                                'mx-auto text-center font-medium text-white'
                            }
                        >
                            <p>
                                That&apos;s weird - There are no cards in this
                                deck{' '}
                            </p>
                        </div>
                    )}
                </div>
                <div ref={loaderRef} className=" flex justify-center">
                    {loading && <Loading />}
                </div>
            </div>
        </SelectWrapper>
    )
}

export { SharedCardContainer }
