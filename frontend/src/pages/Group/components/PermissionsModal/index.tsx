import { type GroupMemberSchema } from "@client/models/GroupMemberSchema";
import { ModalWrapper } from "@common/Modals/ModalWrapper";
import { type PermissionChange } from "@source/client";
import { Button } from "@source/common/Buttons/Button";
import { updatePermissions } from "@source/lib/store/group/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import React, { useState } from "react";

import { MemberItem } from "./MemberItem";

interface GroupPermissionsModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  members: GroupMemberSchema[];
  groupId: number;
}
const GroupPermissionsModal: React.FC<GroupPermissionsModalProps> = ({
  isOpen,
  setIsOpen,
  members,
  groupId,
}) => {
  const [updatedPermissions, setUpdatedPermissions] = useState<
    PermissionChange[]
  >([]);

  const dispatch = useAppDispatch();

  const changePermissions = (): void => {
    void dispatch(
      updatePermissions({
        groupId,
        permissionsToChange: updatedPermissions,
      })
    );
  };

  const membersWithoutCreator = members.filter(
    (member) => member.groupRole !== "creator"
  );

  return (
    <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="relative rounded-[20px]  px-[38px] py-[64px] ">
        <h1 className="mb-[48px] text-xl font-semibold ">Change permissions</h1>
        {membersWithoutCreator.length === 0 ? (
          <div className="text-center ">No members to show permissions for</div>
        ) : (
          <>
            <div>
              {membersWithoutCreator.map((member) => (
                <div key={member.id} className="p-1">
                  <MemberItem
                    member={member}
                    updatedPermissions={updatedPermissions}
                    setUpdatedPermissions={setUpdatedPermissions}
                  />
                </div>
              ))}
            </div>
            <Button
              onClick={changePermissions}
              className={"mt-[32px]"}
              label={"Update"}
            />{" "}
          </>
        )}
      </div>
    </ModalWrapper>
  );
};

export { GroupPermissionsModal };
