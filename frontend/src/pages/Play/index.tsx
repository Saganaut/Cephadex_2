import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";

import { fetchDecksThunk } from "@services/Api/Deck/DeckApiThunks";

const Play = (): ReactElement => {
  const decks = useAppSelector((state) => state.decks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDecksThunk());
  }, [dispatch]);

  return (
    <div className="text-white mt-40">
      <h1 className="text-2xl my-10">Play</h1>
      {decks.decks.map((deck) => (
        <div key={deck.id}>{deck.name}</div>
      ))}
    </div>
  );
};

export { Play };
