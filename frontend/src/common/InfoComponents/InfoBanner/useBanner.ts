import { AdminService, type InfoBannerSchema } from "@source/client";
import React, { useEffect } from "react";

const ENVIRONMENT = import.meta.env.VITE_APP_ENV;

const useBanner = (): { banner: InfoBannerSchema | null } => {
  const [banner, setBanner] = React.useState<InfoBannerSchema | null>(null);

  useEffect(() => {
    const fetchBanner = async (): Promise<void> => {
      try {
        const res = await AdminService.retrieveActiveBanner();
        setBanner(res.banner);
      } catch (error) {}
    };
    void fetchBanner();
    const interval = setInterval(fetchBanner, 1000 * 60 * 60);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (ENVIRONMENT === "development") {
    return { banner: null };
  }

  return { banner };
};

export { useBanner };
