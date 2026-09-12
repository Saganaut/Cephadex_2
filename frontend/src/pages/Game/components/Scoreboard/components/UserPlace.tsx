import PurpleCheckIcon from '@assets/PurpleCheckIcon.svg?react'
import PurpleMasksIcon from '@assets/PurpleMasksIcon.svg?react'
import PurpleStarIcon from '@assets/PurpleStarIcon.svg?react'
import React from 'react'

import type { IPlayerInfo } from '..'
import { UserInfo } from './UserInfo'
import { UserPlaceItem } from './UserPlaceItem'

const UserPlace: React.FC<{
    playerInfo: IPlayerInfo
    place: number
    gameType: 'flex' | 'classic'
}> = ({ playerInfo, place, gameType }) => {
    const iconClass = 'size-6 rounded-full bg-white p-1'

    return (
        <div className="md:pt-4">
            <div
                className={`mt-4 flex h-11 md:mt-0 ${
                    place === 1
                        ? 'md:w-[90%]'
                        : place === 2
                          ? 'md:w-4/5'
                          : place === 3
                            ? 'md:w-[70%]'
                            : 'md:w-[90%]'
                } mx-5 items-center justify-between rounded-full bg-electric-violet-200 p-[8px] md:mx-auto`}
            >
                <UserInfo place={place} playerInfo={playerInfo} />
                <div className="flex gap-2">
                    {[
                        playerInfo.points,
                        playerInfo.timesCorrect,
                        playerInfo.timesDeceiver,
                    ].map((points, index) => (
                        <>
                            {index === 0 && (
                                <UserPlaceItem
                                    icon={
                                        <PurpleStarIcon className={iconClass} />
                                    }
                                    index={index}
                                    points={points}
                                />
                            )}
                            {index === 1 && gameType === 'flex' && (
                                <UserPlaceItem
                                    icon={
                                        <PurpleCheckIcon
                                            className={iconClass}
                                        />
                                    }
                                    index={index}
                                    points={points}
                                />
                            )}
                            {index === 2 && gameType === 'flex' && (
                                <UserPlaceItem
                                    icon={
                                        <PurpleMasksIcon
                                            className={iconClass}
                                        />
                                    }
                                    index={index}
                                    points={points}
                                />
                            )}
                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { UserPlace }
