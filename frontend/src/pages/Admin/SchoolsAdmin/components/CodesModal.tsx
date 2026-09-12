import {
    AdminService,
    type PromoCodeSchema,
    type SchoolSchema,
} from '@source/client'
import { ModalWrapper } from '@source/common/Modals/ModalWrapper'
import React, { type Dispatch, type SetStateAction, useEffect } from 'react'

import { CodeItem } from './CodeItem'

interface CodesModalProps {
    school: SchoolSchema
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const CodesModal: React.FC<CodesModalProps> = ({
    school,
    isOpen,
    setIsOpen,
}) => {
    const [codes, setCodes] = React.useState<PromoCodeSchema[]>([])
    const [fetched, setHasFetched] = React.useState(false)

    useEffect(() => {
        const fetchCodes = async (): Promise<void> => {
            const response = await AdminService.retrieveSchoolPromoCodes(
                String(school.id)
            )
            setCodes(response.codes)
        }
        if (!fetched) {
            void fetchCodes()
            setHasFetched(true)
        }
    }, [fetched, school.id])

    return (
        <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="min-w-[200px] p-8">
                {codes.map((code) => (
                    <CodeItem key={code.id} promoCode={code} />
                ))}
            </div>
        </ModalWrapper>
    )
}

export { CodesModal }
