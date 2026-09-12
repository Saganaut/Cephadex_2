import {
    PencilSquareIcon,
    QrCodeIcon,
    ShareIcon,
} from '@heroicons/react/24/outline'
import { ModalWrapper } from '@source/common/Modals/ModalWrapper'
import { SharerStandard } from '@source/common/Sharing'
import React, { type SetStateAction } from 'react'

const options: Array<{
    label: string
    value: string
    icon?: React.SVGProps<SVGSVGElement>
}> = [
    {
        label: 'By email',
        value: 'email',
        icon: <PencilSquareIcon className={'size-[20px] text-white'} />,
    },
    {
        label: 'Link & QR',
        value: 'linkqr',
        icon: <QrCodeIcon className={'size-[20px] text-white'} />,
    },
    {
        label: 'Socials',
        value: 'socials',
        icon: <ShareIcon className={' size-[20px] text-white'} />,
    },
]
interface AssignQuizModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<SetStateAction<boolean>>
    quizId: number
}
const AssignQuizModal: React.FC<AssignQuizModalProps> = ({
    setIsOpen,
    isOpen,
    quizId,
}) => {
    const [activeIndex, setActiveIndex] = React.useState(0)
    return (
        <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
            <div
                className={
                    'mx-auto rounded-2xl px-[46px] py-[100px]  text-white'
                }
            >
                <SharerStandard
                    setActiveIndex={setActiveIndex}
                    activeIndex={activeIndex}
                    options={options}
                    type="quiz"
                    itemId={quizId}
                />
            </div>
        </ModalWrapper>
    )
}
export { AssignQuizModal }
