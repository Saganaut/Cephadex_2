import { ModalWrapper } from "@common/Modals/ModalWrapper";
import { ItemLookup } from "@source/common/Form/ItemLookup";
import React from "react";

interface LookedUpItem {
  id: number;
  [key: string]: any;
}
interface GroupDeckModalProps<T> {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectedItems: (items: T[], emails?: Array<{ email: string }>) => void;
}
const GroupDeckModal: React.FC<GroupDeckModalProps<LookedUpItem>> = ({
  isOpen,
  setIsOpen,
  handleSelectedItems,
}) => {
  return (
    <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="relative rounded-[20px]  px-[38px] py-[64px] c">
        <h1 className="mb-[48px] text-xl font-semibold ">Add Deck</h1>
        <ItemLookup handleSelectedItems={handleSelectedItems} type="deck" />
      </div>
    </ModalWrapper>
  );
};

export { GroupDeckModal };
