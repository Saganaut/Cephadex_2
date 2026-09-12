import { type QuizSchema } from "@source/client";
import React from "react";
import { TbListDetails } from "react-icons/tb";

import { CardTag } from "./CardTag";

interface QuizBodyProps {
  data: QuizSchema;
}
const QuizBody: React.FC<QuizBodyProps> = ({ data }) => {
  return (
    <div className={"w-full  rounded-[14px] bg-mariana-blue-100 p-[8px]"}>
      <div
        className={
          "flex items-center gap-x-[8px] rounded-[14px] bg-electric-violet px-[14px] py-[10px]"
        }
      >
        <TbListDetails className={"text-[20px] text-white"} />
        <p className={"font-semibold"}>Details</p>
      </div>
      <div
        className={
          "mt-[12px] flex flex-wrap items-center gap-x-[8px] gap-y-[12px]"
        }
      >
        <CardTag
          label={"Questions"}
          value={data.qtyQuestions?.toString() ?? "None"}
        />{" "}
        {data.subject != null && (
          <CardTag label={""} value={data.subject?.toString() ?? "None"} />
        )}
        {data.category != null && (
          <CardTag label={""} value={data.category?.toString() ?? "None"} />
        )}
        {data.topic != null && (
          <CardTag label={""} value={data.topic?.toString() ?? "None"} />
        )}
      </div>
    </div>
  );
};

export { QuizBody };
