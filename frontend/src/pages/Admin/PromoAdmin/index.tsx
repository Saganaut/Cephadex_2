import { AdminService, type PromoCodeSchema } from '@source/client'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { PageHeader } from '@source/common/PageHeader'
import { PageWrapper } from '@source/common/PageWrapper'
import React, { useEffect } from 'react'

import { CreatePromoCodeModal } from './CreatePromoCodeModal'
import { PromoCodeRow } from './PromoCodeRow'

const PromoAdmin: React.FC = () => {
    const [codes, setCodes] = React.useState<PromoCodeSchema[]>([])
    const [createCodeModalIsOpen, setCreateCodeModalIsOpen] =
        React.useState(false)
    useEffect(() => {
        const updateCodesList = async (): Promise<void> => {
            const response = await AdminService.retrieveAllNonSchoolPromoCodes()
            setCodes(response.codes)
        }
        if (codes.length === 0) {
            void updateCodesList()
        }
    }, [codes.length])

    return (
        <div>
            <PageWrapper>
                <PageHeader
                    title={'Promos Admin'}
                    subtitle={'Manage promo codes'}
                    type="withoutImage"
                    hideCategories={true}
                />
                <StyledButton
                    onClick={() => {
                        setCreateCodeModalIsOpen(!createCodeModalIsOpen)
                    }}
                    label={'+'}
                />
                <div>
                    {codes.map((code) => (
                        <div className="py-1" key={code.id}>
                            <PromoCodeRow promoCode={code} />
                        </div>
                    ))}
                </div>
                <CreatePromoCodeModal
                    isOpen={createCodeModalIsOpen}
                    setIsOpen={setCreateCodeModalIsOpen}
                />
            </PageWrapper>
        </div>
    )
}

export { PromoAdmin }
