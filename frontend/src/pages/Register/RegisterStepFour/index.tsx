import { InputField } from '@common/Form/InputField'
import { SwitchField } from '@common/Form/SwitchField'
import { Label, Switch } from '@headlessui/react'
import { DevTool } from '@hookform/devtools'
import { ApiError } from '@source/client'
import { AccountService } from '@source/client/services/AccountService'
import { Button } from '@source/common/Buttons/Button'
import { Loading } from '@source/common/InfoComponents/Loading'
import { ErrorModal } from '@source/common/Modals/ErrorModal'
import { TermsModal } from '@source/common/Modals/TermsModal'
import { useAppDispatch, useAppSelector } from '@source/lib/store/hooks'
import { setFieldValue } from '@source/lib/store/register/registerSlice'
import type { RootState } from '@source/lib/store/store'
import { checkUserAuth } from '@source/lib/store/user/actions'
import { setUser } from '@source/lib/store/user/userSlice'
import React, { useEffect } from 'react'
import {
    type SubmitErrorHandler,
    type SubmitHandler,
    useForm,
} from 'react-hook-form'

import { ErrorMessage } from '../ErrorMessage'

interface NewFormValues {
    username: string
    role: string
    howDidYouHearAboutUs: string
    whatDoYouWantToDo: string
    newsletter: boolean
    agreeTandC: boolean
    email: string
    firstName: string
    lastName: string
    picture: string
    token: string
    externalType: string
}

interface RegisterStepFourProps {
    setStep: React.Dispatch<React.SetStateAction<number>>
    setSpeech: React.Dispatch<React.SetStateAction<string>>
}

const RegisterStepFour: React.FC<RegisterStepFourProps> = ({
    setStep,
    setSpeech,
}) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')
    const dispatch = useAppDispatch()
    const {
        username,
        firstName,
        lastName,
        picture,
        token,
        externalType,
        email,
        howDidYouHearAboutUs,
        role,
        useUsFor,
        terms,
        newsletter,
        promoCode,
    } = useAppSelector((state: RootState) => state.registration)
    const [termsIsOpen, setTermsIsOpen] = React.useState(false)
    const prepareValuesForSubmit = (): NewFormValues => {
        const newValues = {
            username,
            role,
            howDidYouHearAboutUs,
            whatDoYouWantToDo: useUsFor,
            newsletter,
            agreeTandC: terms,
            email,
            firstName,
            lastName,
            picture,
            token,
            externalType,
            promoCode,
        }

        return newValues
    }
    const registerState = useAppSelector((state) => state.registration)

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            terms: terms ?? false,
            newsletter: true,
            promoCode: registerState.promoCode ?? '',
        },
    })

    register('terms', {
        required: 'Please agree to the terms and conditions',
    })
    register('newsletter')
    watch('terms')
    watch('newsletter')
    const promoCodeField = register('promoCode', {
        onChange: () => {
            updatePromoCode()
        },
        maxLength: { value: 6, message: 'codes should be 6 characters long' },
        minLength: { value: 6, message: 'Codes should be 6 characters long' },
        pattern: {
            value: /^[a-zA-Z0-9]+$/,
            message: 'Can only contain letters and numbers',
        },
    })
    watch('promoCode')

    const toggleTerms = (): void => {
        dispatch(setFieldValue({ field: 'terms', value: !getValues('terms') }))
        setValue('terms', !getValues('terms'))
    }
    const toggleNewsletter = (): void => {
        dispatch(
            setFieldValue({
                field: 'newsletter',
                value: !getValues('newsletter'),
            })
        )
        setValue('newsletter', !getValues('newsletter'))
    }

    const updatePromoCode = (): void => {
        dispatch(
            setFieldValue({ field: 'promoCode', value: getValues('promoCode') })
        )
    }

    const onErrors: SubmitErrorHandler<any> = (errors) => {}
    const onSubmit: SubmitHandler<any> = (data) => {
        updatePromoCode()
        void registerUser()
    }

    const registerUser = async (): Promise<void> => {
        try {
            setIsLoading(true)
            const values = prepareValuesForSubmit()
            const response = await AccountService.signUp(values)
            if (response.status === 'success') {
                dispatch(setUser(response.user))
                void dispatch(checkUserAuth())
                setStep(5)
            }
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorMessage(
                    `${error.body.detail} - for assistance contact us directly at support@cephadex.com`
                )
            } else {
                setErrorMessage(
                    "We encountered an error.  Don't worry, we're going to investigate! For help contact us directly at support@cephadex.com"
                )
            }
            setIsOpen(true)
        } finally {
            setIsLoading(false)
        }
    }

    const onClickSignUp = (): void => {
        void handleSubmit(onSubmit, onErrors)()
    }
    useEffect(() => {
        setSpeech('And one last thing!')
    }, [setSpeech])

    return (
        <div className="size-full  p-4">
            <div className="p-4">
                <div className=" flex items-center py-4 text-2xl text-white">
                    <Switch.Group>
                        <Label className="mr-4 grow">
                            Agree to our{' '}
                            <a
                                onClick={() => {
                                    setTermsIsOpen(true)
                                }}
                                className="cursor-pointer underline hover:text-aquamarine"
                            >
                                terms and conditions
                            </a>
                        </Label>
                        <div className="min-h-fit">
                            <SwitchField
                                enabled={getValues('terms')}
                                setEnabled={toggleTerms}
                            />
                        </div>
                    </Switch.Group>
                </div>
                <ErrorMessage message={errors?.terms?.message} />

                <div className=" flex items-center py-4 text-2xl text-white">
                    <Switch.Group>
                        <Label className="mr-4 grow">
                            Stay up to date with our newsletter
                        </Label>
                        <div className="min-h-fit">
                            <SwitchField
                                enabled={getValues('newsletter')}
                                setEnabled={toggleNewsletter}
                            />
                        </div>
                    </Switch.Group>
                    <DevTool control={control} />
                </div>
                <div className="flex justify-end gap-2 p-4 ">
                    <div className=" flex items-center text-2xl text-white">
                        Code
                    </div>

                    <div className="max-w-[150px]">
                        <InputField
                            name={promoCodeField.name}
                            onChange={promoCodeField.onChange} // Connect the onChange handler
                            onBlur={promoCodeField.onBlur}
                            inputFieldRef={promoCodeField.ref}
                            placeholder="2TUDYR.."
                            type="text"
                            value={getValues('promoCode')}
                            textStyle="text-white"
                        />
                    </div>
                    <ErrorMessage message={errors?.promoCode?.message} />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    label="Back"
                    onClick={() => {
                        setStep((prev) => prev - 1)
                    }}
                />
                <div className="flex items-center justify-center sm:min-w-[130px]">
                    {isLoading ? (
                        <Loading size="small" withMessage={false} />
                    ) : (
                        <Button label="Sign up" onClick={onClickSignUp} />
                    )}
                </div>
            </div>
            <TermsModal setIsOpen={setTermsIsOpen} isOpen={termsIsOpen} />
            <ErrorModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                message={errorMessage}
                title="Ooops!"
            />
        </div>
    )
}

export { RegisterStepFour }
