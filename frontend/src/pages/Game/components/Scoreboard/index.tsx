import Stars from '@assets/Stars.png'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useFlexContext } from '@source/lib/contexts/FlexContext'
import { useModal } from '@source/lib/contexts/ModalContext'
import { useAppSelector } from '@source/lib/store/hooks'
import React, { type ReactElement, useEffect, useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { useNavigate } from 'react-router-dom'

import { UserPlace } from './components/UserPlace'

export interface IPlayerInfo {
    username: string
    points: number
    timesCorrect: number
    timesDeceiver: number
}

const Scoreboard: React.FC = (): // { results }
ReactElement => {
    const { players, game } = useFlexContext()
    const user = useAppSelector((state) => state.user.user)
    const [data, setData] = useState<IPlayerInfo[] | null>(null)
    const navigate = useNavigate()
    const { openSignInModal } = useModal()
    useEffect(() => {
        const total = [...players]
            ?.sort((a, b) => {
                return (b.totalPoints ?? 0) - (a.totalPoints ?? 0)
            })
            ?.map((p) => {
                return {
                    username: p.username,
                    points: p.totalPoints ?? 0,
                    timesCorrect: p.totalPointsAnswer ?? 0,
                    timesDeceiver: p.totalPointsDeceiver ?? 0,
                }
            })

        setData(total)
    }, [])

    if (data == null) return <h1></h1>

    return (
        <div>
            <div
                className={
                    'absolute left-1/2 top-0 z-10 h-screen w-1/2 -translate-x-1/2 bg-confetti bg-cover  bg-no-repeat'
                }
            />
            <div
                className={
                    'h-screen w-full overflow-auto bg-game-lobby bg-cover bg-center bg-no-repeat pt-32 md:pt-[185px] xl:px-[64px]' // relative h-[100vh] before:absolute before:inset-0 before:z-[-5] before:block before:bg-black/40 before:content-['']
                }
            >
                <div
                    className={
                        'relative z-20 flex h-full justify-between gap-x-[48px]' //
                    }
                >
                    {/* Board */}
                    <div className={'mx-auto h-fit w-[95%] xl:w-4/5'}>
                        {/* Top 3 */}
                        <div
                            className={
                                'h-fit w-full rounded-xl bg-mariana-blue pb-3 md:bg-transparent'
                            }
                        >
                            {/* YOU WIN */}
                            <div className="flex justify-center">
                                <ConfettiExplosion
                                    duration={3000}
                                    particleCount={250}
                                    width={1600}
                                    zIndex={50}
                                    colors={[
                                        '#6019FF',
                                        '#FF6E0B',
                                        '#FFBD66',
                                        '#260078',
                                        '#54FFF1',
                                    ]}
                                />
                            </div>
                            <div
                                className={
                                    'mx-auto flex w-full items-center justify-center gap-5 rounded-t-xl bg-blaze-orange  py-1 text-lg font-bold uppercase md:py-[14px]'
                                }
                            >
                                <p className="ms-2 hidden md:block">
                                    congratulations
                                </p>
                                <img className="" src={Stars} alt={'stars'} />
                                <p className="me-2 hidden whitespace-nowrap md:block">
                                    Deep dive legends
                                </p>
                            </div>

                            <div className="md:rounded-b-xl md:bg-mariana-blue md:pb-4">
                                {data.slice(0, 3).map((playerInfo, index) => (
                                    <UserPlace
                                        playerInfo={playerInfo}
                                        place={index + 1}
                                        key={index}
                                        gameType={game.gameType}
                                    />
                                ))}
                            </div>
                            <div
                                className={`grid md:mt-4 md:rounded-xl md:bg-mariana-blue md:pb-4 xl:grid-cols-2 ${
                                    data.length < 3 && 'hidden'
                                }`}
                            >
                                {data
                                    .slice(2, data.length)
                                    .map((playerInfo, index) => (
                                        <UserPlace
                                            playerInfo={playerInfo}
                                            place={index + 4}
                                            key={index + 0}
                                            gameType={game.gameType}
                                        />
                                    ))}
                            </div>
                        </div>

                        {user?.username != null && !(user?.guest ?? false) ? (
                            <button
                                type="button"
                                onClick={() => {
                                    navigate('/game')
                                }}
                                className={
                                    'mx-auto mb-[90px] mt-4 flex w-56 items-center gap-x-[18px] rounded-[14px] bg-electric-violet px-[16px] py-[8px]'
                                }
                            >
                                <ArrowPathIcon
                                    className={'size-[32px] text-white'}
                                />
                                <p className={'text-lg font-bold'}>
                                    Play Again
                                </p>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    openSignInModal('register')
                                }}
                                className={
                                    'mx-auto mb-[90px] mt-4 flex w-56 items-center gap-x-[18px] rounded-[14px] bg-electric-violet px-[16px] py-[8px]'
                                }
                            >
                                <p
                                    className={
                                        'w-full text-center text-lg font-bold'
                                    }
                                >
                                    Sign up
                                </p>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export { Scoreboard }
