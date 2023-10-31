import { PricingCard } from "@pages/Pricing/PricingCard";
import React, { type ReactElement, useState } from "react";

const PricingPlans = [
  {
    plan: "free",
    title: "Cuttle Cadet",
    price: {
      monthly: "0",
      annual: "0",
    },
    image: "",
    features: [
      "10 users included",
      "2 GB of storage",
      "Email support",
      "Email support",
      "Help center access",
    ],
    populartag: false,
    text: "Get started today",
    link: "Register",
  },
  {
    plan: "basic",
    title: "Squid Scholar",
    price: {
      monthly: "4.99",
      annual: "49.99",
    },
    image: "",
    features: [
      "20 users included",
      "10 GB of storage",
      "Priority email support",
      "Help center access",
    ],
    populartag: true,
    text: "Our most popular plan",
    link: "Upgrade",
  },
  {
    plan: "premium",
    title: "Octopus Oracle",
    price: {
      monthly: "9.99",
      annual: "99.99",
    },
    image: "",
    features: [
      "2000 users included",
      "10 GB of storage",
      "Priority email support",
      "Help center access",
    ],
    populartag: false,
    text: "For the experts",
    link: "Upgrade",
  },
];

const Pricing = (): ReactElement => {
  const [monthly, setMonthly] = useState(true);

  const toggleMonthly = (): void => {
    setMonthly(!monthly);
    console.log(monthly);
  };

  return (
    <div>
      <section className="body-font overflow-hidden text-gray-600">
        <div className="container mx-auto px-5 py-24">
          <div className="mb-20 flex w-full flex-col text-center">
            <h1 className="title-font mb-2 text-3xl font-medium text-gray-900 sm:text-4xl">
              Pricing
            </h1>
            <p className="mx-auto text-base leading-relaxed text-gray-500 lg:w-2/3">
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
        </div>
      </section>
    </div>
  );
};

export { Pricing };
