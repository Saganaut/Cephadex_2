import GameIcon from '@assets/GameIcon.svg'
import { PageHeader } from '@common/PageHeader'
import { SelectADeck } from '@common/SelectADeck'
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'
import type { DeckSchema } from '@source/client'
import { NotFoundComponent } from '@source/common/InfoComponents/NotFoundComponent/NotFoundComponent'
import { PageWrapper } from '@source/common/PageWrapper'
import {
    Settings,
    type ValidGameType,
} from '@source/pages/Game/components/Settings'
import React, { type ReactElement, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { gamesData } from '../../data'

export default function Game(): ReactElement {
    const [rounds, setRounds] = useState(10)
    const [deckId, setDeckId] = useState<number | null>(null)
    const [steps, setSteps] = useState(0)
    const [gameId, setGameId] = useState<number | null>(null)
    const [gameInfo, setGameInfo] = useState<{
        title: string
        subtitle: string
        description: string
        intro: string
        rules: string
    } | null>(null)
    const navigate = useNavigate()

    const gameType = useParams().gameType

    useEffect(() => {
        if (gameId != null && gameType != null) {
            navigate(`/game/${String(gameType)}/${gameId}`)
        }
    }, [gameId, gameType, navigate])

    useEffect(() => {
        if (gameType != null && gamesData[gameType] != null) {
            setGameInfo(gamesData[gameType])
        }
    }, [gameType])

    if (gameInfo == null) {
        return <NotFoundComponent title="Game details not found" />
    }

    return (
        <div className={'h-4/5 w-full text-white'}>
            {steps === 0 && (
                <PageWrapper>
                    <PageHeader
                        hideCategories
                        title={gameInfo.title}
                        subtitle={gameInfo.subtitle}
                        description={gameInfo.description}
                        type="withImage"
                        img={GameIcon}
                    />
                    {gameType === 'flex' && (
                        <div>
                            <SelectADeck
                                onDeckClick={(deck: DeckSchema) => {
                                    setDeckId(deck.id)
                                    setSteps(1)
                                }}
                            />
                        </div>
                    )}
                    {gameType === 'classic' && (
                        <div>
                            <SelectADeck
                                onDeckClick={(deck: DeckSchema) => {
                                    setDeckId(deck.id)
                                    setSteps(1)
                                }}
                                filter={{
                                    deckType: [
                                        'Mcq',
                                        'TrueFalse',
                                        'Mixed',
                                        'Mix',
                                        'Custom',
                                    ],
                                }}
                            />
                        </div>
                    )}
                </PageWrapper>
            )}
            {steps === 1 && (
                <div
                    className={
                        'px-9 pt-[185px] text-tolopea dark:text-white sm:px-16'
                    }
                >
                    {/*  Heading */}
                    <div className={'mx-auto w-full text-center'}>
                        <h1
                            className={
                                'text-2xl font-bold sm:mb-6 sm:text-[45px]'
                            }
                        >
                            Great Squid!
                        </h1>
                        <div
                            className={
                                'flex items-center justify-center gap-x-[12px]'
                            }
                        >
                            <div
                                className={
                                    'flex size-6 items-center justify-center rounded-full bg-electric-violet sm:size-9'
                                }
                            >
                                <AdjustmentsVerticalIcon
                                    className={
                                        'size-3 text-white sm:size-[24px]'
                                    }
                                />
                            </div>
                            <p className={'font-medium sm:text-2xl'}>
                                Now select the game settings
                            </p>
                        </div>
                    </div>
                    {deckId != null && isValidGameType(gameType) ? (
                        <Settings
                            setGameId={setGameId}
                            rounds={rounds}
                            setRounds={setRounds}
                            setSteps={setSteps}
                            deckId={deckId}
                            type={gameType}
                        />
                    ) : (
                        <NotFoundComponent
                            title="Deck not found"
                            message="We couldn't find your deck, please refresh the page or contact support"
                        />
                    )}
                </div>
            )}
        </div>
    )
}

function isValidGameType(
    gameType: string | undefined
): gameType is ValidGameType {
    if (gameType == null) return false
    const validGameTypes: ValidGameType[] = ['flex', 'classic', 'pictureIt']
    return (validGameTypes as string[]).includes(gameType)
}
