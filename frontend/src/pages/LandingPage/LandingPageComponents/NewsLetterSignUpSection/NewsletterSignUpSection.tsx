import { NewsletterSignUpForm } from "@landingpage/LandingPageComponents/NewsLetterSignUpSection/NewsletterSignUpForm";
import React, { type ReactElement } from "react";

const NewsletterSignUpSection = (): ReactElement => {
  return (
    <div className="items-center rounded-2xl  sm:p-6 text-center">
      <h2 className="mb-2 text-2xl text-white">Newsletter sign up</h2>
      <p className="mb-4 text-sm text-white">
        Join our community and get the latest updates!
      </p>

      <div className="flex justify-center">
        <div className="lg:min-w-[500px]">
          <NewsletterSignUpForm />
        </div>
      </div>
    </div>
  );
};

export { NewsletterSignUpSection };
