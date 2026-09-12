import { CreateService } from '@source/client'
import { useMessagingModal } from '@source/lib/contexts/MessagingContext'
import { useDebouncedEffect } from '@source/lib/hooks/useDebouncedEffect'
import { useFormikContext } from 'formik'
import { type Dispatch, type SetStateAction, useState } from 'react'

import type ExtractFormValues from '../data/ExtractFormValues'
import { processData } from '../functions/functions'

const DEBOUNCE_TIME = 500

const useCreateDeckFormik = (
    setCreditCost: (creditCost: number) => void,
    type: 'link' | 'text' | 'file',
    setCreditLoading: (value: boolean) => void
): Dispatch<SetStateAction<boolean>> => {
    const formik = useFormikContext<ExtractFormValues>()
    const [triggerSendData, setTriggerSendData] = useState(false)
    const { setModalState } = useMessagingModal()

    // Effect to handle triggering logic based on type and form values
    useDebouncedEffect(
        () => {
            if (!triggerSendData) return

            if (type === 'file') {
                const filename = formik.values.fileField?.name
                const extension = filename?.split('.').pop()
                const validExtensions = [
                    'pdf',
                    'txt',
                    'wav',
                    'mp3',
                    'mp4',
                    'docx',
                    'pptx',
                ]
                if (extension != null && validExtensions.includes(extension)) {
                    void sendData()
                }
            } else {
                void sendData()
            }
            setTriggerSendData(false)
        },
        [formik.values, triggerSendData, type],
        DEBOUNCE_TIME
    )
    const sendData = async (): Promise<void> => {
        const formData = processData(formik.values)
        try {
            setCreditLoading(true)
            const response = await CreateService.callCreditCounter(formData)
            if (response.status === 'failure') {
                setModalState({
                    isOpen: true,
                    message:
                        'We were unable to retrieve content from the provided link or document.  Occasionally a link might be protected, or a document might be unreadable.  You can copy/paste the text instead or contact us for support.',
                    img: '',
                    title: 'Unable to retrieve content',
                    type: 'error',
                    optionalProps: {},
                    withFooter: true,
                })
                setCreditLoading(false)
            } else {
                setCreditCost(response.credit ?? 0)
                setCreditLoading(false)
            }
        } catch (error) {}
    }

    return setTriggerSendData
}

export { useCreateDeckFormik }
