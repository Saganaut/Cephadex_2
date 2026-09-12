import DeleteIcon from '@assets/cardMenuIcons/DeleteIcon.svg?react'
import { FavoriteToggler } from '@common/Favorite'
import { PencilIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'
import React from 'react'

interface CTAButtonsProps {
    editModal: boolean
    setEditModal: React.Dispatch<React.SetStateAction<boolean>>
    deleteModal: boolean
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
    itemId: number | undefined
    isFavorite: boolean | null | undefined
}

const CTAButtons: React.FC<CTAButtonsProps> = ({
    editModal,
    setEditModal,
    setDeleteModal,
    deleteModal,
    itemId,
    isFavorite,
}) => {
    return (
        <div
            id="study-CTA-buttons"
            className={'hidden items-center justify-end gap-x-[20px] lg:flex'}
        >
            <div
                className={
                    'flex size-[35px] cursor-not-allowed items-center justify-center rounded-full bg-aquamarine-900 opacity-50 hover:bg-blaze-orange-100 dark:bg-electric-violet'
                }
            >
                <SpeakerWaveIcon
                    className={'size-[24px] text-tolopea dark:text-aquamarine'}
                />
            </div>
            <div
                onClick={() => {
                    setEditModal(!editModal)
                }}
                className={
                    'flex size-[35px] cursor-pointer items-center justify-center rounded-full bg-aquamarine-900 hover:bg-blaze-orange-100 dark:bg-electric-violet'
                }
            >
                <PencilIcon
                    className={'size-[22px] text-tolopea dark:text-aquamarine '}
                />
            </div>
            <div
                onClick={() => {
                    setDeleteModal(!deleteModal)
                }}
                className={
                    'flex size-[35px] cursor-pointer items-center justify-center rounded-full bg-aquamarine-900 hover:bg-blaze-orange-100 dark:bg-electric-violet'
                }
            >
                <DeleteIcon
                    className={'size-[22px] text-tolopea dark:text-white'}
                />
            </div>
            <div
                className={
                    'flex size-[35px] cursor-pointer items-center justify-center rounded-full bg-aquamarine-900 hover:bg-blaze-orange-100 dark:bg-electric-violet'
                }
            >
                <FavoriteToggler
                    itemId={itemId ?? 0}
                    isFavorite={isFavorite ?? false}
                    itemType={'card'}
                />
                {/* <StarIcon className={"h-[22px] w-[22px] text-aquamarine"} /> */}
            </div>
        </div>
    )
}
export { CTAButtons }
