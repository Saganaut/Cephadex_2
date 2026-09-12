import React, { createContext, useContext, useState } from "react";
import { AdminService, type InfoBannerSchema } from "@source/client";
import { useBanner } from "@source/common/InfoComponents/InfoBanner/useBanner";

const ENVIRONMENT = import.meta.env.VITE_APP_ENV;

const BannerContext = createContext<
  { banner: InfoBannerSchema | null } | undefined
>(undefined);

interface BannerProviderProps {
  children: React.ReactNode;
}

const BannerProvider: React.FC<BannerProviderProps> = ({ children }) => {
  const { banner } = useBanner();

  return (
    <BannerContext.Provider value={{ banner }}>
      {children}
    </BannerContext.Provider>
  );
};

const useBannerContext = (): { banner: InfoBannerSchema | null } => {
  return useContext(BannerContext) as { banner: InfoBannerSchema | null };
};

export { BannerProvider };
export { BannerContext };
export { useBannerContext };
