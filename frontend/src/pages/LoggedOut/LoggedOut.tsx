import { SpeakingCeph } from "@source/common/SpeakingCeph";
import React from "react";

const LoggedOut: React.FC = () => {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-electric-violet">
      <SpeakingCeph text="You have been logged out, we hope to see you again soon!" />
    </div>
  );
};

export default LoggedOut;
