import PlayerAvatar1 from "@assets/PlayerAvatar1.svg?react";
import { type GroupMemberSchema } from "@client/models/GroupMemberSchema";
import React from "react";

interface AdminProps {
  admin: GroupMemberSchema;
}
const Admin: React.FC<AdminProps> = ({ admin }) => {
  return (
    <>
      <PlayerAvatar1
        className={"h-[30px] w-[30px] text-tolopea dark:text-white"}
      />
      <h1 className={"text-lg font-semibold text-aquamarine"}>
        {admin.username}
      </h1>
    </>
  );
};

export { Admin };
