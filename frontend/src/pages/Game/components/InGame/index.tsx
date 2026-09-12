import { GameStatus } from '@source/client'
import { Loading } from '@source/common/InfoComponents/Loading'
import { useFlexContext } from '@source/lib/contexts/FlexContext'
import { Lobby } from '@source/pages/Game/components/Lobby'
import { Playground } from '@source/pages/Game/components/Playground'
import { Scoreboard } from '@source/pages/Game/components/Scoreboard'
import React, { type ReactElement } from 'react'

const InGame = (): ReactElement => {
    const { game } = useFlexContext()
    if (game == null) return <Loading />

    const playground =
        game.status === GameStatus.IN_GAME ||
        game.status === GameStatus.VOTING ||
        game.status === GameStatus.POST_VOTING ||
        game.status === GameStatus.WAITING_FOR_ROUND_START ||
        game.status === GameStatus.ANSWERING ||
        game.status === GameStatus.POST_ANSWERING

    return (
        <div className={'size-full  grow text-white'}>
            {game.status === GameStatus.IN_LOBBY && <Lobby />}
            {playground && <Playground />}
            {game.status === GameStatus.ENDED && <Scoreboard />}
        </div>
    )
}

export default InGame
