import React from "react";

import { useCardData } from "../hooks/useCardData";
import { SummaryItem } from "./SummaryItem";

const DeckSummary: React.FC = () => {
  const {
    sourceType,
    cardType,
    checkedExtras,
    checkedSource,
    language,
    subject,
    detail,
  } = useCardData();
  return (
    <>
      <div className="py-2 text-xl text-tolopea dark:text-aquamarine sm:text-xl">
        Creation summary
      </div>
      <div className="rounded-xl bg-aquamarine-100 p-6 text-tolopea dark:bg-mariana-blue-100 dark:text-white">
        <SummaryItem title={`Source ${sourceType}`} content={checkedSource} />
        <hr className="h-2 w-full border-electric-violet-200 dark:border-gray-300" />
        <SummaryItem title={`Types of cards`} content={cardType} />
        <hr className="h-2 w-full border-electric-violet-200 dark:border-gray-300" />
        <SummaryItem title={`Extras`} content={checkedExtras} />
        <hr className="h-2 w-full border-electric-violet-200 dark:border-gray-300" />
        <SummaryItem title={`Language`} content={language} />
        <hr className="h-2 w-full border-electric-violet-200 dark:border-gray-300" />
        <SummaryItem title={`Subject`} content={subject} />
        <hr className="h-2 w-full border-electric-violet-200 dark:border-gray-300" />
        <SummaryItem title={`Detail level`} content={detail} />
      </div>
    </>
  );
};

export { DeckSummary };
