import React from "react";

import { Term } from "./Terms";
import { termsData } from "./termsData";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="mb-20 p-4">
      <div className="pb-4">
        <h2 className="pb-2 text-center text-2xl font-bold">
          Terms and Conditions
        </h2>

        <p className="font-light ">
          {" "}
          Welcome to Cephadex, an educational platform where you can create,
          share, and study educational content. These terms and conditions
          govern your use of the Cephadex website, mobile application, and any
          related services (collectively, the &quot;Services&quot;). By
          accessing or using the Services, you agree to be bound by these terms
          and conditions.
        </p>
      </div>
      <div className="">
        {termsData.map((section, index) => (
          <Term key={index} title={section.title} terms={section.terms} />
        ))}
      </div>
    </div>
  );
};

export { TermsAndConditions };
