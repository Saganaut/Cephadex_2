import { fetchDecksThunk } from "@services/Api/Deck/DeckApiThunks";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import React, { type ReactElement, useEffect } from "react";

const Play = (): ReactElement => {
  const decks = useAppSelector((state) => state.decks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDecksThunk());
  }, [dispatch]);

  return (
    <div className="mt-40 text-white">
      <h1 className="my-10 text-2xl">Play</h1>
      {decks.decks.map((deck) => (
        <div key={deck.id}>{deck.name}</div>
      ))}
    </div>
  );
};

export { Play };
