import type { UserSchema } from '@source/client'
import { HelmSpinner } from '@source/common/Animations/Spinners/HelmSpinner'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { useDeckNotificationContext } from '@source/lib/contexts/DeckNotificationContext'
import { useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'

import { extractConfig } from '../data/config'
import type ExtractFormValues from '../data/ExtractFormValues'
import { ExtractSubmitButton } from '../ExtractSubmitButton'

interface PageNavigatorProps {
    user: UserSchema
    step: number
    setStep: React.Dispatch<React.SetStateAction<number>>
    creditCost: number
    remainingCredit: number
    totalSteps: number
    callHandleTabChange: (startStepIndex: number) => void
}
const PageNavigator: React.FC<PageNavigatorProps> = ({
    step,
    user,
    setStep,
    creditCost,
    remainingCredit,
    totalSteps,
    callHandleTabChange,
}) => {
    const [validationCompleted, setValidationCompleted] = useState(false)
    const { creatingStatus } = useDeckNotificationContext()

    const formik = useFormikContext<ExtractFormValues>()
    const touchedFields = {
        fileField: true,
        linkField: true,
        textField: true,
        descriptionField: true,
        nameField: true,
        existingDeckField: true,
        languageField: true,
        cardTypeField: true,
        multiOptionsField: true,
        detailField: true,
        customContentField: true,
        customTermField: true,
        translationField: true,
    }

    const sufficientCredit =
        (user.subscriptionPlan ?? 1) > 5 || creditCost <= remainingCredit

    const disabled =
        !sufficientCredit ||
        Object.keys(formik.errors).length > 0 ||
        creditCost < extractConfig.minCreditCost

    const handleClick = async (): Promise<void> => {
        if (step === 2) {
            await formik.setTouched(touchedFields)
            await formik.validateForm().then(() => {
                setValidationCompleted(true) // Indicate validation is complete
            })
            callHandleTabChange(16)
        } else {
            setStep(step + 1)
            callHandleTabChange(12)
        }
    }
    useEffect(() => {
        if (validationCompleted) {
            setStep(step + 1)
            setValidationCompleted(false) // Reset for the next validation
        }
    }, [validationCompleted, step, setStep])

    return (
        <>
            <div className="mt-2 flex justify-end gap-2">
                {creatingStatus === 'loading' && (
                    <div className="pb-8 pr-8">
                        <HelmSpinner color="dark:fill-aquamarine fill-electric-violet-900" />
                    </div>
                )}{' '}
                {creatingStatus === 'idle' && (
                    <>
                        {step > 1 && (
                            <StyledButton
                                label="Back"
                                onClick={() => {
                                    setStep(step - 1)
                                }}
                            />
                        )}
                        {step < totalSteps && (
                            <StyledButton
                                id="create-next-button"
                                label="Next"
                                onClick={() => {
                                    void handleClick()
                                }}
                            />
                        )}
                        {step === totalSteps && (
                            <ExtractSubmitButton isDisabled={disabled} />
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export { PageNavigator }
