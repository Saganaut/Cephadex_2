import { CheckIcon, LockClosedIcon } from '@heroicons/react/20/solid'
import {
    ArrowsRightLeftIcon,
    ClockIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@source/common/Buttons/Button'
import { Loading } from '@source/common/InfoComponents/Loading'
import { SharerStandard } from '@source/common/Sharing'
import { useFlexContext } from '@source/lib/contexts/FlexContext'
import { SettingsItem } from '@source/pages/Game/components/Lobby/Details/SettingsItem'
import { PlayersList } from '@source/pages/Game/components/Lobby/PlayersList'
import React from 'react'

const Lobby: React.FC = () => {
    const { shareGameData, players, game, currentPlayer, startGameNow } =
        useFlexContext()
    if (currentPlayer == null) return <Loading />

    return (
        <div
            className={
                "relative z-[5] min-h-screen w-full overflow-auto bg-game-lobby bg-cover bg-center bg-no-repeat px-9 pt-[185px] before:absolute before:inset-0 before:z-[-5] before:block before:bg-black/40  before:content-[''] sm:px-[64px]"
            }
        >
            <div className="text-center sm:hidden">
                <h1 className={'text-[45px] font-bold'}>Game Lobby</h1>
                <p className={'text-2xl font-medium'}>Waiting for players...</p>
            </div>
            <div className={'flex flex-col justify-between lg:flex-row'}>
                <div
                    className={
                        'w-full sm:mr-4 sm:h-4/5 sm:min-w-[200px] sm:max-w-[400px]'
                    }
                >
                    <PlayersList
                        players={players}
                        // handleQuitGame={handleQuitGame}
                    />
                </div>
                {/*   Details */}
                <div className={'mb-32 w-full'}>
                    {/* Heading */}
                    <div className={'hidden text-center sm:block'}>
                        <h1 className={'mb-8 text-[45px] font-bold'}>
                            Game Lobby
                        </h1>
                        <p className={'text-2xl font-medium'}>
                            Waiting for players...
                        </p>
                    </div>
                    <div
                        className={
                            'mt-[40px] grid  grid-cols-1 gap-2 gap-x-[10px] md:grid-cols-2 xl:grid-cols-3'
                        }
                    >
                        <SettingsItem
                            title={'Number of rounds'}
                            value={game?.rounds ?? 0}
                            Icon={ArrowsRightLeftIcon}
                        />
                        <SettingsItem
                            title={'Participants'}
                            value={players.length}
                            Icon={UserIcon}
                        />
                        <SettingsItem
                            title={'Time limit'}
                            value={
                                (game?.timeLimitAnswer ?? 0) <= 0
                                    ? 'No limit'
                                    : `${game?.timeLimitAnswer} seconds`
                            }
                            Icon={ClockIcon}
                        />
                        <SettingsItem
                            title={'Points per correct answer'}
                            value={game?.pointsCorrect ?? 0}
                            Icon={CheckIcon}
                        />
                        {game?.gameType === 'flex' && (
                            <SettingsItem
                                title={'Points per deception'}
                                value={game?.pointsDeceiver ?? 0}
                                Icon={CheckIcon}
                            />
                        )}
                    </div>

                    <p className={'py-[38px] text-center text-lg'}>
                        Share this link with your friends to join the game
                    </p>

                    <div
                        className={
                            'flex items-center justify-center gap-x-[20px]'
                        }
                    >
                        {/* <div className={"max-w-[225px]"}>
              <ShareLinkQr
                Icon={BsLink45Deg}
                label={"Copy link"}
                description={"You can send this link to your sea friends"}
                type={"copy"}
                valueToCopy={gameDetails?.link ?? ""}
              />
            </div>
            <div className={"max-w-[225px]"}>
              <ShareLinkQr
                Icon={QrCodeIcon}
                label={"Download QR"}
                description={"Send a QR to your contacts"}
                type={"download"}
                qrCodeValue={gameDetails?.qrCode ?? ""}
              />
            </div>
            <div className={"max-w-[225px]"}>
              <ShareLinkQr
                Icon={ArrowsPointingOutIcon}
                label={"Show QR"}
                description={"You can see the QR on your own screen"}
                type={"expand"}
                valueToCopy={gameDetails?.link ?? ""}
                qrCodeValue={gameDetails?.qrCode ?? ""}
              />
            </div> */}
                        <SharerStandard
                            valueToCopyProp={shareGameData?.link ?? ''}
                            qrCodeValueProp={shareGameData?.qrCode ?? ''}
                            preferencesSelect={false}
                            type={'game'}
                        />
                    </div>

                    {currentPlayer.isHost === true && (
                        <div
                            className={
                                'mx-auto my-[20px] flex items-center justify-center gap-x-[10px]'
                            }
                        >
                            <div
                                className={
                                    'flex size-[35px] items-center justify-center rounded-full border-2 border-mariana-blue bg-tolopea'
                                }
                            >
                                <LockClosedIcon
                                    className={'size-[18px] text-mariana-blue'}
                                />
                            </div>

                            <Button
                                disabled={players.length < 1}
                                className="bg-mariana-blue px-9 py-1"
                                label={'Play'}
                                onClick={() => {
                                    startGameNow()
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export { Lobby }
