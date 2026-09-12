import PlayerAvatar1 from "@assets/PlayerAvatar1.svg?react";
import { type GroupMemberSchema } from "@client/models/GroupMemberSchema";
import React from "react";

interface CreatorProps {
  creator: GroupMemberSchema;
}
const Creator: React.FC<CreatorProps> = ({ creator }) => {
  return (
    <>
      <PlayerAvatar1 className={"h-[30px] w-[30px] "} />
      <h1 className={"text-sm  md:font-medium lg:text-lg"}>
        {creator?.username}
      </h1>
    </>
  );
};

export { Creator };
