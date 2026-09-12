import FullMarkDown from '@source/common/FullMarkDown'
import { ExpandContentModal } from '@source/common/Modals/ExpandContentModal/ExpandContentModal'
import React from 'react'

interface QuestionTextProps {
    content: string
}

const QuestionText: React.FC<QuestionTextProps> = ({ content }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    return (
        <div
            className="max-h-[100px] cursor-pointer overflow-hidden px-2 text-xs md:text-base"
            onClick={() => {
                setIsOpen(!isOpen)
            }}
        >
            <FullMarkDown content={content} />
            <ExpandContentModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                content={content}
            />
        </div>
    )
}

export { QuestionText }
