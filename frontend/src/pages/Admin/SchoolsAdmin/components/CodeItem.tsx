import type { PromoCodeSchema } from '@source/client/models/PromoCodeSchema'
import React from 'react'

interface CodeItemProps {
    promoCode: PromoCodeSchema
}

const CodeItem: React.FC<CodeItemProps> = ({ promoCode }) => {
    return (
        <div className="flex gap-2 p-2 ">
            <p>{promoCode.code}</p>
            <p>{promoCode.schoolRole}</p>
            <p>{promoCode.expired}</p>
        </div>
    )
}

export { CodeItem }
