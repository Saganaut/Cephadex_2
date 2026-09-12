import { StyledButton } from '@source/common/Buttons/StyledButton'
import React from 'react'

interface TitleSectionProps {
    diveInRef: React.RefObject<HTMLDivElement>
    openSignInModal: (type: 'login' | 'register') => void
}

const TitleSection: React.FC<TitleSectionProps> = ({
    openSignInModal,
    diveInRef,
}) => {
    return (
        <>
            <h1 className="mb-4 text-4xl font-bold text-blaze-orange sm:text-6xl lg:text-7xl">
                Cephadex
            </h1>
            <p className="text-md mb-8 font-semibold text-white sm:text-lg lg:text-tolopea">
                For Educators and Learners Alike—Redefining the Art of Learning!
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <StyledButton
                    onClick={() => {
                        openSignInModal('register')
                    }}
                    style="depths"
                    size="medium"
                    label="Sign up for free"
                    disabled={false}
                />
                <StyledButton
                    onClick={() => {
                        if (diveInRef.current != null) {
                            diveInRef.current.scrollIntoView({
                                behavior: 'smooth',
                            })
                        }
                    }}
                    style="default"
                    size="medium"
                    label="Dive in"
                    disabled={false}
                />
            </div>
        </>
    )
}

export { TitleSection }
