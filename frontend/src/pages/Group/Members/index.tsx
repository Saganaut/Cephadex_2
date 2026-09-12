import EditNoBorder from "@assets/EditNoBorder.svg?react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { type GroupInviteSchema, type GroupMemberSchema } from "@source/client";
import React from "react";
import { twMerge } from "tailwind-merge";

import { Admin } from "./Admin";
import { Creator } from "./Creator";
import { Invitee } from "./Invitee";
import { Member } from "./Member";

interface MembersListProps {
  members: GroupMemberSchema[] | null | undefined;
  invites: GroupInviteSchema[] | undefined | null;
  groupId: number;
  permission: string;
  setPermissionModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const MembersList: React.FC<MembersListProps> = ({
  members,
  invites,
  groupId,
  permission,
  setPermissionModalIsOpen,
}) => {
  const [displayInvites, setDisplayInvites] = React.useState(false);
  const [displayMembers, setDisplayMembers] = React.useState(true);
  const creator = members?.find((p) => p.groupRole === "creator");
  const admin = members?.filter((p) => p.groupRole === "admin");
  const regularMember = members?.filter((p) => p.groupRole === "member");

  return (
    <div
      className={
        "flex  h-full w-full flex-col dark:bg-mariana-blue bg-electric-violet-200 p-[12px] dark:text-white text-tolopea sm:rounded-[14px]  overflow-hidden"
      }
    >
      {/* Members/Invites Count */}
      <div className={"mb-4 flex justify-between  "}>
        <div>
          <p className={" font-medium"}> Members list</p>
          <p className={"text-xs font-medium text-gray-300"}>
            {" "}
            {members?.length} {members?.length === 1 ? "member" : "members"}
          </p>
        </div>
        {permission === "write" && (
          <div className="flex items-center">
            <EditNoBorder
              className={"h-[25px] w-[25px] cursor-pointer  dark:text-white"}
              onClick={() => {
                setPermissionModalIsOpen(true);
              }}
            />
          </div>
        )}
      </div>
      {/* Creator */}
      <div
        className="flex cursor-pointer items-center"
        onClick={() => {
          setDisplayMembers(!displayMembers);
        }}
      >
        {displayMembers ? (
          <ChevronDownIcon
            className={"h-[20px] w-[20px] dark:text-white"}
            onClick={() => {
              setDisplayMembers(!displayMembers);
            }}
          />
        ) : (
          <ChevronRightIcon
            className={"h-[20px] w-[20px] dark:text-white"}
            onClick={() => {
              setDisplayMembers(!displayMembers);
            }}
          />
        )}
        <h1 className={"text-lg font-semibold"}>
          All{" "}
          {!displayMembers && (
            <span className="text-base"> ({members?.length})</span>
          )}
        </h1>
      </div>
      {displayMembers && (
        <div>
          <div
            className={twMerge(
              "my-[10px] w-full flex items-center justify-between rounded-[8px] p-[6px]"
            )}
          >
            <div className={"flex items-center gap-x-[8px]"}>
              {creator != null && <Creator creator={creator} />}
            </div>
          </div>
          {/* Admin */}
          {admin != null && admin.length > 0 && (
            <>
              {/* <h1 className={"text-lg font-semibold"}>Admin</h1> */}

              {admin?.map((member) => (
                <div
                  key={member.id}
                  className={"flex items-center gap-x-[8px]"}
                >
                  <Admin admin={member} />
                </div>
              ))}
            </>
          )}
          {/* Regular Member */}
          {regularMember != null && regularMember?.length > 0 && (
            <div>
              <div className={"flex items-center justify-between"}>
                <h1 className={"text-lg font-semibold "}>Members</h1>
                <div className={"flex items-center gap-x-[4px]"}></div>
              </div>
              {regularMember?.map((member) => (
                <div key={member.id}>
                  <Member member={member} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {invites != null && invites.length > 0 && (
        <div>
          <div
            className="flex cursor-pointer items-center"
            onClick={() => {
              setDisplayInvites(!displayInvites);
            }}
          >
            {displayInvites ? (
              <ChevronDownIcon
                className={"h-[20px] w-[20px] dark:text-white"}
              />
            ) : (
              <ChevronRightIcon
                className={"h-[20px] w-[20px] dark:text-white"}
              />
            )}
            <h1 className={"text-lg font-semibold"}>
              Invites{" "}
              {!displayInvites && (
                <span className="text-base">({invites?.length})</span>
              )}
            </h1>
          </div>
          <div
            className={twMerge(
              "flex flex-col items-center gap-y-[8px]",
              displayInvites ? "block" : "hidden"
            )}
          >
            {invites?.map((invite) => (
              <div key={invite.id}>
                <Invitee
                  invitation={invite}
                  groupId={groupId}
                  permission={permission}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export { MembersList };
