import React from "react";
import { PricingCardListItems } from "components/Pages/Pricing/PricingCardListItems";
import { useModal } from 'contexts/ModalContext';


const PricingCard = ({ plan, monthly }) => {
    const { openRegisterModal } = useModal();

  return (
    <>
      <div className="p-4 lg:w-1/3  w-full">
        <div className="h-full p-6 rounded-lg border-2 border-electric-violet flex flex-col relative overflow-hidden">
          {plan.populartag && (
            <>
              <span className="bg-electric-violet text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">
                POPULAR
              </span>
            </>
          )}
          <h2 className="text-sm tracking-widest title-font mb-1 font-medium">
            {plan.title}
          </h2>
          <h1 className="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
            {plan.plan === "free" ? (
              <span >
                Free
              </span>
            ) : (
              <>
                <span>{monthly ? plan.price.monthly : plan.price.annual}</span>
                <span className="text-lg ml-1 font-normal text-gray-500">
                  {monthly ? "/mo" : "/yr"}
                </span>
              </>
            )}
          </h1>
          {plan.features.map((feature, index) => (
            <PricingCardListItems key={index} feature={feature} />
          ))}



          <button className="flex items-center mt-auto text-white bg-electric-violet border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-600 rounded"
     onClick={() => { openRegisterModal(); }} >

            Register for free
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-4 h-4 ml-auto"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <p className="text-xs text-gray-500 mt-3">{plan.text}</p>
        </div>
      </div>
    </>
  );
};
export { PricingCard };
