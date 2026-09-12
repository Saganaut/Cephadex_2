import { PreferencesSelectSecondary } from '@source/common/Form/PreferencesSelect/PreferencesSelectSecondary'
import { InsertLinkOption } from '@source/pages/Extract/StepOneComponents/LeftSide/InsertLinkOption'
import { PasteTextOption } from '@source/pages/Extract/StepOneComponents/LeftSide/PasteTextOption'
import { UploadFileOption } from '@source/pages/Extract/StepOneComponents/LeftSide/UploadFileOption'
import React, { useState } from 'react'

const options = [
    {
        label: 'File',
        value: 'file',
        tooltip: 'Option 1 - Select a file',
        id: 'file-input',
    },
    {
        label: 'Link',
        value: 'link',
        tooltip: 'Option 2 - Insert a link',
        id: 'link-input',
    },
    {
        label: 'Text',
        value: 'text',
        tooltip: 'Option 3 - Paste some text',
        id: 'text-input',
    },
]
interface LeftSideProps {
    setCreditCost: (creditCost: number) => void
    setCreditLoading: (creditLoading: boolean) => void
    creditCost: number
}

const LeftSide: React.FC<LeftSideProps> = ({
    creditCost,
    setCreditCost,
    setCreditLoading,
}) => {
    // const formik = useFormikContext<ExtractFormValues>();
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <>
            <div
                id="overall-input"
                className="rounded-xl bg-mariana-blue-100 p-4  dark:bg-mariana-blue lg:min-h-[50vh]"
            >
                <div className="p-2 text-xl text-aquamarine sm:p-5  sm:text-2xl">
                    {activeIndex === 0 && 'Select a file'}
                    {activeIndex === 1 && 'Insert a link'}
                    {activeIndex === 2 && 'Paste some text'}
                </div>
                <PreferencesSelectSecondary
                    id="input-type"
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    label=""
                    options={options}
                />
                <div className="px-2 py-5">
                    {activeIndex === 0 && (
                        <UploadFileOption
                            setCreditCost={setCreditCost}
                            setCreditLoading={setCreditLoading}
                            creditCost={creditCost}
                        />
                    )}
                    {activeIndex === 1 && (
                        <InsertLinkOption
                            setCreditCost={setCreditCost}
                            setCreditLoading={setCreditLoading}
                            creditCost={creditCost}
                        />
                    )}
                    {activeIndex === 2 && (
                        <PasteTextOption
                            setCreditCost={setCreditCost}
                            setCreditLoading={setCreditLoading}
                            creditCost={creditCost}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export { LeftSide }
