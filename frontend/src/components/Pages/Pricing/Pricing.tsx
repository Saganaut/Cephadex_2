import React, { useState } from "react";
import { PricingCard } from "@pages/Pricing/PricingCard";

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

const Pricing = () => {
  const [monthly, setMonthly] = useState(true);

  const toggleMonthly = () => {
    setMonthly(!monthly);
    console.log(monthly);
  };

  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
              Pricing
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">
              Choose a plan to suit your needs.
            </p>
            <div className="flex mx-auto border-2 border-electric-violet rounded overflow-hidden mt-6">
              <button
                className={`py-1 px-4 ${
                  monthly ? "bg-electric-violet text-white" : ""
                } focus:outline-none`}
                onClick={toggleMonthly}
              >
                {" "}
                Monthly{" "}
              </button>
              <button
                className={`py-1 px-4 ${
                  !monthly ? "bg-electric-violet  text-white" : ""
                } focus:outline-none`}
                onClick={toggleMonthly}
              >
                Annually
              </button>
            </div>
          </div>
          <div className="flex flex-wrap m-4">
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
