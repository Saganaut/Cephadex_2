import type { CardSchema } from "@source/client";
import type { FetchCardsParams } from "@source/lib/store/cards/actions";
import { sortOptions } from "@source/pages/Group/useGroup";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { CardCard } from "../Cards/Cards/CardCard";
import { SearchAndSortWrapper } from "../SelectWrapper/SearchAndSortWrapper";

interface CardDisplayProps {
  onCardClick: (cardId: number) => void;
  fetchParams: FetchCardsParams;
  setFetchParams: React.Dispatch<React.SetStateAction<FetchCardsParams>>;
  cards: CardSchema[];
  sortOptions: Array<{ value: number; label: string }>;
  pages: { currentPage: number; totalPages: number };
}

const CardDisplay = ({
  cards,
  fetchParams,
  onCardClick,
  setFetchParams,
  pages,
}: CardDisplayProps): React.ReactElement => {
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCardRef = useCallback(
    (node: HTMLDivElement) => {
      if (pages != null && pages.currentPage >= pages.totalPages) return;
      if (observer.current != null) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0] != null &&
            entries[0].isIntersecting &&
            entries[0].intersectionRatio > 0.5
          ) {
            setFetchParams((prev) => ({
              ...prev,
              page: (prev.page ?? 0) + 1,
              reset: false,
            }));
          }
        },
        {
          threshold: 0.5,
        }
      );

      if (node != null) observer.current.observe(node);
    },
    [setFetchParams, pages]
  );
  return (
    <SearchAndSortWrapper
      title='Select a card'
      setFetchParams={setFetchParams}
      fetchParams={fetchParams}
      searchPlaceholder={"Search For Cards"}
      sortOptions={sortOptions}>
      <div
        className={
          "grid size-full grid-cols-1 gap-x-[30px] gap-y-[24px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
        }>
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              ref={index === cards.length - 1 ? lastCardRef : null}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{
                delay: 0.05 * index,
                ease: "easeOut",
              }}
              onClick={() => {
                onCardClick(card.id);
              }}
              key={index}>
              <CardCard
                key={card.id}
                card={card}
                deckId={fetchParams.deckId}
                cardType='standard'
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {cards != null && cards?.length <= 0 && (
        <div className={"mx-auto text-center font-medium text-white"}>
          <p>
            No cards found...
            <span
              className={"cursor-pointer text-aquamarine underline"}
              onClick={() => {
                navigate("/create-deck");
              }}>
              Create some now.
            </span>
          </p>
        </div>
      )}
    </SearchAndSortWrapper>
  );
};

export { CardDisplay };
