import React from "react";

import { Term } from "../../Terms/components/Terms";
import { privacyData } from "./privacyData";

interface PrivacyPolicyProps {}
const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
  return (
    <div className="mb-20 p-4">
      <div className="pb-4">
        <h2 className="pb-2 text-center text-2xl font-bold">Privacy Policy </h2>

        <p className="font-light ">
          {" "}
          This Privacy Policy outlines how cephadex.com (&quot;we&quot;,
          &quot;our&quot;, or &quot;us&quot;), operated by Cephadex Limited.,
          collects, uses, and shares your personal information when you visit or
          make a purchase from cephadex.com (the &quot;Site&quot;).
        </p>
      </div>
      <div className="">
        {privacyData.map((section, index) => (
          <Term key={index} title={section.title} terms={section.terms} />
        ))}
      </div>
    </div>
  );
};

export { PrivacyPolicy };
