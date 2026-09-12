import PlayerAvatar1 from '@assets/PlayerAvatar1.svg'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { UserIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import {
    ConnectionStatus,
    type PlayerGameSchema,
    PlayerStatus,
} from '@source/client'
import { BottomModalWrapper } from '@source/common/Modals/BottomModalWrapper'
import { getBgColor } from '@source/lib/utils/functions'
import React from 'react'

import { Player } from '../Player'

interface GameBottomModalProps {
    isModalOpened: boolean
    setIsModalOpened: (value: boolean) => void
    players: PlayerGameSchema[]
    bottomSection: React.ReactNode
}

const GameBottomModal: React.FC<GameBottomModalProps> = ({
    isModalOpened,
    setIsModalOpened,
    players,
    bottomSection,
}) => {
    return (
        <BottomModalWrapper isOpen={isModalOpened} setIsOpen={setIsModalOpened}>
            <div className="h-screen bg-mariana-blue text-white">
                <div className="mx-16">
                    <div className="pt-10">
                        <div
                            className={
                                'flex w-fit items-center gap-x-[8px] rounded-full bg-mariana-blue-100 px-2 py-1'
                            }
                        >
                            <UserIcon className={'size-[20px] text-white'} />
                            <p className={'text-sm font-medium'}>
                                {players.length} players
                            </p>
                            <p
                                className={
                                    'rounded-full bg-mariana-blue px-2 text-xs'
                                }
                            >
                                online
                            </p>
                        </div>
                    </div>
                    <div className="mb-5 flex items-center justify-between">
                        <div className="mt-2 flex w-full items-center justify-between rounded-lg bg-tolopea">
                            <div
                                className={'flex items-center gap-x-[8px] p-2'}
                            >
                                <img src={PlayerAvatar1} alt={'avatar'} />
                                <h1
                                    className={
                                        'text-lg font-semibold text-aquamarine'
                                    }
                                >
                                    {players.find((p) => p.isHost)?.username}
                                </h1>
                            </div>
                            <div
                                className={'mr-8 flex items-center gap-x-[2px]'}
                            >
                                <div
                                    className={
                                        'size-[7px] rounded-full bg-yellow-200'
                                    }
                                />
                                <UserPlusIcon
                                    className={'size-[20px] text-white'}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={'flex items-center justify-between'}>
                            <h1 className={'text-lg font-semibold'}>Players</h1>
                            <div className={'flex items-center gap-x-[4px]'}>
                                <h1 className={'text-sm font-medium'}>Score</h1>
                                <ChevronUpIcon
                                    className={'size-[20px] text-white'}
                                />
                            </div>
                        </div>

                        {players.map(
                            (player, i) =>
                                player.isPlayer === true && (
                                    <Player
                                        key={i}
                                        answered={
                                            player.status ===
                                            PlayerStatus.PLAYED
                                        }
                                        voted={
                                            player.status === PlayerStatus.VOTED
                                        }
                                        isOnline={
                                            player.connectionStatus ===
                                            ConnectionStatus.CONNECTED
                                        }
                                        icon={PlayerAvatar1}
                                        name={player.username}
                                        score={
                                            (player.totalPointsAnswer ?? 0) +
                                            (player.totalPointsDeceiver ?? 0)
                                        }
                                        backgroundColor={getBgColor(
                                            player.playerId
                                        )}
                                    />
                                )
                        )}
                    </div>
                </div>
            </div>
            {bottomSection}
        </BottomModalWrapper>
    )
}

export { GameBottomModal }
