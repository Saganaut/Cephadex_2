// import { BellIcon } from "@heroicons/react/20/solid";
import { NavBarApp } from '@layouts/PrivateLayout/NavBar/AppNavBar'
import { SideBarApp } from '@layouts/PrivateLayout/SideBar/SideBar'
import { InfoBanner } from '@source/common/InfoComponents/InfoBanner'
import { CardCopyModal } from '@source/common/Modals/CardCopyModal'
import { CardStatModal } from '@source/common/Modals/CardStatModal'
import { DeleteCardModalSimple } from '@source/common/Modals/DeleteConfirmationModal/DeleteCardModal/DeleteCardModalSimple'
import { DeleteDeckModal } from '@source/common/Modals/DeleteConfirmationModal/DeleteDeckModal'
import { ExportDeckModal } from '@source/common/Modals/ExportDeckModal'
import { FeedbackModal } from '@source/common/Modals/FeedbackModal'
import { ImportDeckModal } from '@source/common/Modals/ImportDeckModal'
import { MessagingModal } from '@source/common/Modals/MessagingModal'
import { NewCardModal } from '@source/common/Modals/NewCardModal'
import { NotificationsModal } from '@source/common/Modals/NotificationsModal'
import { ShareDeckModal } from '@source/common/Modals/ShareDeckModal'
import { SignInModal } from '@source/common/Modals/SignInModal'
import { ThemeToggle } from '@source/common/ThemeToggle'
import { useBannerContext } from '@source/lib/contexts/BannerContext'
import { ToastContextProvider } from '@source/lib/contexts/ToastContext'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// import { NotificationPopUp } from "./NotificationPopup";

interface LayoutProps {
    children: React.ReactNode
    isTransparentNav?: boolean
    isGuest?: boolean
}
const Layout: React.FC<LayoutProps> = ({
    children,
    isTransparentNav,
    isGuest,
}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(() => {
        return window.innerWidth > 768
    })
    const { banner } = useBannerContext()

    const sideBarRef = useRef<HTMLDivElement>(null)
    const bannerHeight = banner != null ? 'mt-12' : 'mt-0 '

    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            const screenWidth = window.innerWidth
            if (screenWidth <= 768) {
                if (
                    sideBarRef.current != null &&
                    !sideBarRef.current.contains(event.target as Node)
                ) {
                    setSidebarOpen(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [sideBarRef])

    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev)
    }, [])

    return (
        <>
            <ToastContextProvider>
                <SignInModal />
                <MessagingModal />
                <DeleteDeckModal />
                <NewCardModal />
                <ImportDeckModal />
                <ExportDeckModal />
                <ShareDeckModal />
                <DeleteCardModalSimple />
                <CardCopyModal />
                <CardStatModal />
                <FeedbackModal />
                <NotificationsModal />
                {banner != null && (
                    <InfoBanner
                        message={banner.message}
                        type={banner.messageType}
                    />
                )}
                <div
                    className={`flex  h-screen flex-col bg-black-white dark:bg-tolopea ${bannerHeight}`}
                >
                    {/* Navbar: keeping styling within the NavBarApp component */}

                    {!(isGuest ?? false) ? (
                        <NavBarApp
                            isTransparent={isTransparentNav}
                            isSidebarOpen={isSidebarOpen}
                            toggleSidebar={toggleSidebar}
                        />
                    ) : (
                        <div className="fixed z-30 flex h-24 w-full justify-end bg-transparent p-4 sm:px-20">
                            <ThemeToggle />
                        </div>
                    )}
                    {/* Main content area */}
                    <div className={`relative flex grow overflow-hidden `}>
                        {/* Sidebar: You can control visibility with state and also keep internal styling within the SideBarApp component */}
                        {!(isGuest ?? false) && (
                            <div
                                className={` ${
                                    isSidebarOpen
                                        ? 'shrink-0 transition-all duration-300 md:w-[220px]'
                                        : 'hidden shrink-0 transition-all duration-300 md:block lg:w-[80px]'
                                }
                      `}
                            >
                                <SideBarApp
                                    isSidebarOpen={isSidebarOpen}
                                    setSidebarOpen={setSidebarOpen}
                                    banner={Boolean(banner)}
                                    sideBarRef={sideBarRef}
                                />
                            </div>
                        )}
                        {/* <div className="grow overflow-auto px-[64px] pt-[185px]"> */}
                        <div className={'flex grow overflow-auto'}>
                            {children}
                        </div>
                    </div>
                </div>

                {/*   Notification Popup */}
                {/* <NotificationPopUp /> */}
            </ToastContextProvider>
        </>
    )
}

export default Layout
