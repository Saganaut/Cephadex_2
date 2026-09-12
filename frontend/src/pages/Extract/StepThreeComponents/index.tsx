import type { UserSchema } from '@source/client'
import { Button } from '@source/common/Buttons/Button'
import { useDeckNotificationContext } from '@source/lib/contexts/DeckNotificationContext'
import { useFormikContext } from 'formik'
import React, { type ReactElement, useEffect, useState } from 'react'

import { SpeakingCeph } from '../../../common/SpeakingCeph'
import { TipsRotator } from '../components/TipsRotator'
import { extractConfig } from '../data/config'
import { CreatingCephMessages, CreatingTips } from '../data/CreatingMessages'
import type ExtractFormValues from '../data/ExtractFormValues'
import { useCardData } from '../hooks/useCardData'
import { CompletionCounter } from './CompletionCounter'
import { DeckSummary } from './DeckSummary'

interface ExtractStepThreeProps {
    setStep: (value: number) => void
    setCreditCost: (value: number) => void
    creditCost: number
    user: UserSchema
}

const ExtractStepThree: React.FC<ExtractStepThreeProps> = ({
    setStep,
    setCreditCost,
    creditCost,
    user,
}): ReactElement => {
    const { creatingStatus } = useDeckNotificationContext()
    const { errorMessage } = useCardData()
    const [speech, setSpeech] = useState<string>('')
    const formik = useFormikContext<ExtractFormValues>()
    const isObjectEmpty = (obj: any): boolean => Object.keys(obj).length === 0
    const { setCreatingStatus } = useDeckNotificationContext()

    useEffect(() => {
        if (!isObjectEmpty(formik.errors)) {
            setSpeech(CreatingCephMessages.error)
        } else if ((user.subscriptionPlan ?? 0) < 5) {
            if (creditCost > (user.remainingCredit ?? 0)) {
                setSpeech(CreatingCephMessages.insufficientCredit)
            } else {
                setSpeech(CreatingCephMessages.ready)
            }
        } else if (creditCost < extractConfig.minCreditCost) {
            setSpeech(CreatingCephMessages.noCreditCost)
        } else {
            setSpeech(CreatingCephMessages.ready)
        }
    }, [formik.errors, errorMessage, user.remainingCredit, creditCost])
    // const { decks, decksStatus } = useFetchDecks();

    const handleReset = (): void => {
        setCreatingStatus('idle')
        setCreditCost(0)
        setStep(1)
        formik.resetForm()
    }

    return (
        <div>
            <div className="min-h-fit min-w-fit rounded-xl bg-electric-violet-200/40 p-2 dark:bg-mariana-blue sm:p-8">
                <div className="flex flex-wrap gap-2 p-2 sm:p-8">
                    <div id="create-summary" className="min-w-[250px] flex-1 ">
                        <DeckSummary />
                    </div>

                    <div className="min-w-[360px] flex-1">
                        {creatingStatus === 'loading' && (
                            <>
                                <CompletionCounter />
                                <div>
                                    <div className=" p-4 text-tolopea dark:text-aquamarine">
                                        {CreatingCephMessages.letYouKnowMessage}
                                    </div>

                                    <div className="rounded-xl border-2 border-dashed border-mariana-blue-100">
                                        <div className="p-2 text-xl text-tolopea dark:text-blaze-orange sm:p-5 sm:text-2xl">
                                            {' '}
                                            Did you know?{' '}
                                        </div>
                                        <div className="flex h-fit justify-center p-2 text-sm dark:text-white sm:p-4 sm:text-base  ">
                                            <TipsRotator
                                                tips={CreatingTips}
                                                interval={5000}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}{' '}
                        {creatingStatus === 'idle' && (
                            <div className=" justify-center  p-2 align-middle sm:p-8">
                                <SpeakingCeph type="info" text={speech} />

                                <UnconditionalErrorMessages
                                    errors={formik.errors}
                                />
                            </div>
                        )}
                        {creatingStatus === 'failed' && (
                            <div className="justify-center p-2 align-middle sm:p-8">
                                <SpeakingCeph
                                    type="sad"
                                    text={CreatingCephMessages.failed}
                                />
                            </div>
                        )}
                        {creatingStatus === 'success' && (
                            <>
                                <div className="justify-center p-2 align-middle sm:p-8">
                                    <SpeakingCeph
                                        type={'happy'}
                                        text={CreatingCephMessages.success}
                                    />
                                </div>{' '}
                            </>
                        )}
                        {(creatingStatus === 'success' ||
                            creatingStatus === 'failed') && (
                            <div className="flex justify-end p-2">
                                <Button
                                    onClick={handleReset}
                                    label="Create another deck"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ExtractStepThree }

const UnconditionalErrorMessages: React.FC<{ errors: any }> = ({ errors }) => {
    return (
        <div>
            {Object.keys(errors).map((key, index) => (
                <div key={index} className="mt-2  text-red-500">
                    {typeof errors[key] === 'string'
                        ? errors[key]
                        : JSON.stringify(errors[key])}
                </div>
            ))}
        </div>
    )
}
