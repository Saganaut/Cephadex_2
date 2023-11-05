import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import {
  fetchCardsFromDeck,
  editCard,
  createCard,
  deleteCard,
  regenerateDefinition,
} from "@services/Api/Deck/CardApi";
import { type Card } from "@source/types/Deck";
import { type Deck } from "@source/types/Deck";
import { FlashCard } from "@app/Features/Deck/FlashCard";
import { useAppDispatch, useAppSelector } from "@store/hooks";

const Deck = (): ReactElement => {
  const dashboardCardsData = useAppSelector((state) => state.dashboardCards);

  console.log("dashboardCardsData:", dashboardCardsData);
  const [cards, setCards] = useState<Card[] | null>(null);
  const { deckId } = useParams<{ deckId: string }>();
  console.log("Deck id from useParams:", deckId);

  const deckCard = dashboardCardsData.find(
    (card) => card.type === "Deck" && card.id.toString() === deckId
  );

  useEffect(() => {
    const fetchCards = async (): Promise<void> => {
      try {
        const data = await fetchCardsFromDeck(deckId);
        setCards(data);
      } catch (error) {
        console.error("failed to fetch cards data", error);
      }
    };
    void fetchCards();
  }, []);
  console.log("cards:", cards);

  return (
    <div className="mt-50">
      <div id="deck-info" className="text-white p-5">
        Deck info
        <li>Name: {deckCard.name}</li>
        <li>Description:{deckCard.description}</li>
        <li>Number of cards:{deckCard["qty-cards"]}</li>
        <li>Cards due: {deckCard["qty-cards-due"]}</li>
        <li>New cards: {deckCard["qty-cards-new"]}</li>
        <li>Last accessed: {deckCard["access-date"]}</li>
        <li>Creatded on: {deckCard["time-created"]}</li>
        <li>Subject: {deckCard.subject}</li>
        <li>Topc: {deckCard.topic}</li>
      </div>
      <div id="deck-cards" className="text-white mt-5">
        CARDS
        <div className="flex flex-wrap">
          {cards == null ? (
            <div>Loading...</div>
          ) : (
            cards.map((card, index) => (
              <div key={index} className="m-2">
                <FlashCard card={card} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { Deck };
