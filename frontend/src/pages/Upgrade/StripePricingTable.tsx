import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAppSelector } from "@store/hooks";
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const StripePricingTable = ({}) => {
  const pricingTableId = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID;
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const userId = useAppSelector((state) => state.user.user.id);
  console.log(pricingTableId);
  console.log(stripeKey);
  console.log(userId);
  return (
    <div className="border border-aquamarine rounded-2xl overflow-hidden p-5 bg-electric-violet mt-20">
      <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={stripeKey}
        client-reference-id={userId}
      ></stripe-pricing-table>
    </div>
  );
};

export { StripePricingTable };
