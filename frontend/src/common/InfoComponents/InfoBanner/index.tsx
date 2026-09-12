import { useFeedbackModal } from '@source/lib/contexts/FeedbackContext'
import React from 'react'

interface InfoBannerProps {
    message: string
    type: 'info' | 'news' | 'warning' | string
}

const InfoBanner: React.FC<InfoBannerProps> = ({ message, type }) => {
    const { setIsFeedbackModalOpen } = useFeedbackModal()
    const className =
        type === 'info'
            ? 'bg-mariana-blue'
            : type === 'news'
              ? 'bg-mariana-blue'
              : 'bg-blaze-orange'

    return (
        <div className={`fixed top-0 z-[99999] h-[50px] w-full  ${className}`}>
            <div
                className={`flex items-center justify-center  p-2 text-xs text-white lg:p-4 lg:text-base ${className}`}
            >
                <p>
                    {message}
                    <span
                        className="cursor-pointer underline"
                        onClick={() => {
                            setIsFeedbackModalOpen(true)
                        }}
                    >
                        Feedback
                    </span>
                </p>
            </div>
        </div>
    )
}

export { InfoBanner }
