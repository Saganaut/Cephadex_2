import { Paginator } from '@common/Form/Paginator'
import type { PublicDeckSchema } from '@source/client'
import { DeckService } from '@source/client'
import { PageWrapper } from '@source/common/PageWrapper'
import { useDebouncedEffect } from '@source/lib/hooks/useDebouncedEffect'
import React, { useState } from 'react'

import { CommunityPageHeader } from './components/CommunityPageHeader'
import { PublicDecks } from './components/PublicDecks'

const sortOptions = [
    { value: 0, label: 'Name' },
    { value: 1, label: 'Date' },
    { value: 2, label: 'Likes' },
    { value: 3, label: 'Subject' },
    { value: 4, label: 'Description' },
]

const MAX_ITEMS_PER_PAGE = 8
const Community: React.FC = () => {
    const [deckSearchQuery, setDeckSearchQuery] = useState('')
    const [sortedArray, setSortedArray] = useState<PublicDeckSchema[]>()
    const [order, setOrder] = useState<'desc' | 'asc'>('asc')
    const [pageNumber, setPageNumber] = useState(1)
    const [qtyPages, setQtyPages] = useState(1)
    const [pageNumbersToShow, setPageNumbersToShow] = useState(4)
    const [sortValue, setSortValue] = useState<{
        value: number
        label: string
    }>(sortOptions[0] as { value: number; label: string })

    const handleSearch = async (): Promise<void> => {
        const response = await DeckService.searchPublicDecks(
            deckSearchQuery,
            sortValue.label,
            order,
            pageNumber,
            MAX_ITEMS_PER_PAGE
        )
        if (response.decks != null) {
            setSortedArray(response.decks)
        }
        if (response.totalPages != null) {
            setQtyPages(response.totalPages)
        }
    }

    useDebouncedEffect(
        () => {
            void handleSearch()
        },
        [deckSearchQuery, pageNumber, sortValue, order],
        1000
    )

    return (
        <>
            {' '}
            <PageWrapper>
                <CommunityPageHeader
                    deckSearchQuery={deckSearchQuery}
                    setDeckSearchQuery={setDeckSearchQuery}
                    handleSearch={handleSearch}
                />
                <PublicDecks
                    sortedArray={sortedArray}
                    order={order}
                    setOrder={setOrder}
                    sortValue={sortValue}
                    setSortValue={setSortValue}
                    sortOptions={sortOptions}
                />
                {qtyPages > 1 && (
                    <div className="flex justify-center justify-self-end pt-2">
                        <Paginator
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            qtyPages={qtyPages}
                            pageNumbersToShow={pageNumbersToShow}
                        />
                    </div>
                )}
            </PageWrapper>
        </>
    )
}

export default Community
