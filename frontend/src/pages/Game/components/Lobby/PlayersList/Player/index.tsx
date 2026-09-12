import CheckMarkIcon from '@assets/CheckIcon.svg?react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface PlayerProps {
    icon: any
    backgroundColor: string
    name: string
    score: number
    answered: boolean | undefined
    voted: boolean | undefined
    isOnline?: boolean
}
const Player: React.FC<PlayerProps> = ({
    backgroundColor,
    score,
    name,
    icon,
    isOnline,
    answered,
    voted,
}) => {
    return (
        <div
            className={twMerge(
                'my-[10px] w-full flex items-center justify-between rounded-full p-[6px] ',
                backgroundColor
            )}
        >
            <div className={'flex items-center'}>
                <div className={'relative  size-[35px] rounded-full'}>
                    <img src={icon} alt={'avatar'} />
                    {isOnline === true && (
                        <div
                            className={
                                'absolute bottom-[-2px] right-[-2px] size-[14px] rounded-full border-2 border-electric-violet bg-green-500'
                            }
                        />
                    )}
                    {isOnline === false && (
                        <div
                            className={
                                'absolute bottom-[-2px] right-[-2px] size-[14px] rounded-full border-2 border-electric-violet bg-red-500'
                            }
                        />
                    )}
                </div>
                <h1 className={'pl-[12px] pr-[20px] text-lg font-medium'}>
                    {name}
                </h1>
                {answered === true ? (
                    <CheckMarkIcon className="mx-1 size-4" />
                ) : (
                    ''
                )}
                {voted === true ? (
                    <CheckMarkIcon className="mx-1 size-4" />
                ) : (
                    ''
                )}
            </div>

            <p
                className={
                    'mr-[22px] flex size-[22px] min-w-[22px] items-center justify-center rounded-full bg-mariana-blue text-xs font-medium'
                }
            >
                {score ?? 0}
            </p>
        </div>
    )
}
export { Player }
