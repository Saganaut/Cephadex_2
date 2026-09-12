import { Dropdown } from '@common/Form/Dropdown'
import { InputField } from '@common/Form/InputField'
// import { DevTool } from '@hookform/devtools'
import { Button } from '@source/common/Buttons/Button'
import { useAppDispatch, useAppSelector } from '@source/lib/store/hooks'
import { setFieldValue } from '@source/lib/store/register/registerSlice'
import React, { type ReactElement } from 'react'
import {
    type SubmitErrorHandler,
    type SubmitHandler,
    useForm,
} from 'react-hook-form'

import { ErrorMessage } from '../ErrorMessage'
import howDidYouHearAboutUsOptions from './data/hearAboutUsOptions'

interface RegisterStepThreeProps {
    setStep: React.Dispatch<React.SetStateAction<number>>
    setSpeech: React.Dispatch<React.SetStateAction<string>>
}

const RegisterStepThree: React.FC<RegisterStepThreeProps> = ({
    setStep,
    setSpeech,
}): ReactElement => {
    const registerState = useAppSelector((state) => state.registration)

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            useUsFor: registerState.useUsFor ?? '',
            howDidYouHearAboutUs: {
                value: undefined,
                label: registerState.howDidYouHearAboutUs ?? '',
            },
        },
    })

    const dispatch = useAppDispatch()
    const onSubmit: SubmitHandler<any> = (data) => {
        dispatch(setFieldValue({ field: 'useUsFor', value: data.useUsFor }))
        dispatch(
            setFieldValue({
                field: 'howDidYouHearAboutUs',
                value: data.howDidYouHearAboutUs.label,
            })
        )
        setStep(4)
    }
    const useUsForField = register('useUsFor', {
        required: 'Please tell us how you plan to use Cephadex',
        maxLength: { value: 50, message: 'Please enter 50 characters or less' },
        minLength: { value: 5, message: 'Please enter 5 characters or more' },
        pattern: {
            value: /^[a-zA-Z0-9_-\s]+$/,
            message:
                'Can only contain letters, numbers, underscores, hyphens, and spaces',
        },
    })
    watch('howDidYouHearAboutUs')
    watch('useUsFor')
    const howDidYouHearAboutUsField = register('howDidYouHearAboutUs', {
        required: 'Please choose let us know how you heard about us',
    })

    const handlehowDidYouHearAboutUsFieldChange = (value: {
        value: number
        label: string
    }): void => {
        void howDidYouHearAboutUsField.onChange({
            target: { value, name: 'howDidYouHearAboutUs' },
        } as any)
        setTimeout(() => {
            clearErrors('howDidYouHearAboutUs')
        }, 1)
    }
    setSpeech("We're almost there!")
    const onErrors: SubmitErrorHandler<any> = (errors) => {}

    const onClick = (): void => {
        void handleSubmit(onSubmit, onErrors)()
    }

    return (
        <div className="size-full  p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-4">
                    <div className="flex justify-center py-2 text-2xl text-aquamarine-100">
                        What do you want to use Cephadex for?
                    </div>

                    <InputField
                        name={useUsForField.name}
                        onChange={useUsForField.onChange}
                        onBlur={useUsForField.onBlur}
                        inputFieldRef={useUsForField.ref}
                        placeholder="eg. Study, teaching, learning a language, etc."
                        type="text"
                        value={getValues('useUsFor')}
                        textStyle="text-white"
                    />
                    <ErrorMessage message={errors?.useUsFor?.message} />
                </div>
                <div className="p-4">
                    <div className="flex justify-center py-2 text-2xl text-aquamarine-100">
                        How did you hear about us?
                    </div>
                    <Dropdown
                        options={howDidYouHearAboutUsOptions}
                        onChange={handlehowDidYouHearAboutUsFieldChange}
                        name={howDidYouHearAboutUsField.name}
                        dropdownRef={howDidYouHearAboutUsField.ref}
                        value={getValues('howDidYouHearAboutUs')} // ignore this error for now
                        style={'select'}
                        textStyle="text-white"
                    />
                    <ErrorMessage
                        message={errors?.howDidYouHearAboutUs?.message}
                    />
                </div>
            </form>
            {/* <DevTool control={control} /> */}
            <div className="flex justify-end gap-2">
                <Button
                    label="Back"
                    onClick={() => {
                        setStep((prev) => prev - 1)
                    }}
                />
                <Button label="Next" onClick={onClick} />
            </div>
        </div>
    )
}

export { RegisterStepThree }
