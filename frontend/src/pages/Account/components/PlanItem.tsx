import { CheckIcon } from '@heroicons/react/20/solid'
import React from 'react'

interface PlanItemProps {
    type?: string
    title?: string
    name?: string
    description?: string
    price?: number
    benefits?: string[]
    period?: string
}

interface BenefitItemProps {
    benefit: string
}

const BenefitItem: React.FC<BenefitItemProps> = ({ benefit }) => {
    return (
        <>
            <div className={'flex gap-x-[14px] px-[20px]  '}>
                <div
                    className={
                        ' flex size-[32px] shrink-0 items-center justify-center rounded-full bg-aquamarine'
                    }
                >
                    <CheckIcon className={'size-5 text-blaze-orange'} />
                </div>
                <p className={'max-w-[315px] text-[18px] font-normal'}>
                    {benefit}
                </p>
            </div>
        </>
    )
}

const PlanItem: React.FC<PlanItemProps> = ({
    type,
    title,
    name,
    price,
    benefits,
    description,
    period,
}) => {
    return (
        <>
            <div
                className={
                    'w-full max-w-[400px] rounded-[20px] bg-blaze-orange py-[32px] text-white '
                }
            >
                <div className={'px-[65px] '}>
                    <h1 className={'text-[34px] font-semibold'}>
                        {name} - {type}
                    </h1>
                    <p className={'font-medium'}>{description}</p>
                </div>

                {/* Benefits */}
                <div className={'flex flex-col gap-y-[20px]'}>
                    <div
                        className={
                            'flex items-center justify-center  gap-[4px] py-[26px] sm:px-[65px]'
                        }
                    >
                        <h1 className={'text-[45px] font-semibold'}>
                            ${price}
                        </h1>
                        <p>billed {period}</p>
                    </div>
                    {benefits?.map((benefit, index) => (
                        <BenefitItem key={index} benefit={benefit} />
                    ))}
                </div>
            </div>
        </>
    )
}

export { PlanItem }
