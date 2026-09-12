import React from 'react'

import { TitleSection } from './TitleSection'
import { VideoSection } from './VideoSection'

interface HeroSectionProps {
    diveInRef: React.RefObject<HTMLDivElement>
    openSignInModal: (type: 'login' | 'register') => void
}

const HeroSection: React.FC<HeroSectionProps> = ({
    openSignInModal,
    diveInRef,
}) => {
    return (
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-2 px-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-8 flex w-full justify-center lg:mb-0 lg:w-1/2 lg:justify-start">
                <div className="w-full max-w-[600px]">
                    <TitleSection
                        openSignInModal={openSignInModal}
                        diveInRef={diveInRef}
                    />
                </div>
            </div>

            <div className="mt-8 flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
                <div className="w-full max-w-[600px]">
                    <VideoSection />
                </div>
            </div>
        </div>
    )
}

export { HeroSection }
