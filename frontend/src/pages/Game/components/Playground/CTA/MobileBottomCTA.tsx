import { ArrowRightCircleIcon } from '@heroicons/react/20/solid'
import { NoSymbolIcon } from '@heroicons/react/24/outline'
import { GameStatus } from '@source/client'
import { IconButton } from '@source/common/Buttons/IconButton'
import type { ITimerState } from '@source/types'
import React from 'react'

interface CTAProps {
    gameState: GameStatus
    isHost: boolean
    handleHostFunctions: () => void
    endGame: () => void
    label: string
    seconds: number
}
const MobileBottomCTA: React.FC<CTAProps> = ({
    gameState,
    isHost,
    handleHostFunctions,
    endGame,
    label,
    seconds,
}) => {
    //TODO: include seconds here
    return (
        <div className={'w-full rounded-[12px]'}>
            <div className={'flex items-center justify-between gap-2'}>
                {gameState === GameStatus.IN_GAME ? (
                    <>
                        {isHost && (
                            <IconButton
                                icon={<NoSymbolIcon />}
                                onClick={() => {
                                    endGame()
                                }}
                                classname={'flex-row-reverse w-fit h-10'}
                                ariaLabel={'End Game'}
                                to={''}
                                theme={'violet'}
                                collapse={false}
                            />
                        )}
                    </>
                ) : (
                    <>
                        {isHost && (
                            <IconButton
                                icon={<NoSymbolIcon />}
                                onClick={() => {
                                    endGame()
                                }}
                                classname={
                                    'flex-row-reverse w-fit h-10 whitespace-nowrap'
                                }
                                ariaLabel={'End Game'}
                                to={''}
                                theme={'violet'}
                                collapse={false}
                            />
                        )}
                    </>
                )}

                {isHost && (
                    <IconButton
                        icon={<ArrowRightCircleIcon />}
                        onClick={() => {
                            handleHostFunctions()
                        }}
                        classname={
                            'w-full flex-row-reverse whitespace-nowrap h-10'
                        }
                        ariaLabel={label}
                        to={''}
                        theme={'orange'}
                        collapse={false}
                    />
                )}
            </div>
        </div>
    )
}
export { MobileBottomCTA }
