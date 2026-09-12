import { InputField } from '@common/Form/InputField'
import type ExtractFormValues from '@extract/data/ExtractFormValues'
import { CustomErrorMessage } from '@source/common/Form/CustomErrorMessage'
import { useFormikContext } from 'formik'
import React from 'react'

import { extractConfig } from '../../data/config'
import { useCreateDeckFormik } from '../../hooks/useCreateDeckFormik'
import { ContentTooShort } from './ContentTooShort'

interface InsertLinkOptionProps {
    setCreditCost: (creditCost: number) => void
    setCreditLoading: (creditLoading: boolean) => void
    creditCost: number
}

const InsertLinkOption: React.FC<InsertLinkOptionProps> = ({
    setCreditCost,
    setCreditLoading,
    creditCost,
}) => {
    const formik = useFormikContext<ExtractFormValues>()
    // const { sendDataToBackend } = useCreateDeckFormik(setCreditCost);
    const setTriggerSendData = useCreateDeckFormik(
        setCreditCost,
        'link',
        setCreditLoading
    )
    // const onBlueHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    //   void formik.handleBlur;
    //   void formik.setFieldTouched("linkField", true, true);
    //   // void sendDataToBackend();
    //   if (formik.values.linkField !== "") {
    //     setTriggerSendData(true);
    //   }
    // };
    const onBlurHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { value } = event.target

        // Check if the input value doesn't start with http:// or https://
        if (
            value != null &&
            value !== '' &&
            !value.startsWith('http://') &&
            !value.startsWith('https://')
        ) {
            // Update the form field to prepend https://
            void formik.setFieldValue('linkField', `https://${value}`)
        } else {
            formik.handleBlur(event)
            void formik.setFieldTouched('linkField', true, true)
        }

        if (
            formik.values.linkField !== '' &&
            formik.values.linkField !== 'https://'
        ) {
            setTriggerSendData(true)
        }
    }

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ): void => {
        if (event.key === 'Enter') {
            // Prevent default form submission if inside a form
            event.preventDefault()

            // Call the onBlur handler when Enter is pressed
            onBlurHandler(
                event as unknown as React.ChangeEvent<HTMLInputElement>
            )
        }
    }

    return (
        <>
            {creditCost < extractConfig.minCreditCost &&
            formik.values.linkField != null &&
            formik.touched.linkField != null ? (
                <ContentTooShort />
            ) : (
                <CustomErrorMessage name="linkField" />
            )}

            <InputField
                name="linkField"
                value={formik.values.linkField}
                onChange={formik.handleChange}
                onBlur={onBlurHandler}
                placeholder="Insert a wikipedia, youtube, or other URL"
                type="text"
                handleOnKeyDown={handleKeyDown}
                textStyle="text-white"
            />
        </>
    )
}

export { InsertLinkOption }
