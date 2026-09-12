import MemberCephaOneIcon from "@assets/MemberCephaOneIcon.svg?react";
import MinusCircle from "@assets/MinusCircle.svg?react";
import { type GroupInviteSchema } from "@source/client";
import { deleteInvitation } from "@source/lib/store/group/actions";
import { useAppDispatch } from "@store/hooks";
import { truncate } from "@utils/functions";
import React from "react";

interface InviteeProps {
  invitation: GroupInviteSchema;
  permission: string;
  groupId: number;
}

const Invitee: React.FC<InviteeProps> = ({
  invitation,
  permission,
  groupId,
}) => {
  const dispatch = useAppDispatch();

  const handleDeleteInvitation = (): void => {
    void dispatch(deleteInvitation({ groupId, InvitesToDelete: [invitation] }));
  };

  return (
    <div
      className={
        "my-[10px] flex w-full items-center justify-between rounded-full bg-transparent p-[6px]"
      }
    >
      <div className={"flex items-center"}>
        <div className={"relative  h-[20px] w-[20px] rounded-full"}>
          {invitation.username != null ? (
            <MemberCephaOneIcon
              className={"relative   h-[20px] w-[20px] rounded-full"}
            />
          ) : (
            ""
          )}
        </div>
        <h1 className={"pl-[12px] pr-[20px]  text-lg "}>
          {truncate(invitation.username ?? invitation.email, 10)}
        </h1>
      </div>
      <MinusCircle
        className="h-[20px] w-[20px] cursor-pointer rounded-full bg-electric-violet hover:scale-105 dark:bg-transparent"
        onClick={handleDeleteInvitation}
      />{" "}
    </div>
  );
};

export { Invitee };
