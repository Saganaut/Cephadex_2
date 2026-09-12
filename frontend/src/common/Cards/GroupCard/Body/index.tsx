import { type GroupSchema } from "@source/client";
import React from "react";

import { GroupDescription } from "./GroupDescription";
import { GroupImg } from "./GroupImg";

interface BodyProps {
  group: GroupSchema;
  type: "group" | "standard" | "simple" | "public" | "groupAdmin" | "full";
}
const Body: React.FC<BodyProps> = ({ group, type }) => {
  return (
    <>
      {" "}
      <div className={"flex items-center gap-x-[10px] pt-4"}>
        <GroupImg img={group.img} />
        {/* <div className={"w-full pl-[15px]"}> */}
        <GroupDescription description={group.description} />
      </div>
    </>
  );
};

export { Body };
