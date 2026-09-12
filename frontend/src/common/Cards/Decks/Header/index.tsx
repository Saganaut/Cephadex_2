import { type DeckSchema, type PublicDeckSchema } from "@source/client";
import React from "react";

import { DeckName } from "./DeckName";

interface CardHeaderProps {
  deck: DeckSchema | PublicDeckSchema;
}
const Header: React.FC<CardHeaderProps> = ({ deck }) => {
  return (
    <div className="max-w-fit">
      <DeckName name={deck.name} />
    </div>
  );
};

export { Header };
