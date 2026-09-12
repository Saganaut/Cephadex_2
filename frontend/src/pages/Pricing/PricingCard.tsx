import { useModal } from "@contexts/ModalContext";
import { PricingCardListItems } from "@pages/Pricing/PricingCardListItems";
import React from "react";

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
  };
  monthly: boolean;
}
const PricingCard: React.FC<PricingCardProps> = ({ plan, monthly }) => {
  const { openSignInModal } = useModal();

  return (
    <>
      <div className="w-full p-4  lg:w-1/3">
        <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-electric-violet p-6">
          {plan.populartag && (
            <>
              <span className="absolute right-0 top-0 rounded-bl bg-electric-violet px-3 py-1 text-xs tracking-widest text-white">
                POPULAR
              </span>
            </>
          )}
          <h2 className="mb-1 text-sm font-medium tracking-widest">
            {plan.title}
          </h2>
          <h1 className="mb-4 flex items-center border-b border-gray-200 pb-4 text-5xl leading-none text-gray-900">
            {plan.plan === "free" ? (
              <span className={"dark:text-white"}>Free</span>
            ) : (
              <>
                <span className={"dark:text-white"}>
                  {monthly ? plan.price.monthly : plan.price.annual}
                </span>
                <span className="ml-1 text-lg font-normal text-gray-500">
                  {monthly ? "/mo" : "/yr"}
                </span>
              </>
            )}
          </h1>
          {plan.features.map((feature, index) => (
            <PricingCardListItems key={index} feature={feature} />
          ))}

          <button
            className="mt-auto flex w-full items-center rounded border-0 bg-electric-violet px-4 py-2 text-white hover:bg-indigo-600 focus:outline-none"
            onClick={() => {
              openSignInModal("register");
            }}
          >
            TRY FOR FREE FOR 14 DAYS
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
          </button>

          <p className="mt-3 text-xs text-gray-500">{plan.text}</p>
        </div>
      </div>
    </>
  );
};
export { PricingCard };
