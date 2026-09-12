import PlayerAvatar1 from '@assets/PlayerAvatar1.svg'
import { UserPlusIcon } from '@heroicons/react/20/solid'
import type { PlayerGameSchema } from '@source/client'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface HostTagProps {
    players: PlayerGameSchema[]
}

const HostTag: React.FC<HostTagProps> = ({ players }) => {
    return (
        <div
            className={twMerge(
                'my-[10px] flex items-center bg-tolopea justify-between rounded-[8px] p-[6px]'
            )}
        >
            <div className={'flex items-center gap-x-[8px]'}>
                <img src={PlayerAvatar1} alt={'avatar'} />
                <h1 className={'text-lg font-semibold text-aquamarine'}>
                    {players.find((p) => p.isHost)?.username}
                </h1>
            </div>

            <div className={'flex items-center gap-x-[2px]'}>
                <div className={'size-[7px] rounded-full bg-yellow-200'} />
                <UserPlusIcon className={'size-[20px] text-white'} />
            </div>
        </div>
    )
}

export { HostTag }
