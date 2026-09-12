import { useModal } from "@contexts/ModalContext";
import React from "react";

import { PricingCardListItems } from "./PricingCardListItems";

interface PricingCardProps {
  plan: {
    plan: string;
    title: string;
    price: {
      monthly: string;
      annual: string;
    };
    image: string;
    features: string[];
    populartag: boolean;
    text: string;
    link: string;
    CTA: string;
  };
  monthly: boolean;
}
const PricingCard: React.FC<PricingCardProps> = ({ plan, monthly }) => {
  const { openSignInModal } = useModal();

  return (
    <>
      <div className="w-full p-4  lg:w-1/3">
        <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2  border-electric-violet bg-mariana-blue-100 p-6">
          {plan.populartag && (
            <>
              <span className="absolute right-0 top-0 rounded-bl bg-electric-violet px-3 py-1 text-xs tracking-widest text-white">
                POPULAR
              </span>
            </>
          )}
          <h2 className="mb-1 text-sm font-medium tracking-widest text-blaze-orange">
            {plan.title}
          </h2>
          <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-5xl leading-none text-white">
            {plan.plan === "free" ? (
              <span className={"dark:text-white"}>Free</span>
            ) : (
              <>
                <span className={"dark:text-white"}>
                  ${monthly ? plan.price.monthly : plan.price.annual}
                </span>
                <span className="ml-1 text-sm font-normal dark:text-white">
                  {monthly ? "/mo" : "/yr"}
                </span>
              </>
            )}
          </h1>
          {plan.features.map((feature, index) => (
            <PricingCardListItems key={index} feature={feature} />
          ))}

          <div
            onClick={() => {
              openSignInModal("register");
            }}
            className="mt-auto flex w-full cursor-pointer items-center justify-center rounded border-0 bg-electric-violet px-4 py-2 text-white hover:bg-blaze-orange focus:outline-none"
          >
            <div className="flex items-center gap-4">
              <span>{plan.CTA}</span>
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="ml-auto h-4 w-4"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500">{plan.text}</p>
        </div>
      </div>
    </>
  );
};
export { PricingCard };
