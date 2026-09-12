import QuestionMarkIcon from "@assets/QuestionIcon.svg?react";
import React from "react";

import { InfoItem } from "./InfoItem";

interface QuestionsInfoProps {
  numQuestions: number;
}
const QuestionsInfo: React.FC<QuestionsInfoProps> = ({ numQuestions }) => {
  return (
    <InfoItem
      icon={<QuestionMarkIcon />}
      label="Questions"
      content={numQuestions.toString()}
      bgColor="bg-electric-violet"
    />
  );
};

export { QuestionsInfo };
