import React from "react";
import { MdQuestionMark } from "react-icons/md";

interface QuestionsInfoProps {
  numQuestions: number | null;
}
const QuestionsInfo: React.FC<QuestionsInfoProps> = ({ numQuestions }) => {
  return (
    <div>
      <div
        className={
          "flex max-w-[60px] items-center justify-between rounded-full gap-1 bg-tolopea px-[4px] py-[1px] pr-4"
        }
      >
        <div
          className={
            "flex h-[20px] w-[20px] items-center justify-center rounded-full bg-electric-violet"
          }
        >
          <MdQuestionMark className={"h-[16px] w-[16px]"} />
        </div>
        <h1 className={" text-lg font-medium"}>{numQuestions ?? ""}</h1>
      </div>
      <h1 className={"py-[2px] text-sm"}>Questions</h1>
      <span
        className={"block h-[2px] w-full rounded-full bg-electric-violet"}
      />
    </div>
  );
};

export { QuestionsInfo };
