import { PricingPlans } from "@source/pages/Pricing/data/PricingPlans";
import React, { useState } from "react";

import { SectionHeading } from "../../SectionHeading";
import { PricingCard } from "./PricingCard";

const PricingSection: React.FC = () => {
  const [monthly, setMonthly] = useState(true);

  const toggleMonthly = (): void => {
    setMonthly(!monthly);
  };

  return (
    <>
      <section className="md:w-[90vw]">
        <SectionHeading title="How much is it?" message="From free to cheap!" />

        <div className="mx-auto text-white">
          <div className="flex w-full flex-col text-center">
            <div className="mx-auto  flex overflow-hidden rounded border-2 border-electric-violet">
              <button
                className={`px-4 py-1 ${
                  monthly ? "bg-electric-violet text-white" : ""
                } focus:outline-none`}
                onClick={toggleMonthly}
              >
                {" "}
                Monthly{" "}
              </button>
              <button
                className={`px-4 py-1 ${
                  !monthly ? "bg-electric-violet  text-white" : ""
                } focus:outline-none`}
                onClick={toggleMonthly}
              >
                Annually
              </button>
            </div>
          </div>
          <div className="m-4 flex flex-wrap">
            {PricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} monthly={monthly} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export { PricingSection };
