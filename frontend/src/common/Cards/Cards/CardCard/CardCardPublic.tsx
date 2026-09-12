import type { PublicCardSchema } from '@source/client'
import { DisplayPublicCardModal } from '@source/common/Modals/DisplayPublicCardModal'
import React, { type ReactElement, useState } from 'react'

import { Body } from './Body'
import { Header } from './Header'

interface CardCardPublicProps {
    card: PublicCardSchema
    deckId: number | undefined
    cardType?: 'public' | 'private'
}
// TODO : need a better way then setitng id to 0 - this is a ridiculous way to do things

const CardCardPublic: React.FC<CardCardPublicProps> = ({
    card,
    deckId,
}): ReactElement => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    return (
        <div
            className={
                'flex size-full cursor-pointer flex-col  rounded-[10px]  bg-aquamarine-100 px-[26px] py-[16px] transition-all duration-100 ease-linear hover:bg-aquamarine-900 dark:bg-tolopea dark:hover:bg-electric-violet'
            }
            onClick={() => {
                setModalIsOpen(true)
            }}
        >
            <div className={'w-full'}>
                <Header card={card} deckId={deckId ?? 0} cardType={'public'} />
                <div className={'flex items-center gap-x-[16px] pt-[20px]'}>
                    <Body card={card} />
                </div>
            </div>
            <DisplayPublicCardModal
                isOpen={modalIsOpen}
                setIsOpen={setModalIsOpen}
                card={card}
            />
        </div>
    )
}
export { CardCardPublic }
