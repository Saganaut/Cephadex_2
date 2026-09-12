import CheckMarkIcon from "@assets/CheckIcon.svg?react";
import React from "react";

import { InfoItem } from "./InfoItem";

interface PointsProps {
  points: number;
}
const Points: React.FC<PointsProps> = ({ points }) => {
  return (
    <>
      <InfoItem
        icon={<CheckMarkIcon />}
        label="Points"
        content={points.toString()}
        bgColor="bg-blaze-orange"
      />
    </>
  );
};

export { Points };
