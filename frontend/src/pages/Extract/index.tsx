// custom is selected does the opposite of what it should, the name should be custom is not selected
import { StepsProgressBar } from '@common/StepsProgressBar'
import { validationSchema } from '@extract/data/ExtractFormValidation'
import { ErrorMessage } from '@source/common/InfoComponents/ErrorMessage'
import { Loading } from '@source/common/InfoComponents/Loading'
import { useDeckNotificationContext } from '@source/lib/contexts/DeckNotificationContext'
import { useIntroJS } from '@source/lib/hooks/introJS/useIntroJS'
import { useFetchUser } from '@source/lib/hooks/userHooks/useFetchUser'
import { ExtractStepOne } from '@source/pages/Extract/StepOneComponents'
import { ExtractStepThree } from '@source/pages/Extract/StepThreeComponents'
import { ExtractStepTwo } from '@source/pages/Extract/StepTwoComponents'
import { Form, Formik } from 'formik'
import { Steps } from 'intro.js-react'
import React, { type ReactElement, useEffect } from 'react'

import { PageNavigator } from './components/PageNavigator'
import { CreditCounter } from './CreditCounter'
import { introSteps } from './data/introSteps'
import { useCreateDeck } from './hooks/useCreateDeck'

export default function Extract(): ReactElement {
    const {
        step,
        totalSteps,
        creditCost,
        setCreditCost,
        handleCreateNewDeck,
        remainingCredit,
        setStep,
        creditLoading,
        setCreditLoading,
    } = useCreateDeck()
    const {
        stepsRef,
        isInitialTourActive,
        handleTabChange,
        markSectionAsToured,
    } = useIntroJS({
        type: 'create-deck',
        introSteps,
    })

    const { user, userStatus } = useFetchUser()
    const { setCreatingStatus } = useDeckNotificationContext()
    useEffect(() => {
        setCreatingStatus('idle')
    }, [])

    const isPremium = (user?.subscriptionPlan ?? 1) > 5

    if (userStatus === 'failed') {
        return <ErrorMessage />
    }

    return (
        <>
            {/* <MessagingModal /> */}
            <div
                className={
                    'grow px-[10px] pb-[20px] pt-[100px] sm:px-[64px] first:sm:pt-[185px]'
                }
            >
                <h1
                    className={
                        'text-2xl font-bold text-black dark:text-white sm:mb-6 sm:text-[45px]'
                    }
                >
                    Create a deck
                </h1>
                <>
                    <div className="flex justify-between">
                        <div className="min-w-[100px] max-w-[200px] sm:min-w-[150px]">
                            <StepsProgressBar
                                currentStep={step}
                                totalSteps={totalSteps}
                            />
                        </div>

                        {creditLoading ? (
                            <div>
                                <Loading size="small" withMessage={false} />
                            </div>
                        ) : (
                            <CreditCounter
                                creditCost={creditCost}
                                remainingCredit={remainingCredit}
                                premium={isPremium}
                            />
                        )}
                    </div>
                    <section className="container  w-full">
                        <Formik
                            initialValues={{
                                nameField: '',
                                fileField: null,
                                linkField: '',
                                textField: '',
                                descriptionField: '',
                                subjectField: 'Unspecified',
                                existingDeckField: null,
                                languageField: 'English',
                                cardTypeField: 'Mix',
                                multiOptionsField: [],
                                detailField: 'Medium',
                                customContentField: '',
                                customTermField: '',
                                translationField: 'English',
                                eitherTextOrFileOrUrlError: '',
                                eitherNameOrExistingDeckError: '',
                            }}
                            validationSchema={validationSchema}
                            validateOnBlur={true}
                            onSubmit={async (values) => {
                                try {
                                    void handleCreateNewDeck(values)
                                } catch (error) {
                                    console.error(error)
                                }
                            }}
                        >
                            {(formik) => (
                                <Form>
                                    <div className="px-4"></div>
                                    <div>
                                        {step === 1 && (
                                            <ExtractStepOne
                                                setCreditCost={setCreditCost}
                                                setCreditLoading={
                                                    setCreditLoading
                                                }
                                                creditCost={creditCost}
                                            />
                                        )}
                                        {step === 2 && <ExtractStepTwo />}
                                        {step === 3 && (
                                            <ExtractStepThree
                                                setStep={setStep}
                                                setCreditCost={setCreditCost}
                                                creditCost={creditCost}
                                                user={user}
                                            />
                                        )}
                                    </div>

                                    <PageNavigator
                                        user={user}
                                        step={step}
                                        setStep={setStep}
                                        creditCost={creditCost}
                                        remainingCredit={remainingCredit}
                                        totalSteps={totalSteps}
                                        callHandleTabChange={handleTabChange}
                                    />
                                </Form>
                            )}
                        </Formik>
                    </section>
                </>

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
            </div>
        </>
    )
}
