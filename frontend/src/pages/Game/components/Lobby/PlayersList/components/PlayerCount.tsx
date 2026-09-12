import { UserIcon } from '@heroicons/react/24/outline'
import type { PlayerGameSchema } from '@source/client'
import React from 'react'

interface PlayerCountProps {
    players: PlayerGameSchema[]
}

const PlayerCount: React.FC<PlayerCountProps> = ({ players }) => {
    return (
        <div
            className={
                'flex w-full items-center gap-x-[8px] rounded-full bg-mariana-blue-100 px-2 py-1 lg:w-auto'
            }
        >
            <UserIcon className={'size-[20px] text-white'} />
            <p className={'text-sm font-medium'}>{players.length} players</p>
            <p className={'rounded-full bg-mariana-blue px-2 text-xs'}>
                online
            </p>
        </div>
    )
}

export { PlayerCount }
