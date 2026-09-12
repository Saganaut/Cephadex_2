import { AdminService, type PromoCodeSchema } from '@source/client'
import React from 'react'

interface PromoCodeRowProps {
    promoCode: PromoCodeSchema
}

const PromoCodeRow: React.FC<PromoCodeRowProps> = ({ promoCode }) => {
    const expirationDate = new Date(promoCode.expirationDate ?? 0)
    const formattedDate = expirationDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })

    const expirePromoCode = async (): Promise<void> => {
        await AdminService.expirePromoCode(promoCode.code)
    }
    return (
        <div
            className={`flex rounded-xl p-1 ${promoCode.expired ? 'bg-red-900' : 'bg-mariana-blue-100'}`}
        >
            <div className="rounded-xl border-2 p-2">
                details: {promoCode.promoType}
            </div>
            <div className="rounded-xl border-2 p-2">
                code: {promoCode.code}
            </div>
            <div className="rounded-xl border-2 p-2">
                times used: {promoCode.timesUsed}
            </div>
            <div className="rounded-xl border-2 p-2">
                max uses:{promoCode.maxUses}
            </div>
            <div className="rounded-xl border-2 p-2">
                {promoCode.expired ? 'expired' : 'valid'}
            </div>
            <div className="rounded-xl border-2 p-2">
                expiration date: {formattedDate}
            </div>
            {!promoCode.expired && (
                <button
                    className="cursor-pointer"
                    onClick={() => {
                        void expirePromoCode()
                    }}
                >
                    Expire
                </button>
            )}
        </div>
    )
}

export { PromoCodeRow }
