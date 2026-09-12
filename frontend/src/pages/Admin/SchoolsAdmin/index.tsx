import type { SchoolSchema } from '@source/client/models/SchoolSchema'
import { AdminService } from '@source/client/services/AdminService'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { PageHeader } from '@source/common/PageHeader'
import { PageWrapper } from '@source/common/PageWrapper'
import React, { useEffect } from 'react'

import { CreateSchoolModal } from './components/CreateSchoolModal'
import { SchoolRow } from './components/SchoolRow'

const SchoolsAdmin: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [schoolsList, setSchoolsList] = React.useState<SchoolSchema[]>([])

    useEffect(() => {
        const updateSchoolsList = async (): Promise<void> => {
            const response = await AdminService.retrieveAllSchools()
            setSchoolsList(response.schools)
        }
        if (schoolsList.length === 0) {
            void updateSchoolsList()
        }
    }, [schoolsList.length])

    return (
        <PageWrapper>
            <PageHeader
                title={'Schools Admin'}
                subtitle={'Manage Schools'}
                type="withoutImage"
                hideCategories={true}
            />
            <StyledButton
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
                label={'+'}
            />
            <div>
                <h1 className=" flex justify-center text-4xl">Schools</h1>
                {schoolsList.map((school) => (
                    <SchoolRow key={school.id} school={school} />
                ))}
            </div>
            <CreateSchoolModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </PageWrapper>
    )
}

export default SchoolsAdmin
