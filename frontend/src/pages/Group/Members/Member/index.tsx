import MemberCephaOneIcon from "@assets/MemberCephaOneIcon.svg?react";
import { type GroupMemberSchema } from "@source/client";
import React from "react";
import { twMerge } from "tailwind-merge";

interface MemberProps {
  member: GroupMemberSchema;
}
const Member: React.FC<MemberProps> = ({ member }) => {
  return (
    <div
      className={twMerge(
        "my-[10px] bg-electric-violet w-full flex items-center justify-between rounded-full p-[6px]"
      )}
    >
      <div className={"flex items-center"}>
        <div className={"relative  h-[35px] w-[35px] rounded-full"}>
          {member.pic != null && member.pic !== "" ? (
            <img src={member.pic} alt={"avatar"} />
          ) : (
            <MemberCephaOneIcon />
          )}
        </div>
        <h1 className={"pl-[12px] pr-[20px] text-sm  font-medium lg:text-lg"}>
          {member.username}
        </h1>
      </div>

      <p
        className={
          " flex h-[22px] w-[22px] min-w-[22px] items-center justify-center rounded-full bg-mariana-blue text-xs font-medium "
        }
      >
        {member.groupRole}
      </p>
    </div>
  );
};
export { Member };
