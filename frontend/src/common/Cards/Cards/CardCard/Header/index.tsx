import type { CardSchema, PublicCardSchema } from '@source/client'
import { CardDropdown } from '@source/common/DropdownMenu/CardDropdown'
import FullMarkDown from '@source/common/FullMarkDown'
import { truncate } from '@source/lib/utils/functions'
import React from 'react'
interface HeaderProps {
    card: CardSchema | PublicCardSchema
    deckId: number
    cardType?: 'public' | 'private' | 'standard'
}
const Header: React.FC<HeaderProps> = ({ card, deckId, cardType }) => {
    const cardTitle = truncate(card.term, 20).trim()

    return (
        <div className={'flex items-center justify-between'}>
            <div
                className={'text-[14px] font-bold text-tolopea dark:text-white'}
            >
                <FullMarkDown content={cardTitle} />
            </div>
            {cardType !== 'public' && (
                <CardDropdown
                    deckId={deckId}
                    cardId={card.id}
                    type={cardType}
                />
            )}
        </div>
    )
}
export { Header }
