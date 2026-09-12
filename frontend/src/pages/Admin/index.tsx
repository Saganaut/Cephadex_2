import { StyledButton } from '@source/common/Buttons/StyledButton'
import { Unauthorized } from '@source/common/InfoComponents/Unauthorized'
import { PageHeader } from '@source/common/PageHeader'
import { PageWrapper } from '@source/common/PageWrapper'
import { useFetchUser } from '@source/lib/hooks/userHooks/useFetchUser'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const SUBSCRIPTION_PLAN_ADMIN = 8

const Admin: React.FC = () => {
    const { user } = useFetchUser()
    const navigate = useNavigate()
    if (user == null) {
        return <h1>Loading...</h1>
    }

    if ((user.subscriptionPlan ?? 1) < SUBSCRIPTION_PLAN_ADMIN) {
        return <Unauthorized />
    }

    return (
        <>
            <PageWrapper>
                <PageHeader
                    title="Admin"
                    type={'withoutImage'}
                    hideCategories={true}
                />

                <div className="flex items-center justify-center gap-4">
                    <StyledButton
                        label="Banners"
                        onClick={() => {
                            navigate('/admin/banner')
                        }}
                    />
                    <StyledButton
                        label="Schools"
                        onClick={() => {
                            navigate('/admin/schools')
                        }}
                    />

                    <StyledButton
                        label="Promo codes"
                        onClick={() => {
                            navigate('/admin/promo')
                        }}
                    />
                    <StyledButton
                        label="Prompt review"
                        onClick={() => {
                            navigate('/admin/review')
                        }}
                    />
                </div>
            </PageWrapper>
        </>
    )
}

export default Admin
