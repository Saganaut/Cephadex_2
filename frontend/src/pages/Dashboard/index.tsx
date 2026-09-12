import { DashboardCardContainer } from '@dashboard/DashboardCardContainer'
import { PreferencesSelect } from '@source/common/Form/PreferencesSelect/PreferencesSelect'
import { ChatbotModal } from '@source/common/Modals/ChatbotModal'
import { ChatbotToggle } from '@source/common/Modals/ChatbotModal/ChatbotToggle'
import { useIntroJS } from '@source/lib/hooks/introJS/useIntroJS'
import { Steps } from 'intro.js-react'
import React, { type ReactElement } from 'react'
import { useState } from 'react'

import { introSteps } from './data/introSteps'
import { options } from './data/tabOptions'

const Main = (): ReactElement => {
    const [openChatModal, setOpenChatModal] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    // useEffect(() => {
    //   void dispatch(refreshUserData("sign-in"));
    // }, [dispatch]);

    const activeTab = options[activeIndex]?.value ?? 'default'
    const { stepsRef, isInitialTourActive, markSectionAsToured } = useIntroJS({
        type: 'dashboard',
        introSteps,
    })

    return (
        <>
            <section
                id="dashboard-page"
                className="  px-[10px] pt-[100px] text-gray-600 sm:px-[64px] sm:pt-[185px]"
            >
                <PreferencesSelect
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    label={' '}
                    options={options}
                />
                <div id="" className="  mx-auto">
                    <h1 className="  mb-10 mt-[40px]  w-full  font-semibold text-black dark:text-white sm:text-2xl">
                        My Content
                    </h1>
                    <DashboardCardContainer filterValue={activeTab} />
                </div>
                <ChatbotToggle setOpenChatModal={setOpenChatModal} />
                <ChatbotModal
                    isOpen={openChatModal}
                    setIsOpen={setOpenChatModal}
                    cardId={undefined}
                    page={'dashboard'}
                />
                <Steps
                    ref={stepsRef}
                    enabled={isInitialTourActive}
                    steps={introSteps}
                    initialStep={0}
                    options={{
                        overlayOpacity: 0.8,
                        showProgress: true,
                        hidePrev: true,
                        hideNext: false,
                        isActive: isInitialTourActive,
                        showStepNumbers: false,
                        showBullets: false,
                        keyboardNavigation: false,
                        dontShowAgain: false,
                        dontShowAgainLabel: "Don't show again",
                        helperElementPadding: 10,
                        disableInteraction: false,
                        scrollToElement: false,
                    }}
                    onExit={() => {
                        markSectionAsToured()
                    }}
                />
            </section>
        </>
    )
}

export default Main
