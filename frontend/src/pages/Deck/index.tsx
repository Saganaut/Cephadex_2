import { FlashCard } from "@deck/components/FlashCard";
import { fetchDeckCardsThunk } from "@services/Api/Deck/CardApiThunks";
import { fetchDecksThunk } from "@services/Api/Deck/DeckApiThunks";
import { type Deck } from "@source/types/Deck";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import React, { type ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DeckPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const deckCards = useAppSelector((state) => state.deckCards);
  const { deckId } = useParams<{ deckId: string }>();
  const decks = useAppSelector((state) => state.decks);
  const [deck, setDeck] = useState<Deck | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchDecksThunk());
    if (decks) {
      const id = parseInt(deckId, 10);
      const foundDeck = decks.decks.find((d) => d.id === id);
      setDeck(foundDeck);
    }
  }, [dispatch]);

  useEffect(() => {
    const id = parseInt(deckId, 10);
    if (!isNaN(id)) {
      dispatch(fetchDeckCardsThunk(id));
    }
  }, [dispatch, deckId]);

  return (
    <div className="mt-40">
      <div id="deck-info" className="p-5 text-white">
        Deck info
        {deck ? (
          <>
            <li>Name: {deck.name}</li>
            <li>Description: {deck.description}</li>
            <li>Number of cards:{deck["qty-cards"]}</li>
            <li>Cards due: {deck["qty-cards-due"]}</li>
            <li>Last accessed: {deck["access-date"]}</li>
            <li>Creatded on: {deck["time-created"]}</li>
            <li>Subject: {deck.subject}</li>
            <li>Topc: {deck.topic}</li>
          </>
        ) : (
          <div>Loading deck information...</div>
        )}
      </div>
      <div id="deck-cards" className="mt-5 text-white">
        CARDS
        <div className="flex flex-wrap">
          {deckCards && deckCards.deckCards && deckCards.deckCards.cards ? (
            deckCards.deckCards.cards.map((card, index) => (
              <div key={index} className="m-2">
                <FlashCard card={card} />
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export { DeckPage };
