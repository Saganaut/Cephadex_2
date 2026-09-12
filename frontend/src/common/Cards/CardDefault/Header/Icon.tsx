// <reference types="vite-plugin-svgr/client" />

import DeckIcon from "@assets/DeckIcon.svg?react";
import GroupIcon from "@assets/GroupOctopusIcon.svg?react";
import QuizIcon from "@assets/QuizIcon.svg?react";
import {
  type DeckSchema,
  type GroupSchema,
  type QuizSchema,
} from "@source/client";
import React from "react";

interface IconProps {
  data: DeckSchema | QuizSchema | GroupSchema;
}
const Icon: React.FC<IconProps> = ({ data }) => {
  return (
    <>
      {" "}
      <div
        className={
          "inline-flex  items-center gap-x-[8px] rounded-full bg-white p-1 pr-[18px] dark:bg-tolopea"
        }
      >
        {data.type === "Quiz" && <QuizIcon className={"h-[35px] w-[35px]"} />}
        {data.type === "Deck" &&
          (data.img === null ? (
            <DeckIcon className={"h-[35px] w-[35px]"} />
          ) : (
            <img
              src={data.img}
              alt="deck"
              className="h-[40px] w-[40px] rounded-full border-2 border-aquamarine"
            />
          ))}{" "}
        {data.type === "Group" && <GroupIcon className={"h-[35px] w-[35px]"} />}
        <h1 className={"font-medium"}>{data.type}</h1>
      </div>
    </>
  );
};

export { Icon };
