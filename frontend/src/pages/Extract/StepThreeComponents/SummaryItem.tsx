import React from "react";

interface SummaryItemProps {
  title: string;
  content: string;
}
const SummaryItem: React.FC<SummaryItemProps> = ({ title, content }) => {
  return (
    <>
      <div className="flex flex-row justify-between overflow-hidden py-2">
        <div className="text-tolopea dark:text-white">{title}</div>
        <div className="text-lg dark:text-aquamarine-100">{content}</div>
      </div>
    </>
  );
};

export { SummaryItem };
