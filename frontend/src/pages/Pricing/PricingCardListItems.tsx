import React from "react";

interface PricingCardListItemsProps {
  feature: string;
}
const PricingCardListItems: React.FC<PricingCardListItemsProps> = ({
  feature,
}) => {
  return (
    <div>
      <p className="mb-6 flex items-center text-gray-600 dark:text-aquamarine">
        <span className="mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blaze-orange text-white">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            className="h-3 w-3"
            viewBox="0 0 24 24"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        {feature}
      </p>
    </div>
  );
};

export { PricingCardListItems };
