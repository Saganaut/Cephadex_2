import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { type Card } from "@source/types/Deck";
import { CardStructure } from "@common/Cards/CardStructure";
interface FlashCardProps {
  card: Card;
}

const FlashCard = ({ card }: FlashCardProps): ReactElement => {
  return (
    <div>
      <CardStructure>
        <div className="front-of-card  mb-5 border border-aquamarine rounded-lg p-5">
          <h4 className="text-2xl">{card.term} </h4>
          <p>Id: {card.id}</p>
          <p>Category: {card.category}</p>
        </div>

        <div className="back-of-card border border-blaze-orange rounded-xl p-5">
          {card.category === "Definitions" && <p>1{card.content} </p>}
          {card.category === "Mcq" && (
            <>
              <ul>
                <li>A - {card.content} </li>
                <li>B - {card["boc-2"]}</li>
                <li>C - {card["boc-3"]}</li>
                <li>D - {card["boc-4"]}</li>
              </ul>
            </>
          )}
        </div>
        <div className="card-stats mt-3">
          Data:
          <p> created on - {card["time-created"]}</p>
          <p> accessed on- {card["time-updated"]}</p>
          <p> times correct - {card["times-correct"]}</p>
          <p> times asked - {card["times-asked"]}</p>
          <p> difficulty level - {card["diff-lvl"]}</p>
          <p> Next time it will be asked - {card["srs-interval"]}</p>
        </div>
      </CardStructure>
    </div>
  );
};

export { FlashCard };
