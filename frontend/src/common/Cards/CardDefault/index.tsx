import type { DeckSchema, GroupSchema, QuizSchema } from '@source/client'
import React from 'react'
import { twMerge } from 'tailwind-merge'

import { Body } from './Body'
import { Footer } from './Footer'
import { Header } from './Header'

interface CardDefaultProps {
    data: DeckSchema | QuizSchema | GroupSchema
    style?: string
}

const CardDefault: React.FC<CardDefaultProps> = ({ data, style }) => {
    return (
        <div
            className={twMerge(
                `flex flex-col justify-between h-full cursor-pointer w-full rounded-3xl px-[28px] py-[20px] ${
                    style === 'group'
                        ? 'bg-mariana-blue-100 text-white hover:bg-mariana-blue'
                        : 'dark:bg-mariana-blue bg-electric-violet-700 dark:text-white text-tolopea dark:hover:bg-electric-violet hover:bg-aquamarine-900'
                }`
            )}
        >
            <div className="grow">
                <Header data={data} style={style} />
                <Body data={data} style={style} />
            </div>
            <Footer data={data} style={style} />
        </div>
    )
}

export { CardDefault }
