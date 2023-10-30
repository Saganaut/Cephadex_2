import React from 'react';
import { HeroSection } from 'components/Pages/LandingPage/LandingPageComponents/HeroSection/HeroSection';
import { TestimonialsSection } from 'components/Pages/LandingPage/LandingPageComponents/TestimonialSection/TestimonialsSection';
import { FeaturesSection } from 'components/Pages/LandingPage/LandingPageComponents/FeaturesSection/FeaturesSection';
import { HowItWorksSection } from 'components/Pages/LandingPage/LandingPageComponents/HowItWorksSection/HowItWorksSection';
import { NewsletterSignUpSection } from 'components/Pages/LandingPage/LandingPageComponents/NewsLetterSignUpSection/NewsletterSignUpSection';
function LandingPage() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSignUpSection />
    
    </div>
  );
}

export default LandingPage;