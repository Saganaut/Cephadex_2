import type ExtractFormValues from '@extract/data/ExtractFormValues'
import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon'
import { CustomErrorMessage } from '@source/common/Form/CustomErrorMessage'
import { MyDropZone } from '@source/common/Form/MyDropZone'
import { useFormikContext } from 'formik'
import React, { useEffect } from 'react'

import { extractConfig } from '../../data/config'
import { useCreateDeckFormik } from '../../hooks/useCreateDeckFormik'
import { ContentTooShort } from './ContentTooShort'

interface UploadFileOptionProps {
    setCreditCost: (creditCost: number) => void
    setCreditLoading: (loading: boolean) => void
    creditCost: number
}

const UploadFileOption: React.FC<UploadFileOptionProps> = ({
    setCreditCost,
    setCreditLoading,
    creditCost,
}) => {
    const formik = useFormikContext<ExtractFormValues>()

    // void useCreateDeckFormik(setCreditCost); // This is necessary for the useEffect to be triggered for sending data to backend
    const setTriggerSendData = useCreateDeckFormik(
        setCreditCost,
        'file',
        setCreditLoading
    )

    useEffect(() => {
        // Toggle triggerSendData whenever formik.values.fileField changes
        setTriggerSendData(true)
    }, [setTriggerSendData, formik.values.fileField])

    const handleFileDrop = async (acceptedFiles: File[]): Promise<void> => {
        await formik.setFieldValue('fileField', acceptedFiles[0])
        await formik.setFieldTouched('fileField', true, true)
        void formik.handleBlur
        // void sendDataToBackend();
    }
    const clearFile = (): void => {
        void formik.setFieldValue('fileField', null)
    }

    return (
        <>
            {creditCost < extractConfig.minCreditCost &&
            formik.touched.fileField != null &&
            formik.values.fileField != null ? (
                <ContentTooShort />
            ) : (
                <CustomErrorMessage name="fileField" />
            )}

            <div className="mx-[12px] cursor-pointer rounded-2xl border-2 border-dashed border-white p-2 text-white sm:p-4">
                <MyDropZone
                    onFileDrop={(acceptedFiles: File[]) => {
                        void handleFileDrop(acceptedFiles)
                    }}
                    defaultMessage="Click to browse or drag and drop your files here"
                />

                <div>
                    {formik.values.fileField != null && (
                        <>
                            <div className="flex items-center rounded-md bg-tolopea p-2">
                                <span>
                                    <span className="p-2 text-blaze-orange">
                                        {' '}
                                        1 |{' '}
                                    </span>
                                </span>
                                <span className=" pr-2 text-sm text-white ">
                                    {formik.values.fileField.name}
                                </span>
                                <button
                                    type="button"
                                    className="size-6 rounded-full text-aquamarine hover:text-blaze-orange"
                                    onClick={clearFile}
                                >
                                    <XMarkIcon className="" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export { UploadFileOption }
