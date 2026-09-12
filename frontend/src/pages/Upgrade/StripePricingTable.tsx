import { Loading } from "@source/common/InfoComponents/Loading";
import { fetchUser } from "@source/lib/store/user/actions";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import React, { type ReactElement, useEffect, useState } from "react";

const StripePricingTable = (): ReactElement => {
  const pricingTableId = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID;
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   void dispatch(fetchUser());
  // }, []);
  // useEffect(() => {
  //   if (user?.stripeCustomerId != null) {
  //     window.location.replace(
  //       "https://billing.stripe.com/p/login/dR66pKbnh8vn7qo9AA"
  //     );
  //   }
  // }, [user]);

  if (user == null) {
    return <Loading />;
  }

  return (
    <div className="mt-20 overflow-hidden rounded-2xl border border-aquamarine bg-electric-violet p-5">
      {/* <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={stripeKey}
        client-reference-id={userId}
      ></stripe-pricing-table> */}

      <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={stripeKey}
        client-reference-id={user.id}
      ></stripe-pricing-table>
    </div>
  );
};

export { StripePricingTable };
