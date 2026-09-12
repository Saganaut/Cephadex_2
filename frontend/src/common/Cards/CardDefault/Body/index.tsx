import {
  type DeckSchema,
  type GroupSchema,
  type QuizSchema,
} from "@source/client";
import React from "react";

import { DeckBody } from "./DeckBody";
import { GroupBody } from "./GroupBody";
import { QuizBody } from "./QuizBody";

interface BodyProps {
  data: DeckSchema | QuizSchema | GroupSchema;
  style?: string;
}
const Body: React.FC<BodyProps> = ({ data }) => {
  return (
    <>
      {" "}
      <div className="mt-[14px] flex w-full flex-wrap gap-x-[8px] gap-y-[12px] text-white">
        {data.type === "Deck" && <DeckBody data={data as DeckSchema} />}
        {data.type === "Quiz" && <QuizBody data={data as QuizSchema} />}
        {data.type === "Group" && <GroupBody data={data as GroupSchema} />}
      </div>
    </>
  );
};

export { Body };
