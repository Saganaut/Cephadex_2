/* eslint-disable tailwindcss/no-custom-classname */
import React from 'react'

import FullMarkDown from '../FullMarkDown'

interface SpeechBubbleProps {
    text: string
    bgColor: string
    textColor: string
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
    text,
    bgColor = 'bg-electric-violet-900',
    textColor = 'text-white',
}) => {
    return (
        <div
            className={`speech-bubble h-fit max-w-[600px] rounded-full sm:min-w-[200px] ${bgColor} `}
        >
            <p className={`speech-bubble-text text-white ${textColor}`}>
                {text}
                {/* <FullMarkDown content={text} /> */}
            </p>
        </div>
    )
}

export { SpeechBubble }
