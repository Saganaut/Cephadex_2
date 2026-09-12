import { ItemLookup } from "@source/common/Form/ItemLookup";
import { useCardContext } from "@source/lib/contexts/CardContext";
import { useToast } from "@source/lib/contexts/ToastContext";
import { copyCardToDeck } from "@source/lib/store/cards/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";

interface LookedUpItem {
  id: number;
  [key: string]: any;
}
const CardCopyModal: React.FC = () => {
  const { postToast } = useToast();
  const { deckId, card, setIsCardCopyModalOpen, isCardCopyModalOpen } =
    useCardContext();
  const frenchToast = {
    message: "Card Copied",
    title: "Success!",
  };
  const dispatch = useAppDispatch();

  // TODO: check out french toast issue?
  const handleSelectedDecks = (items: LookedUpItem[]): void => {
    // const Ids = items.map((item) => item.id);
    if (card == null) return;
    if (items[0] == null) return;
    void dispatch(
      copyCardToDeck({
        deckId: Number(deckId),
        cardId: card.id,
        deckToCopyToId: items[0].id,
      })
    );
    postToast(frenchToast);
  };

  return (
    <>
      <ModalWrapper
        isOpen={isCardCopyModalOpen}
        setIsOpen={setIsCardCopyModalOpen}
      >
        <div className=" rounded-[20px]  px-[20px] py-[64px]  sm:px-[38px]">
          <h1 className="mb-[48px] text-xl font-semibold ">
            Which deck do you want to copy the card into?
          </h1>

          <ItemLookup
            handleSelectedItems={handleSelectedDecks}
            type="copyCard"
          />
        </div>
      </ModalWrapper>
    </>
  );
};

export { CardCopyModal };
