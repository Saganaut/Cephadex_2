import { CardStructure } from "@common/Cards/CardStructure";
import { type Card } from "@source/types/Deck";
import { decrementCard, incrementCard } from "@study/components/PlayGround";
import React, { useEffect, useState } from "react";

interface FlashCardProps {
  card: Card;
}
const shuffleMCQ = (array: Array<string | null>): Array<string | null> => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const FlashCard: React.FC<FlashCardProps> = ({ card }) => {
  const [shuffledValues, setShuffledValues] = useState<Array<string | null>>(
    []
  );
  const [answer, setAnswer] = useState<string | null>(null);

  const handleCardUpdate = async (answer: string | null): Promise<void> => {
    setAnswer(answer);
    const isCorrect = answer === card.content;
    if (isCorrect) {
      await decrementCard(card.id);
    }
    if (!isCorrect) {
      await incrementCard(card.id);
    }
  };

  useEffect(() => {
    // Extract values from the card object
    const valuesToShuffle = [
      card.content,
      card["boc-2"],
      card["boc-3"],
      card["boc-4"],
    ];
    // Shuffle the values and set the state
    setShuffledValues(shuffleMCQ(valuesToShuffle));
  }, []);

  return (
    <div>
      <CardStructure>
        <div className="front-of-card  mb-5 rounded-lg border border-aquamarine p-5">
          <h4 className="text-2xl">{card.term} </h4>
          <p>Id: {card.id}</p>
          <p>Category: {card.category}</p>
        </div>

        <div className="back-of-card rounded-xl border border-blaze-orange p-5">
          {card.category === "Definitions" && <p>{card.content}</p>}
          {card.category === "Mcq" && (
            <>
              <ul>
                <li
                  className={`${
                    answer != null && card.content === shuffledValues[0]
                      ? "text-green-500"
                      : answer != null && card.content !== shuffledValues[0]
                      ? "text-red-700"
                      : "text-white"
                  }`}
                  onClick={async () => {
                    await handleCardUpdate(shuffledValues[0]);
                  }}
                >
                  A - {shuffledValues[0]}
                </li>
                <li
                  className={`${
                    answer != null && card.content === shuffledValues[1]
                      ? "text-green-500"
                      : answer != null && card.content !== shuffledValues[1]
                      ? "text-red-700"
                      : "text-white"
                  }`}
                  onClick={async () => {
                    await handleCardUpdate(shuffledValues[1]);
                  }}
                >
                  B - {shuffledValues[1]}
                </li>
                <li
                  className={`${
                    answer != null && card.content === shuffledValues[2]
                      ? "text-green-500"
                      : answer != null && card.content !== shuffledValues[2]
                      ? "text-red-700"
                      : "text-white"
                  }`}
                  onClick={async () => {
                    await handleCardUpdate(shuffledValues[2]);
                  }}
                >
                  C - {shuffledValues[2]}
                </li>
                <li
                  className={`${
                    answer != null && card.content === shuffledValues[3]
                      ? "text-green-500"
                      : answer != null && card.content !== shuffledValues[3]
                      ? "text-red-700"
                      : "text-white"
                  }`}
                  onClick={async () => {
                    await handleCardUpdate(shuffledValues[3]);
                  }}
                >
                  D - {shuffledValues[3]}
                </li>
              </ul>
            </>
          )}
        </div>
        <div className="card-stats mt-3">
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
