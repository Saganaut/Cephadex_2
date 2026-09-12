import PlayerAvatar1 from '@assets/PlayerAvatar1.svg'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import type { UserSchema } from '@source/client'
import React from 'react'

interface BottomSectionProps {
    user: UserSchema
    setIsModalOpened: (value: boolean) => void
    isModalOpened: boolean
    innerButtons?: React.ReactNode
}

const BottomSection: React.FC<BottomSectionProps> = ({
    user,
    setIsModalOpened,
    isModalOpened,
    innerButtons,
}) => {
    return (
        <div className="fixed bottom-0 left-0 z-20 mt-10 w-full rounded-t-3xl border-t-2 border-white/40 bg-mariana-blue text-white">
            <div className="mb-6 mt-8 flex items-center justify-center gap-5">
                <div className="my-[10px] flex h-10 w-[185px] items-center justify-between rounded-full bg-electric-violet p-1">
                    <div className={'flex items-center gap-2'}>
                        <img src={PlayerAvatar1} alt={'avatar'} />
                        <h1 className={'text-lg font-semibold text-aquamarine'}>
                            {user.username}
                        </h1>
                    </div>

                    <div className={'mr-2 flex items-center gap-x-[2px]'}>
                        <div
                            className={'size-[7px] rounded-full bg-yellow-200'}
                        />
                        <UserPlusIcon className={'size-[20px] text-white'} />
                    </div>
                </div>
                <div
                    onClick={() => {
                        setIsModalOpened(!isModalOpened)
                    }}
                    className="size-10 rounded-full border-2 border-white bg-electric-violet"
                >
                    {isModalOpened ? (
                        <ChevronDownIcon className={' text-white '} />
                    ) : (
                        <ChevronUpIcon className={' text-white '} />
                    )}
                </div>
            </div>
            {innerButtons != null && (
                <div className="mx-14 mb-8">{innerButtons}</div>
            )}
        </div>
    )
}

export { BottomSection }
