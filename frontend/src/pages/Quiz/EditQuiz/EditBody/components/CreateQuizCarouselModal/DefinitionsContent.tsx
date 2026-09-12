import FullMarkDown from '@source/common/FullMarkDown'
import React from 'react'

interface DefinitionsContentProps {
    content: string
}

const DefinitionsContent: React.FC<DefinitionsContentProps> = ({ content }) => {
    return (
        <div
            className={
                'mx-auto w-full px-2 py-4 text-lg font-medium text-white'
            }
        >
            <div>
                <FullMarkDown content={content} />
            </div>
        </div>
    )
}

export { DefinitionsContent }
