import React from 'react'

import { GameChoices } from '../data'
import { GameOption } from './GameOption'

const GameSelector: React.FC = () => {
    return (
        <div className="flex flex-wrap justify-center gap-4">
            {GameChoices.map((game, index) => (
                <GameOption
                    key={index}
                    gameName={game.gameName}
                    description={game.description}
                    gameRef={game.gameRef}
                    imgAvatar={game.imgAvatar}
                />
            ))}
        </div>
    )
}

export { GameSelector }
