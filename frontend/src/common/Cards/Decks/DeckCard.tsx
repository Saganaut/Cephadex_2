import type { DeckSchema, PublicDeckSchema } from '@source/client'
import { DeckDropdown } from '@source/common/DropdownMenu/DeckDropdown'
import { PublicDeckDropdown } from '@source/common/DropdownMenu/DeckDropdown/PublicDeckDropdown'
import { GroupDeckDropdown } from '@source/common/DropdownMenu/GroupDeckDropdown'
import React from 'react'

import { Body } from './Body'
import { Footer } from './Footer'
import { Header } from './Header'

interface DeckCardProps {
    deck: DeckSchema | PublicDeckSchema
    checked?: boolean
    groupId?: number
    isCard?: boolean
    permission?: string
    type: 'group' | 'standard' | 'simple' | 'public' | 'groupAdmin' | 'full'
}
const DeckCard: React.FC<DeckCardProps> = ({
    deck,
    checked,
    groupId,
    permission,
    type,
    isCard,
}) => {
    return (
        <div className="relative min-w-[200px] ">
            <div className="absolute right-2 top-2">
                {type === 'standard' && (
                    <DeckDropdown
                        deckId={deck.id}
                        type={type}
                        groupId={groupId}
                    />
                )}
                {type === 'group' ||
                    (type === 'groupAdmin' && groupId != null && (
                        <GroupDeckDropdown
                            deckId={deck.id}
                            groupId={groupId}
                            type={type}
                        />
                    ))}
                {type === 'public' && (
                    <PublicDeckDropdown deckId={deck.id} type={type} />
                )}
            </div>
            <div
                className={`w-full cursor-pointer flex-col rounded-[10px] px-[16px] py-[10px] transition-all duration-100 ease-linear hover:bg-aquamarine-900 dark:hover:bg-electric-violet ${
                    (checked ?? false)
                        ? 'bg-electric-violet-200 dark:bg-electric-violet'
                        : isCard === true
                          ? 'bg-aquamarine-100 dark:bg-tolopea '
                          : 'bg-aquamarine-100 dark:bg-tolopea'
                } "hover:bg-electric-violet"
          `}
            >
                <Header deck={deck} />
                <Body deck={deck} type={type} />
                <Footer deck={deck} type={type} />
            </div>
        </div>
    )
}

export { DeckCard }
