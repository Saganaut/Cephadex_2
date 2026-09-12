import { TextAreaField } from '@common/Form/TextAreaField'
import type ExtractFormValues from '@extract/data/ExtractFormValues'
import { CustomErrorMessage } from '@source/common/Form/CustomErrorMessage'
import { useFormikContext } from 'formik'
import React from 'react'

import { extractConfig } from '../../data/config'
import { useCreateDeckFormik } from '../../hooks/useCreateDeckFormik'
import { ContentTooShort } from './ContentTooShort'

interface PasteTextOptionProps {
    setCreditCost: (creditCost: number) => void
    setCreditLoading: (creditLoading: boolean) => void
    creditCost: number
}

const PasteTextOption: React.FC<PasteTextOptionProps> = ({
    setCreditCost,
    setCreditLoading,
    creditCost,
}) => {
    const formik = useFormikContext<ExtractFormValues>()
    // const { sendDataToBackend } = useCreateDeckFormik(setCreditCost);
    const setTriggerSendData = useCreateDeckFormik(
        setCreditCost,
        'text',
        setCreditLoading
    )

    const onBlurHandler = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ): void => {
        void formik.handleBlur
        void formik.setFieldTouched('textField', true, true)
        if (formik.values.textField !== '') {
            setTriggerSendData(true)
        }
        // void sendDataToBackend();
    }

    const style = 'h-full'
    return (
        <>
            <CustomErrorMessage name="textField" />
            {creditCost < extractConfig.minCreditCost &&
            formik.touched.textField != null &&
            formik.values.textField != null ? (
                <ContentTooShort />
            ) : (
                <CustomErrorMessage name="textField" />
            )}
            <div className="h-full">
                <TextAreaField
                    name="textField"
                    value={formik.values.textField}
                    onChange={formik.handleChange}
                    onBlur={onBlurHandler}
                    type="text"
                    placeholder="Paste some text"
                    style={style}
                    textStyle="text-white"
                />
            </div>
        </>
    )
}

export { PasteTextOption }
