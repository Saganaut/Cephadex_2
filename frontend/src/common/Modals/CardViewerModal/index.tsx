import {
  DeckService,
  type PublicCardSchema,
  type PublicDeckSchema,
} from "@source/client";
// import { Filter } from "@source/common/Form/Filter";
import React, { useCallback, useEffect, useState } from "react";

import { ModalWrapper } from "../ModalWrapper";
import { CardViewer } from "./CardViewer";

interface SortOption {
  value: number;
  label: string;
}

const sortOptions: SortOption[] = [
  {
    value: 0,
    label: "date",
  },
  {
    value: 1,
    label: "term",
  },
];
const MAX_ITEMS_PER_PAGE = 24;

interface CardViewerModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deck: PublicDeckSchema;
}
const CardViewerModal: React.FC<CardViewerModalProps> = ({
  isOpen,
  setIsOpen,
  deck,
}) => {
  const [sortValue, setSortValue] = useState<SortOption>(sortOptions[0]);
  const [order, setOrder] = useState<"desc" | "asc">("asc");
  const [sortedArray, setSortedArray] = useState<PublicCardSchema[]>([]);
  const [cardSearchQuery, setCardSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [qtyPages, setQtyPages] = useState(1);
  const handleSearch = useCallback(async (): Promise<void> => {
    const response = await DeckService.searchPublicCards(
      deck.id,
      cardSearchQuery,
      "group",
      sortValue.label,
      order,
      pageNumber,
      MAX_ITEMS_PER_PAGE
    );
    if (response.cards != null) {
      setSortedArray((currentCards) => [...currentCards, ...response.cards]);
    }
    if (response.totalPages != null) {
      setQtyPages(response.totalPages);
    }
  }, [cardSearchQuery, sortValue, order, pageNumber, deck.id]);

  useEffect(() => {
    void handleSearch();
  }, [pageNumber, sortValue, order, handleSearch]);

  return (
    <>
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div
          className={
            "mx-auto h-[90vh] w-[90vw] overflow-hidden rounded-2xl bg-electric-violet-500 py-12 dark:bg-mariana-blue lg:px-[63px] xl:px-[126px]"
          }
        >
          <div className="mb-2 flex justify-center text-2xl text-tolopea dark:text-white sm:mb-0">
            <p>{deck.name} cards</p>
          </div>
          <div className="h-full w-full overflow-auto px-4 py-8 ">
            <CardViewer
              sortedArray={sortedArray}
              order={order}
              setOrder={setOrder}
              sortValue={sortValue}
              setSortValue={setSortValue}
              sortOptions={sortOptions}
              setSortedArray={setSortedArray}
              setCardSearchQuery={setCardSearchQuery}
              setPage={setPageNumber}
              deckId={deck.id}
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};

export { CardViewerModal };
