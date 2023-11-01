import { NewsletterSignUpForm } from "@pages/LandingPage/LandingPageComponents/NewsLetterSignUpSection/NewsletterSignUpForm";
import React, { type ReactElement } from "react";

const NewsletterSignUpSection = (): ReactElement => {
  return (
    <div className="items-center bg-mariana-blue p-6 text-center">
      <h2 className="mb-2 text-2xl text-white">Newsletter sign up</h2>
      <p className="mb-4 text-sm text-white">
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
