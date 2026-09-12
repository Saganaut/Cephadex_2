import FullMarkDown from '@source/common/FullMarkDown'
import { ExpandContentModal } from '@source/common/Modals/ExpandContentModal/ExpandContentModal'
import React from 'react'

interface ContentTextProps {
    content: string
}

const ContentText: React.FC<ContentTextProps> = ({ content }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div
            className={'mx-auto max-h-[80px] w-4/5 overflow-hidden px-2 py-4'}
            onClick={() => {
                setIsOpen(!isOpen)
            }}
        >
            {' '}
            <FullMarkDown content={content} />
            <ExpandContentModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                content={content}
            />
        </div>
    )
}

export { ContentText }
