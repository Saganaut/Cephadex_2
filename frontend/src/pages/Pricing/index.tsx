/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { PageWrapper } from "@common/PageWrapper";
import { PricingCard } from "@pages/LandingPage/LandingPageComponents/PricingSection/PricingCard";
import React, { type ReactElement, useState } from "react";

import { PricingPlans } from "./data/PricingPlans";

export default function Pricing(): ReactElement {
  const [monthly, setMonthly] = useState(true);

  const toggleMonthly = (): void => {
    setMonthly(!monthly);
  };

  return (
    <PageWrapper>
      <section className='mx-auto max-w-[1000px] overflow-hidden rounded-xl bg-tolopea p-2 text-white lg:p-6 '>
        <h3 className='mb-10 text-center text-2xl'>
          There are currently no pricing plans available
        </h3>
        <div className='flex flex-col gap-3'>
          <p>
            Cephadex has returned to it&apos;s roots as a personal project for
            the time being, as such there are currently no plans available.
          </p>

          <p>
            Cephadex will remain online and free to use but with limits.
            Additionally some features will be disabled. If you are interested
            in this project, want more credits, or anything else - please feel
            free to{" "}
            <a
              className='underline hover:text-blaze-orange-100'
              href='mailto:zen.white3980@eagereverest.com'>
              contact me
            </a>{" "}
            directly.
          </p>
          <p></p>
        </div>
        {/* <div className="mx-auto">
          <div className="mb-20 flex w-full flex-col text-center">
            <h1 className="mb-2 text-3xl font-medium text-white sm:text-4xl">
              Pricing
            </h1>
            <p className="mx-auto text-base leading-relaxed text-aquamarine lg:w-2/3">
              Choose a plan to suit your needs.
            </p>
            <div className="mx-auto mt-6 flex overflow-hidden rounded border-2 border-electric-violet">
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
        </div> */}
      </section>
    </PageWrapper>
  );
}
