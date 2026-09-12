import LandingPageBackground from '@assets/LandingPageBackground.png'
import { StyledButton } from '@source/common/Buttons/StyledButton'
import { useBannerContext } from '@source/lib/contexts/BannerContext'
import { useModal } from '@source/lib/contexts/ModalContext'
import React, { useEffect, useRef } from 'react'

import { FeaturesSection } from './LandingPageComponents/FeaturesSection/FeaturesSection'
import { HeroSection } from './LandingPageComponents/HeroSection'
import { HowItWorksSection } from './LandingPageComponents/HowItWorksSection/HowItWorksSection'
import { PricingSection } from './LandingPageComponents/PricingSection/PricingSection'
import { TestimonialsSection } from './LandingPageComponents/TestimonialSection/TestimonialsSection'

const LandingPage: React.FC = () => {
    const { openSignInModal } = useModal()
    const backgroundRef = useRef<HTMLDivElement>(null)

    const diveInRef = useRef<HTMLDivElement>(null)
    const howRef = useRef<HTMLDivElement>(null)
    const pricingRef = useRef<HTMLDivElement>(null)
    const testimonialRef = useRef<HTMLDivElement>(null)
    const { banner } = useBannerContext()
    const heightAdjust = banner != null ? 'mt-[-100px]' : ''

    useEffect(() => {
        const adjustBackgroundHeight = (): void => {
            if (backgroundRef.current != null) {
                backgroundRef.current.style.height = `${window.innerHeight}px`
            }
        }

        adjustBackgroundHeight()
        window.addEventListener('resize', adjustBackgroundHeight)

        return () => {
            window.removeEventListener('resize', adjustBackgroundHeight)
        }
    }, [])

    return (
        <div className="relative z-30 grow bg-tolopea ">
            <div
                ref={backgroundRef}
                className="absolute inset-0 z-[-1] hidden min-h-full  w-full bg-cover bg-center bg-no-repeat pb-[56.25%] md:top-[-700px] lg:top-[-1000px] lg:block"
                style={{ backgroundImage: `url(${LandingPageBackground})` }}
            ></div>
            <div className="relative z-30 w-full">
                <section
                    className={`flex h-screen ${heightAdjust} mx-auto mt-[-100px] w-full max-w-[2000px] flex-col items-center justify-center p-2`}
                >
                    <HeroSection
                        diveInRef={diveInRef}
                        openSignInModal={openSignInModal}
                    />
                </section>
                <section
                    className="mb-4 mt-[50px] flex min-h-screen items-center justify-center p-2 text-center"
                    ref={diveInRef}
                >
                    <FeaturesSection />
                </section>
                <section
                    className="mb-4 flex min-h-screen items-center justify-center p-2 text-center"
                    ref={howRef}
                >
                    <HowItWorksSection />
                </section>
                <section
                    className="mb-4 flex min-h-screen items-center justify-center p-2 text-center"
                    ref={testimonialRef}
                >
                    <TestimonialsSection />
                </section>
                <section
                    className="flex min-h-screen items-center justify-center p-2 text-center"
                    ref={pricingRef}
                >
                    <PricingSection />
                </section>
            </div>
        </div>
    )
}

export default LandingPage
