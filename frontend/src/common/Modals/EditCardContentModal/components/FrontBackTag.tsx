import React from 'react'

interface FrontBackTagProps {
    label: string
}

const FrontBackTag: React.FC<FrontBackTagProps> = ({ label }) => {
    return (
        <h1
            className={
                'mb-4 max-w-min whitespace-nowrap rounded-full bg-electric-violet-200 px-5  py-[4px] text-[15px] text-tolopea/50 dark:bg-mariana-blue-100 dark:text-white sm:mb-3 sm:px-8 sm:text-xl'
            }
        >
            {label}
        </h1>
    )
}

export { FrontBackTag }
