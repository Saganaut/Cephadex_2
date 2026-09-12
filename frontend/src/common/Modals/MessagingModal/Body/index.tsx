import React from "react";

import { DeckReady } from "./components/DeckReady";
import { InsufficientCredit } from "./components/InsufficientCredit";

interface DeckReadyProps {
  deckId?: string;
}

interface BodyProps {
  type: "standard" | "deckReady" | "insufficientCredit" | "deckSaved" | "error";
  optionalProps?: DeckReadyProps;
  message?: string;
  setIsMessageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Add deck saved component
const Body: React.FC<BodyProps> = ({
  type,
  optionalProps,
  message,
  setIsMessageModalOpen,
}) => {
  return (
    <>
      {type === "standard" && (
        <div className="text-tolopea dark:text-aquamarine">
          <p>{message}</p>
        </div>
      )}
      {type === "error" && (
        <div className="text-tolopea dark:text-aquamarine">
          <p>{message}</p>
        </div>
      )}
      {type === "deckReady" && optionalProps?.deckId !== undefined && (
        <DeckReady
          setIsMessageModalOpen={setIsMessageModalOpen}
          deckReadyProps={{ deckId: optionalProps.deckId }}
        />
      )}
      {type === "insufficientCredit" && <InsufficientCredit />}
      {type === "deckSaved" && (
        <div className="text-tolopea dark:text-aquamarine">
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export { Body };
