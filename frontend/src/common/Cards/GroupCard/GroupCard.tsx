import { type GroupSchema } from "@source/client";
import React from "react";

import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface GroupCardProps {
  group: GroupSchema;
  checked?: boolean;
  groupId?: number;
  isCard?: boolean;
  permission?: string;
  type: "group" | "standard" | "simple" | "public" | "groupAdmin" | "full";
}
const GroupCard: React.FC<GroupCardProps> = ({
  group,
  checked,
  groupId,
  permission,
  type,
  isCard,
}) => {
  return (
    <>
      <div
        className={`w-full cursor-pointer flex-col rounded-[10px] dark:bg-tolopea bg-aquamarine-100 dark:text-white text-tolopea hover:bg-aquamarine-900 px-[16px] py-[10px] transition-all duration-100 ease-linear hover:dark:bg-electric-violet`}
      >
        <Header group={group} type={type} groupId={groupId} />
        <Body group={group} type={type} />
        <Footer group={group} type={type} />
      </div>
    </>
  );
};

export { GroupCard };
