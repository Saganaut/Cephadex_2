import { Footer } from '@layouts/PublicLayout/Footer/Footer'
import { NavBar } from '@layouts/PublicLayout/NavBar/NavBar'
import { InfoBanner } from '@source/common/InfoComponents/InfoBanner'
import { MessagingModal } from '@source/common/Modals/MessagingModal'
import { SignInModal } from '@source/common/Modals/SignInModal'
import { useBannerContext } from '@source/lib/contexts/BannerContext'
import React from 'react'

interface PublicLayoutProps {
    children: React.ReactNode
    bgColor?: string
}
const PublicLayout: React.FC<PublicLayoutProps> = ({ children, bgColor }) => {
    const { banner } = useBannerContext()

    const backGColor = bgColor ?? 'bg-transparent'

    const bannerHeight = banner != null ? 'mt-12' : 'mt-0 '
    // const minHeightClass = banner != null ? "mt-[0px]" : "min-h-[100vh]";

    return (
        <>
            {banner != null && (
                <InfoBanner
                    message={banner.message}
                    type={banner.messageType}
                />
            )}
            <div className={`flex flex-col ${bannerHeight}`}>
                <MessagingModal />
                <SignInModal />
                <NavBar />
                <div
                    className={`flex h-max min-h-screen min-w-[100vw] ${backGColor}`}
                >
                    {children}
                </div>
                <Footer />
            </div>
        </>
    )
}

export { PublicLayout }
