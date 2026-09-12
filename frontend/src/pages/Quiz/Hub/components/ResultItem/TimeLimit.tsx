import ClockIcon from "@assets/ClockIcon.svg?react";
import React from "react";

import { InfoItem } from "./InfoItem";

interface TimeLimitProps {
  timeLimit: number;
}
const TimeLimit: React.FC<TimeLimitProps> = ({ timeLimit }) => {
  return (
    <InfoItem
      icon={<ClockIcon />}
      label="Time limit"
      content={timeLimit === 0 ? "None" : `${timeLimit} mins`}
      bgColor="bg-white"
    />
  );
};

export { TimeLimit };
