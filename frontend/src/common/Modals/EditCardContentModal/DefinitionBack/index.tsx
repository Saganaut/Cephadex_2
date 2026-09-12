import type { FormikProps } from 'formik'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { twMerge } from 'tailwind-merge'

interface DefBackProps {
    status: string | null
    changedValues?: string[]
    formik: FormikProps<any>
    type?: 'new' | 'edit'
    error?: boolean
}
const DefinitionBack: React.FC<DefBackProps> = ({
    status,
    formik,
    changedValues,
    type = 'edit',
    error = false,
}) => {
    return (
        <div className={'w-full'}>
            <div className="max-h-[250px] overflow-hidden rounded-2xl">
                <TextareaAutosize
                    minRows={1}
                    maxRows={3}
                    placeholder={'Secondary text here'}
                    name={'content'}
                    id={'content'}
                    className={twMerge(
                        `max-h-[250px] overflow-y-auto min-h-[50px] w-full rounded-2xl border-2 px-4 sm:px-8 py-2 sm:text-center text-sm sm:text-lg text-tolopea bg-transparent dark:text-white ${
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
                    value={formik.values.content}
                />
            </div>
        </div>
    )
}
export { DefinitionBack }
