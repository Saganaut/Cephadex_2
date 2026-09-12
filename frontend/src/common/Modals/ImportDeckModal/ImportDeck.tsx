import { ItemLookup } from "@source/common/Form/ItemLookup";
import { useToast } from "@source/lib/contexts/ToastContext";
import { importCardsFromOtherDecks } from "@source/lib/store/cards/actions";
import { useAppDispatch } from "@source/lib/store/hooks";
import React from "react";

interface LookedUpItem {
  id: number;
  [key: string]: any;
}
interface ImportDeckProps {
  deckId: number;
}
const ImportDeck: React.FC<ImportDeckProps> = ({ deckId }) => {
  const { postToast } = useToast();
  const dispatch = useAppDispatch();
  const handleSelectedDecks = (items: LookedUpItem[]): void => {
    const Ids = items.map((item) => item.id);
    const request = { ids: Ids };

    void dispatch(
      importCardsFromOtherDecks({ deckId: Number(deckId), request })
    );
    const frenchToast = {
      message: "Cards Imported",
      title: "Success!",
    };
    postToast(frenchToast);
  };

  return (
    <div className={"lg:px-[32px] px-[14px]"}>
      <ItemLookup handleSelectedItems={handleSelectedDecks} type="deck" />
    </div>
  );
};

export { ImportDeck };
