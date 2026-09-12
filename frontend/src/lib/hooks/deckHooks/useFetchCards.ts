import { unwrapResult } from "@reduxjs/toolkit";
import type { CardSchema } from "@source/client";
import {
  fetchCards,
  type FetchCardsParams,
} from "@source/lib/store/cards/actions";
import { selectCardsByDeckId } from "@source/lib/store/cards/cardsSlice";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

interface useFetchCardsReturn {
  cardsStatus: "idle" | "loading" | "succeeded" | "failed";
  orderedCards: CardSchema[];
  fetchParams: FetchCardsParams;
  setFetchParams: React.Dispatch<React.SetStateAction<FetchCardsParams>>;
  pages: { currentPage: number; totalPages: number };
  setPages: React.Dispatch<
    React.SetStateAction<{ currentPage: number; totalPages: number }>
  >;
}
export interface IPageCount {
  currentPage: number;
  totalPages: number;
}

export const useFetchCards = ({
  deckId,
}: {
  deckId: number;
}): useFetchCardsReturn => {
  const cards = useAppSelector((state) => selectCardsByDeckId(state, deckId));
  const cardsStatus = useAppSelector((state) => state.cards.status);
  const [orderedCards, setOrderedCards] = useState<CardSchema[]>([]);
  const dispatch = useAppDispatch();
  const [fetchParams, setFetchParams] = useState<FetchCardsParams>({
    searchQuery: "",
    deckId,
    order: "desc",
    page: 1,
    reset: false,
    itemsPerPage: 24,
    sortValue: "Date",
  });
  // const decksLoaded = useAppSelector((state) => state.cards.decksLoaded)
  const [pages, setPages] = useState<IPageCount>({
    currentPage: 0,
    totalPages: 1,
  });
  useEffect(() => {
    setOrderedCards((prevOrderedCards) => {
      const cardIds = new Set(cards.map((card) => card.id));
      const filtered = prevOrderedCards.filter((card) => cardIds.has(card.id));
      return filtered;
    });
  }, [cards]);

  const memoizedFetchParams = useMemo(
    () => fetchParams,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // need to disable here in order to properly use the memoized value in the useffect below
      fetchParams.deckId,
      fetchParams.page,
      fetchParams.searchQuery,
      fetchParams.sortValue,
      fetchParams.order,
    ]
  );

  const memoizedPages = useMemo(
    () => pages,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pages.currentPage, pages.totalPages] // need to disable here in order to properly use the memoized value in the useffect below
  );
  // case when there are cards, search is empty
  useEffect(() => {
    const getCards = async (): Promise<void> => {
      const response = await dispatch(fetchCards(memoizedFetchParams));
      const unwrappedRes = unwrapResult(response);
      if (unwrappedRes == null) return;
      if (memoizedFetchParams.reset === true && unwrappedRes.cards != null) {
        setOrderedCards(unwrappedRes.cards);
      } else if (unwrappedRes.cards != null && unwrappedRes.cards.length > 0)
        if (memoizedPages.currentPage >= memoizedPages.totalPages) return;

      setOrderedCards((prevCards) => {
        const newCards = unwrappedRes.cards ?? [];

        const filteredNewCards = newCards.filter(
          (newCard) => !prevCards.some((prevCard) => prevCard.id === newCard.id)
        );

        return [...prevCards, ...filteredNewCards];
      });
      setPages({
        currentPage: unwrappedRes.pageNumber,
        totalPages: unwrappedRes.totalPages,
      });
      setFetchParams((prev) => ({ ...prev, reset: false }));
    };
    // if (cards.length > 0 && orderedCards.length === 0) {
    //     setOrderedCards(cards)
    //     return
    // }
    if (
      memoizedPages.currentPage >= memoizedPages.totalPages &&
      memoizedFetchParams.reset === false
    )
      return;
    if (memoizedFetchParams.deckId !== undefined) {
      if (memoizedFetchParams.reset != null) void getCards();
    }
  }, [dispatch, memoizedPages, memoizedFetchParams]);

  return {
    cardsStatus,
    setFetchParams,
    fetchParams,
    pages,
    setPages,
    orderedCards,
  };
};
