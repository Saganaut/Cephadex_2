import React from "react";
import { NewsletterSignUpForm } from "@pages/LandingPage/LandingPageComponents/NewsLetterSignUpSection/NewsletterSignUpForm";

const NewsletterSignUpSection = () => {
  return (
    <div className="bg-mariana-blue p-6 text-center items-center">
      <h2 className="text-white text-2xl mb-2">Newsletter sign up</h2>
      <p className="text-white text-sm mb-4">
        We want you to be part of our community.
      </p>

      <div className="flex justify-center">
        <div className="md:min-w-[500px]">
          <NewsletterSignUpForm />
        </div>
      </div>
    </div>
  );
};

export { NewsletterSignUpSection };
