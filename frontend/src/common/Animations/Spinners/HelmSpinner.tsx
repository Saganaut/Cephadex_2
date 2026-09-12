import Helm from '@source/assets/spinners/Helm.svg?react'
import React from 'react'

interface HelmSpinnerProps {
    style?: 'small' | 'large'
    color?: string
}

const HelmSpinner: React.FC<HelmSpinnerProps> = ({
    style = 'small',
    color,
}) => {
    const colorClass = color ?? 'fill-aquamarine'
    const sizeClass =
        style === 'small'
            ? 'h-8 w-8 fill-aquamarine'
            : 'h-20 w-20 fill-blaze-orange'

    return (
        <div className={`  size-fit animate-spin rounded-full `}>
            <Helm className={` ${sizeClass} ${colorClass} `} />
        </div>
    )
}

export { HelmSpinner }
