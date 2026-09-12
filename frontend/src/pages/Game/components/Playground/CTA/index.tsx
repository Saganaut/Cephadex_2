import { ArrowRightCircleIcon } from '@heroicons/react/20/solid'
import {
    FlagIcon,
    NoSymbolIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
} from '@heroicons/react/24/outline'
// import { HandRaisedIcon } from '@heroicons/react/24/solid'
import type { GameStatus } from '@source/client'
import { IconButton } from '@source/common/Buttons/IconButton'
import { Timer } from '@source/pages/Game/components/Playground/CTA/Timer'
import type { ITimerState } from '@source/types'
import React from 'react'
// import { BsFullscreen } from 'react-icons/bs'

interface CTAProps {
    gameState: GameStatus
    timerState: ITimerState
    setTimerState: React.Dispatch<React.SetStateAction<ITimerState>>
    rounds: number
    timeLimitAnswer: number
    isHost: boolean
    mute: () => void
    unmute: () => void
    audioPlaying: boolean
    handleHostFunctions: () => void
    endGame: () => void
    currentRound: number
    label: string
    seconds: number
}
const CTA: React.FC<CTAProps> = ({
    currentRound,
    gameState,
    rounds,
    setTimerState,
    timerState,
    timeLimitAnswer,
    isHost,
    unmute,
    mute,
    audioPlaying,
    handleHostFunctions,
    endGame,
    label,
    seconds,
}) => {
    return (
        <>
            <div
                className={
                    'flex w-full items-center justify-between rounded-[12px] bg-mariana-blue p-3 lg:py-6'
                }
            >
                <div className={'flex items-center gap-x-[8px]'}>
                    {/*   Round Number */}

                    <div>
                        <p
                            className={
                                'mb-3 text-sm font-medium text-aquamarine lg:text-white'
                            }
                        >
                            {rounds} Rounds
                        </p>
                        <div className="flex gap-3">
                            <div
                                className={
                                    'flex items-center gap-x-[8px] rounded-full border-2 border-electric-violet-900 bg-electric-violet-900 px-[14px] py-1 text-white lg:py-[6px]'
                                }
                            >
                                <FlagIcon
                                    className={'size-[24px] text-white'}
                                />
                                <h1>Round {currentRound ?? 0}</h1>
                            </div>
                            <div
                                onClick={() => {
                                    if (audioPlaying) {
                                        mute()
                                    } else {
                                        unmute()
                                    }
                                }}
                                className={
                                    'flex size-[35px] cursor-pointer items-center justify-center rounded-full bg-electric-violet-900 xl:hidden'
                                }
                            >
                                {audioPlaying ? (
                                    <SpeakerWaveIcon
                                        className={'size-[20px] text-white'}
                                    />
                                ) : (
                                    <SpeakerXMarkIcon
                                        className={'size-[20px] text-white'}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {/*   Reveal answers */}
                </div>
                {/*  Timer */}
                <div
                    className={
                        'mt-1 flex flex-col  items-center gap-x-[8px] text-white lg:bg-mariana-blue'
                    }
                >
                    <Timer
                        gameState={gameState}
                        timerState={timerState}
                        setTimerState={setTimerState}
                        seconds={seconds}
                        initialSeconds={timeLimitAnswer}
                    />
                    <div className="mt-2">seconds</div>
                </div>

                <div className={'hidden items-center gap-x-[8px] xl:flex'}>
                    {/* <div
                        className={
                            'flex size-[35px] items-center justify-center rounded-full bg-mariana-blue-100'
                        }
                    >
                        <BsFullscreen className={'size-[16px] text-white'} />
                    </div> */}
                    <div
                        onClick={() => {
                            if (audioPlaying) {
                                mute()
                            } else {
                                unmute()
                            }
                        }}
                        className={
                            'flex size-[35px] cursor-pointer items-center justify-center rounded-full bg-mariana-blue-100'
                        }
                    >
                        {audioPlaying ? (
                            <SpeakerWaveIcon
                                className={'size-[20px] text-white'}
                            />
                        ) : (
                            <SpeakerXMarkIcon
                                className={'size-[20px] text-white'}
                            />
                        )}
                    </div>
                </div>

                <div className={'hidden items-center gap-x-[8px] lg:flex'}>
                    {isHost && (
                        <IconButton
                            icon={<ArrowRightCircleIcon />}
                            onClick={() => {
                                handleHostFunctions()
                            }}
                            classname={'flex-row-reverse w-fit'}
                            ariaLabel={label}
                            to={''}
                            theme={'orange'}
                            collapse={false}
                        />
                    )}

                    {isHost && (
                        <IconButton
                            icon={<NoSymbolIcon />}
                            onClick={() => {
                                endGame()
                            }}
                            classname={'flex-row-reverse w-fit'}
                            ariaLabel={'End game'}
                            to={''}
                            theme={'violet'}
                            collapse={false}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
export { CTA }
