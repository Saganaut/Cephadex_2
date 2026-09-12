import { ItemLookup } from "@source/common/Form/ItemLookup";
import { setParentChildRelationship } from "@source/lib/store/decks/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";

interface LookedUpItem {
  id: number;
  [key: string]: any;
}
interface AddRelationshipModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  childDeckId: number;
}
const AddRelationshipModal: React.FC<AddRelationshipModalProps> = ({
  isOpen,
  setIsOpen,
  childDeckId,
}) => {
  const dispatch = useAppDispatch();

  const setAsParent = (items: LookedUpItem[]): void => {
    // const Ids = items.map((item) => item.id);
    if (items[0] == null) return;
    void dispatch(
      setParentChildRelationship({
        parentId: items[0].id,
        childId: childDeckId,
      })
    );
  };
  return (
    <>
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className=" rounded-[20px]  px-[20px] py-[64px]  sm:px-[38px]">
          <h1 className="mb-[48px] text-xl font-semibold ">
            Choose a deck to put this deck in
          </h1>

          <ItemLookup handleSelectedItems={setAsParent} type="deck" />
        </div>
      </ModalWrapper>
    </>
  );
};

export { AddRelationshipModal };
