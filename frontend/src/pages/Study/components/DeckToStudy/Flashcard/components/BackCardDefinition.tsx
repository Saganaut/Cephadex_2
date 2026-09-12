import FullMarkDown from '@source/common/FullMarkDown'
import React from 'react'

interface BackCardDefinitionProps {
    text: string
    type?: 'study' | 'card-modal'
}

const BackCardDefinition: React.FC<BackCardDefinitionProps> = ({
    text,
    type = 'study',
}) => {
    const studyClass = 'flex h-full flex-col items-start justify-center'
    const modalClass = 'max-h-[200px] overflow-auto'

    const classToUse =
        type === 'study' ? studyClass : type === 'card-modal' ? modalClass : ''

    return (
        <div className={classToUse}>
            {' '}
            <FullMarkDown content={text} />
        </div>
    )
}

export { BackCardDefinition }
