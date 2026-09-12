import type { FormikProps } from 'formik'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { twMerge } from 'tailwind-merge'

interface FrontEditableProps {
    status: string | null
    formik: FormikProps<any>
    changedValues?: string[]
    type?: 'new' | 'edit'
    label?: string
    error?: boolean
}
const FrontEditable: React.FC<FrontEditableProps> = ({
    formik,
    status,
    changedValues,
    type = 'edit',
    error = false,
}) => {
    return (
        <div>
            <TextareaAutosize
                minRows={1}
                maxRows={3}
                name={'term'}
                placeholder={'Main text here'}
                id={'term'}
                className={twMerge(
                    `max-h-[120px] w-full overflow-hidden rounded-3xl border-2 bg-transparent px-4 sm:px-8 py-2 text-sm md:text-xl sm:text-center text-tolopea/80 font-medium dark:text-electric-violet-200 ${
                        status === 'success'
                            ? 'border-solid dark:border-white border-slate-400'
                            : 'border-dashed border-electric-violet'
                    }`,
                    `${
                        type === 'edit' &&
                        (changedValues?.includes('term') === true
                            ? 'bg-mariana-blue'
                            : 'bg-transparent')
                    }`,
                    `${error ? 'border-red-500' : ''}`
                )}
                onChange={formik.handleChange}
                value={formik.values.term}
            />
        </div>
    )
}
export { FrontEditable }
