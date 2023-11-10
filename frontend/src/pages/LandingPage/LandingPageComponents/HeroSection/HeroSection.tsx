import {
  CallToAction,
  IntroVideo,
} from "@landingpage/LandingPageComponents/HeroSection/CallToAction";
import React, { type ReactElement } from "react";

const HeroSection = (): ReactElement => {
  return (
    <div
      style={{ height: "auto", minHeight: "calc(100vh - 120px)" }}
      className="bg-electric-violet p-10"
    >
      <div className="flex h-full flex-col-reverse lg:flex-row">
        <div className="flex h-auto w-full items-center justify-center p-5 lg:h-1/2">
          <IntroVideo />
        </div>
        <div className="flex h-auto w-full items-center justify-center p-5 lg:h-1/2">
          <CallToAction />
        </div>
      </div>
    </div>
  );
};

export { HeroSection };
