import { FeaturesSection } from "@pages/LandingPage/LandingPageComponents/FeaturesSection/FeaturesSection";
import { HeroSection } from "@pages/LandingPage/LandingPageComponents/HeroSection/HeroSection";
import { HowItWorksSection } from "@pages/LandingPage/LandingPageComponents/HowItWorksSection/HowItWorksSection";
import { NewsletterSignUpSection } from "@pages/LandingPage/LandingPageComponents/NewsLetterSignUpSection/NewsletterSignUpSection";
import { TestimonialsSection } from "@pages/LandingPage/LandingPageComponents/TestimonialSection/TestimonialsSection";
import React, { type ReactElement } from "react";

function LandingPage(): ReactElement {
  return (
    <div>
      {/* <HeroSection /> */}
      {/* <HowItWorksSection /> */}
      {/* <FeaturesSection /> */}
      {/* <TestimonialsSection /> */}
      <NewsletterSignUpSection />
    </div>
  );
}

export default LandingPage;
