import React from "react";
import { HeroSection } from "@pages/LandingPage/LandingPageComponents/HeroSection/HeroSection";
import { TestimonialsSection } from "@pages/LandingPage/LandingPageComponents/TestimonialSection/TestimonialsSection";
import { FeaturesSection } from "@pages/LandingPage/LandingPageComponents/FeaturesSection/FeaturesSection";
import { HowItWorksSection } from "@pages/LandingPage/LandingPageComponents/HowItWorksSection/HowItWorksSection";
import { NewsletterSignUpSection } from "@pages/LandingPage/LandingPageComponents/NewsLetterSignUpSection/NewsletterSignUpSection";
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
