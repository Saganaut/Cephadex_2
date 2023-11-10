import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { StripePricingTable } from "./StripePricingTable";

const UpgradePage = (): ReactElement => {
  return (
    <div>
      <StripePricingTable />
    </div>
  );
};

export { UpgradePage };
