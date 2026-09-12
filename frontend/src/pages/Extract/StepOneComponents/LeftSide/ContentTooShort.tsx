import React from 'react'

const ContentTooShort: React.FC = () => {
    return (
        <div className="text-3xs min-h-[10px] text-red-500 sm:min-h-[20px]">
            Please provide longer content, this content is too short to create a
            deck. (Minimum 1100 characters)
        </div>
    )
}

export { ContentTooShort }
