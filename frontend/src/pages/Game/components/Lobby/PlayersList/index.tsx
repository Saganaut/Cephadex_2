import PlayerAvatar1 from '@assets/PlayerAvatar1.svg'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import {
    ConnectionStatus,
    type PlayerGameSchema,
    PlayerStatus,
} from '@source/client'
import { NotFoundComponent } from '@source/common/InfoComponents/NotFoundComponent/NotFoundComponent'
import { useAppSelector } from '@source/lib/store/hooks'
import { getBgColor } from '@source/lib/utils/functions'
import React, { useState } from 'react'

import { BottomSection } from './BottomSection'
import { ExitGame } from './components/ExitGame'
import { GameBottomModal } from './components/GameBottomModal'
import { HostTag } from './components/HostTag'
import { PlayerCount } from './components/PlayerCount'
import { Player } from './Player'

interface PlayersListProps {
    players: PlayerGameSchema[]
    handleQuitGame?: () => void
    innerButtons?: React.ReactNode
}
const PlayersList: React.FC<PlayersListProps> = ({
    players,
    handleQuitGame,
    innerButtons,
}) => {
    const user = useAppSelector((state) => state.user)
    const [isModalOpened, setIsModalOpened] = useState(false)

    if (user.user == null) return <NotFoundComponent />
    return (
        <>
            <div
                className={
                    'hidden h-fit w-full flex-col rounded-[14px] bg-mariana-blue p-[12px] text-white lg:flex'
                }
            >
                <div
                    className={
                        'mb-4 flex flex-col items-center justify-between gap-2 lg:flex-row'
                    }
                >
                    <PlayerCount players={players} />
                    <ExitGame handleQuitGame={handleQuitGame} />
                </div>
                <HostTag players={players} />
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
                                        player.status === PlayerStatus.PLAYED
                                    }
                                    voted={player.status === PlayerStatus.VOTED}
                                    isOnline={
                                        player.connectionStatus ===
                                        ConnectionStatus.CONNECTED
                                    }
                                    icon={PlayerAvatar1}
                                    name={player.username}
                                    score={player.totalPoints ?? 0}
                                    backgroundColor={getBgColor(
                                        player.playerId
                                    )}
                                />
                            )
                    )}
                </div>
            </div>
            <div className="lg:hidden">
                <GameBottomModal
                    isModalOpened={isModalOpened}
                    setIsModalOpened={setIsModalOpened}
                    players={players}
                    bottomSection={
                        <BottomSection
                            user={user.user}
                            setIsModalOpened={setIsModalOpened}
                            isModalOpened={isModalOpened}
                            innerButtons={innerButtons}
                        />
                    }
                />
                <BottomSection
                    user={user.user}
                    setIsModalOpened={setIsModalOpened}
                    isModalOpened={isModalOpened}
                    innerButtons={innerButtons}
                />{' '}
            </div>
        </>
    )
}
export { PlayersList }
