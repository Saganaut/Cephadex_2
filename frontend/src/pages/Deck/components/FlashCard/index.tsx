import { CardStructure } from "@common/Cards/CardStructure";
import { type Card } from "@customTypes/Deck";
import { MCQ } from "@deck/components/FlashCard/MCQ";
import { useSaveBatch } from "@hooks/useSaveBatch";
import {
  decrementCardFunction,
  incrementCardFunction,
} from "@study/components/PlayGround";
import React, { useState } from "react";

interface FlashCardProps {
  card: Card;
  isActive: boolean;
  show: boolean;
}
const FlashCard: React.FC<FlashCardProps> = ({ card, isActive, show }) => {
  const [answer, setAnswer] = useState<string | null>(null);
  const handlePushData = useSaveBatch();
  const handleCardUpdate = (answer: string | null): void => {
    setAnswer(answer);
    const isCorrect = answer === card.content;
    if (isCorrect) {
      handlePushData(decrementCardFunction(card));
    }
    if (!isCorrect) {
      handlePushData(incrementCardFunction(card));
    }
  };

  return (
    <div>
      <CardStructure>
        <div className="mb-5 rounded-lg border border-aquamarine p-5">
          <h4 className="text-2xl">{card.term} </h4>
          <p>Id: {card.id}</p>
          <p>Category: {card.category}</p>
        </div>
        <div className="rounded-xl border border-blaze-orange p-5">
          {card.category === "Definitions" && isActive && show && (
            <p>{card.content}</p>
          )}
          {card.category === "Mcq" && (
            <MCQ
              content={card.content}
              boc2={card["boc-2"]}
              answer={answer}
              boc3={card["boc-3"]}
              boc4={card["boc-4"]}
              handleCardUpdate={handleCardUpdate}
            />
          )}
        </div>
        <div className="mt-3">
          Data:
          <p> created on : {card["time-created"]}</p>
          <p> accessed on : {card["time-updated"]}</p>
          <p> times correct : {card["times-correct"]}</p>
          <p> times asked : {card["times-asked"]}</p>
          <p> difficulty level : {card["diff-lvl"]}</p>
          <p> Next time it will be asked : {card["srs-interval"]}</p>
        </div>
      </CardStructure>
    </div>
  );
};

export { FlashCard };
