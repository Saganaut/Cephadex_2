import PlayerAvatar1 from '@source/assets/PlayerAvatar1.svg?react'
import PlayerAvatar2 from '@source/assets/PlayerAvatar2.svg?react'
import PlayerAvatar3 from '@source/assets/PlayerAvatar3.svg?react'
import React from 'react'

import {
    classicIntro,
    classicRules,
    flexIntro,
    flexRules,
    pictureItIntro,
    pictureItRules,
} from './gameCopy'
type GameChoicesType = Record<
    string,
    {
        title: string
        subtitle: string
        description: string
        intro: string
        rules: string
    }
>
const gamesData: GameChoicesType = {
    flex: {
        title: 'Flex',
        subtitle:
            'Show off your knowledge while trying to deceive your friends.',
        description: 'Select any deck to play with',
        intro: flexIntro,
        rules: flexRules,
    },
    classic: {
        title: 'Classic',
        subtitle:
            'Compete against your friends to see who can get the most questions right.',
        description:
            'Select a deck containing multiple-choice or true/false questions',
        intro: classicIntro,
        rules: classicRules,
    },
    pictureIt: {
        title: 'Picture it',
        subtitle: 'Coming soon!',
        description:
            'Use AI generated imagery to battle against your friends in this game of wits.',
        intro: pictureItIntro,
        rules: pictureItRules,
    },
}

const GameChoices = [
    {
        gameName: 'Flex',
        description:
            'Show off your knowledge while trying to deceive your friends.',
        gameRef: '/game/flex',
        imgAvatar: <PlayerAvatar1 />,
    },
    {
        gameName: 'Classic',
        description:
            'Compete against your friends to see who can get the most questions right.',
        gameRef: '/game/classic',
        imgAvatar: <PlayerAvatar2 />,
    },
    {
        gameName: 'Picture it',
        description: 'A new game mode is on the way!',
        gameRef: '/game/pictureIt',
        imgAvatar: <PlayerAvatar3 />,
    },
]

export { gamesData }
export { GameChoices }
