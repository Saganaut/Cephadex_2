import type { GroupSchema } from "@source/client";
import { truncate } from "@utils/functions";
import React from "react";
import { CiCreditCard1 } from "react-icons/ci";

import { CardTag } from "./CardTag";

interface GroupBodyProps {
  data: GroupSchema;
}
const GroupBody: React.FC<GroupBodyProps> = ({ data }) => {
  return (
    <div className={"w-full rounded-[14px] bg-mariana-blue-100 p-[8px]"}>
      <div
        className={
          "flex items-center gap-x-[8px] rounded-[14px] bg-electric-violet px-[14px] py-[10px]"
        }>
        <CiCreditCard1 className={"text-[20px] text-white"} />
        <p className={"font-semibold"}>Details</p>
      </div>
      <div
        className={
          "mt-[12px] flex flex-wrap items-center gap-x-[8px] gap-y-[12px]"
        }>
        <p> {truncate(data.description ?? "", 100)}</p>
        {data.groupType != null && (
          <CardTag label={""} value={data.groupType?.toString() ?? "None"} />
        )}
        {data.isPrivate != null && (
          <CardTag label={""} value={data.isPrivate ? "Private" : "Public"} />
        )}
      </div>
    </div>
  );
};

export { GroupBody };
