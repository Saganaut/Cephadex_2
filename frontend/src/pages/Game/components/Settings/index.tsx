import { RadioButton } from '@common/Form/RadioButton'
import { CheckIcon } from '@heroicons/react/20/solid'
import {
    ArrowsRightLeftIcon,
    ClockIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { GameService } from '@source/client'
import { Button } from '@source/common/Buttons/Button'
import { PreferencesSelect } from '@source/common/Form/PreferencesSelect/PreferencesSelect'
import { useAppDispatch } from '@source/lib/store/hooks'
import { About } from '@source/pages/Game/components/Settings/About'
import { Option } from '@source/pages/Game/components/Settings/Option'
import { clearPlayers } from '@store/players/playersSlice'
import React, { useState } from 'react'

import { gamesData } from '../../data'

// TODO : need a better way then setitng id to 0 - this is a ridiculous way to do things

const options: Array<{ label: string; value: string; icon?: React.ReactNode }> =
    [
        {
            value: 'set-up',
            label: 'Set up',
            icon: null,
        },
        {
            value: 'about-the-game',
            label: 'About',
            icon: null,
        },
    ]

export type ValidGameType = 'classic' | 'flex' | 'pictureIt'
interface SettingsProps {
    setSteps: (steps: number) => void
    setGameId: (gameId: number | null) => void
    deckId: number
    rounds: number
    setRounds: React.Dispatch<React.SetStateAction<number>>
    type: ValidGameType
}
const Settings: React.FC<SettingsProps> = ({
    setGameId,
    rounds,
    setRounds,
    deckId,
    setSteps,
    type,
}) => {
    // const user = useAppSelector((state) => state.user.user);
    const [time, setTime] = useState(0)
    const [activeIndex, setActiveIndex] = useState(0)
    const [join, setJoin] = useState(true)
    const dispatch = useAppDispatch()
    const [correctPoints, setCorrectPoints] = useState(2)
    const [deceiverPoints, setDeceiverPoints] = useState(1)
    const handleCreateGame = async (): Promise<void> => {
        // CREATE THE GAME
        dispatch(clearPlayers())
        const response = await GameService.createNewFlexGame({
            gameType: type,
            deckId,
            rounds,
            participate: join,
            timeLimitVote: 0,
            timeLimitAnswer: time,
            pointsCorrect: correctPoints,
            pointsDeceiver: deceiverPoints,
        })

        // if (user?.id == null) return; // TODO: have better error handling for this - but we should always have a user id here
        setGameId(response.game.id)
    }

    const gameInfo = gamesData[type.toLowerCase()]

    return (
        <>
            <div
                className={
                    'mt-[46px] w-full rounded-[18px] bg-electric-violet-500 pb-4 pt-[20px] dark:bg-mariana-blue sm:px-[50px] lg:pb-[30px] '
                }
            >
                <PreferencesSelect
                    className={'mx-auto'}
                    label={''}
                    options={options}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                />

                {activeIndex === 0 && (
                    <div
                        className={
                            'mt-[55px] w-full items-center gap-x-[40px] gap-y-[20px] px-3 xl:grid xl:grid-cols-3'
                        }
                    >
                        {/*     Option */}
                        <div className="mb-6 xl:mb-0">
                            <Option
                                min={1}
                                state={rounds}
                                setState={setRounds}
                                title={'Number of rounds'}
                                description={'Minimum 1'}
                                Icon={ArrowsRightLeftIcon}
                            />
                        </div>
                        <div
                            className={
                                'group mb-6 flex w-full items-center gap-x-[10px] rounded-[12px] bg-aquamarine-100 p-[20px] hover:bg-aquamarine-900 dark:bg-mariana-blue-100 dark:hover:bg-electric-violet xl:mb-0'
                            }
                        >
                            <div
                                className={
                                    'flex size-[36px] min-w-[36px] items-center justify-center rounded-full border-[1.5px] border-tolopea dark:border-white'
                                }
                            >
                                <UserIcon
                                    className={
                                        'size-[24px] text-tolopea dark:text-white'
                                    }
                                />
                            </div>

                            <div className={'w-full'}>
                                <h1
                                    className={
                                        'select-none text-lg font-medium text-tolopea dark:text-white'
                                    }
                                >
                                    Participate
                                </h1>
                                <div
                                    className={
                                        'flex w-full items-center justify-between'
                                    }
                                >
                                    <p
                                        className={
                                            'select-none text-sm text-tolopea group-hover:text-mariana-blue dark:text-gray-300'
                                        }
                                    >
                                        {'Join the game'}
                                    </p>
                                    <div
                                        className={
                                            'flex items-center gap-x-[16px]'
                                        }
                                    >
                                        <RadioButton
                                            isChecked={join}
                                            handleInputChange={() => {
                                                setJoin(!join)
                                            }}
                                            label={join ? 'Joined' : 'Join'}
                                            theme={'marina-blue'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6 xl:mb-0">
                            <Option
                                input={false}
                                setState={setTime}
                                state={time}
                                min={0}
                                incrementBy={10}
                                Icon={ClockIcon}
                                title={'Time Limit'}
                                description={'Seconds'}
                            />
                        </div>
                        <div className="mb-6 xl:mb-0">
                            <Option
                                input={false}
                                setState={setCorrectPoints}
                                state={correctPoints}
                                min={1}
                                max={10}
                                incrementBy={1}
                                Icon={CheckIcon}
                                title={'Correct Points'}
                                description={'Points for a correct answer'}
                            />
                        </div>
                        {type === 'flex' && (
                            <Option
                                input={false}
                                setState={setDeceiverPoints}
                                state={deceiverPoints}
                                min={1}
                                max={10}
                                incrementBy={1}
                                Icon={CheckIcon}
                                title={'Deceiver Points'}
                                description={'Points for deceiving others'}
                            />
                        )}
                    </div>
                )}
                {activeIndex === 1 && gameInfo != null && (
                    <About gameInfo={gameInfo} />
                )}
            </div>

            <div
                className={
                    'mx-3 my-[20px] flex items-center justify-between pb-10 sm:mx-auto sm:w-1/5'
                }
            >
                <Button
                    label={'Back'}
                    onClick={() => {
                        setSteps(0)
                    }}
                    className="mr-8 h-10 w-36 border-2 bg-electric-violet-200 dark:border-white  dark:bg-transparent lg:py-1"
                />
                <Button
                    label={'Create'}
                    className="h-10 w-36 lg:py-1"
                    onClick={() => {
                        void handleCreateGame()
                        setSteps(2)
                    }}
                />
            </div>
        </>
    )
}

export { Settings }
