import FullMarkDown from '@source/common/FullMarkDown'
import React from 'react'

import { ModalWrapper } from '../ModalWrapper'

interface ExpandContentModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    content: string
}

const ExpandContentModal: React.FC<ExpandContentModalProps> = ({
    isOpen,
    setIsOpen,
    content,
}) => {
    return (
        <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
            <div
                className={'flex flex-col items-center justify-center p-[40px]'}
            >
                <div className={'text-xl dark:text-white'}>
                    <FullMarkDown content={content} />
                </div>
            </div>
        </ModalWrapper>
    )
}

export { ExpandContentModal }
