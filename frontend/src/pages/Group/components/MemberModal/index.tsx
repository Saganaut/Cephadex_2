import { ModalWrapper } from "@common/Modals/ModalWrapper";
import { ItemLookup } from "@source/common/Form/ItemLookup";
import React from "react";

interface LookedUpItem {
  id: number;
  [key: string]: any;
}

interface GroupMemberModalProps<T> {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectedItems: (items: T[], emails?: Array<{ email: string }>) => void;
}

// TODO need better way of inviting members, here adding them is doing so one by one.  SHould have an invite button
const GroupMemberModal: React.FC<GroupMemberModalProps<LookedUpItem>> = ({
  isOpen,
  setIsOpen,
  handleSelectedItems,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="relative rounded-[20px] px-[38px] py-[64px] ">
        <h1 className="mb-[48px] text-xl font-semibold ">Add Members</h1>

        <ItemLookup handleSelectedItems={handleSelectedItems} type="user" />
      </div>
    </ModalWrapper>
  );
};

export { GroupMemberModal };
