import type { CardSchema, PublicCardSchema } from '@source/client'
import FullMarkDown from '@source/common/FullMarkDown'
import { truncate } from '@source/lib/utils/functions'
import React from 'react'

interface BodyProps {
    card: CardSchema | PublicCardSchema
}
const Body: React.FC<BodyProps> = ({ card }) => {
    return (
        <>
            <h1
                className={
                    'size-[48px] min-w-[48px] rounded-full bg-electric-violet text-center text-[32px] font-bold text-aquamarine'
                }
            >
                {card?.category?.charAt(0) ?? ''}
            </h1>
            <div
                className={
                    'text-[14px] font-medium text-tolopea dark:text-white'
                }
            >
                <FullMarkDown content={truncate(card?.content ?? '', 100)} />
            </div>
        </>
    )
}

export { Body }
