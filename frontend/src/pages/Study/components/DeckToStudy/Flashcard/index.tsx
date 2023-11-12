import { type Card } from "@customTypes/Deck";
import React, { type SetStateAction, useEffect, useState } from "react";

import { Definition } from "./Definition";
import { MCQ } from "./MQC";

interface FlashCardProps {
  card: Card;
  handleMQCCardUpdate: (
    answer: string | null,
    setAnswer: React.Dispatch<SetStateAction<string | null>>
  ) => void;
  isActive: boolean;
  setGlobalShow: React.Dispatch<React.SetStateAction<boolean>>;

  handleDefinitionCardUpdate: (gotIt: boolean) => void;
}
const Flashcard: React.FC<FlashCardProps> = ({
  card,
  handleMQCCardUpdate,
  handleDefinitionCardUpdate,
  isActive,
  setGlobalShow,
}) => {
  const [show, setShow] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  useEffect(() => {
    setGlobalShow(show);
  }, [isActive, show]);
  return (
    <div className={"w-full"}>
      <div className="w-full">
        {card.category === "Definitions" && (
          <Definition
            setShow={setShow}
            show={show}
            handleDefinitionCardUpdate={handleDefinitionCardUpdate}
            card={card}
          />
        )}

        {card.category === "Mcq" && (
          <MCQ
            content={card.content}
            boc2={card["boc-2"]}
            answer={answer}
            setAnswer={setAnswer}
            boc3={card["boc-3"]}
            boc4={card["boc-4"]}
            handleCardUpdate={handleMQCCardUpdate}
          />
        )}
      </div>
    </div>
  );
};

export { Flashcard };
