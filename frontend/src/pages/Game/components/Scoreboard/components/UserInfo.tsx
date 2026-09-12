import Avatar from '@assets/PlayerAvatar1.svg'
import { StarIcon } from '@heroicons/react/20/solid'
import React from 'react'

import type { IPlayerInfo } from '..'

interface UserInfoProps {
    place: number
    playerInfo: IPlayerInfo
}

const UserInfo: React.FC<UserInfoProps> = ({ place, playerInfo }) => {
    return (
        <div className={'flex items-center gap-x-[10px]'}>
            <div
                className={`relative size-8 md:size-[46px] ${
                    place > 3 && 'hidden'
                }`}
            >
                <h1
                    className={
                        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium md:font-bold'
                    }
                >
                    {place}
                </h1>
                <StarIcon
                    className={`size-8 md:size-[46px] ${
                        place === 1
                            ? 'text-blaze-orange-100'
                            : place === 2
                              ? 'text-gray-600'
                              : 'text-amber-700'
                    }`}
                />
            </div>
            <img src={Avatar} alt={'avatar'} className="hidden md:block" />
            <p className={`${place > 3 && 'ms-8'} text-lg md:font-bold`}>
                {playerInfo.username}
            </p>
        </div>
    )
}

export { UserInfo }
