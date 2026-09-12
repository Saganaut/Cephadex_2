import GameIcon from '@assets/GameIcon.svg'
import { PageHeader } from '@source/common/PageHeader'
import { PageWrapper } from '@source/common/PageWrapper'
import React from 'react'

import { GameSelector } from './components/GameSelector'

const GamePicker: React.FC = () => {
    return (
        <div className={'h-4/5 w-full text-white'}>
            <PageWrapper>
                <PageHeader
                    hideCategories
                    title={'Fun Zone!'}
                    subtitle={'Put your knowledge to the test!'}
                    description={'Choose the type of game you want to play'}
                    type="withImage"
                    img={GameIcon}
                />
                <GameSelector />
            </PageWrapper>
        </div>
    )
}

export default GamePicker
