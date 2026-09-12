import { ErrorMessage } from 'formik'
import React from 'react'

interface CustomErrorMessageProps {
    name: string
}
const CustomErrorMessage: React.FC<CustomErrorMessageProps> = ({ name }) => {
    return (
        <div className="text-3xs min-h-[10px] text-red-500 sm:min-h-[20px]">
            <ErrorMessage name={name} />
        </div>
    )
}

export { CustomErrorMessage }
