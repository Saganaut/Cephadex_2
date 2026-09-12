import { type DeckSchema, type PublicDeckSchema } from "@source/client";
import React from "react";

import { GroupFooter } from "./FooterTypes/GroupFooter";
import { PublicFooter } from "./FooterTypes/PublicFooter";
import { StandardFooter } from "./FooterTypes/StandardFooter";

interface FooterProps {
  deck: DeckSchema | PublicDeckSchema;
  type: "group" | "standard" | "simple" | "public" | "groupAdmin" | "full";
}

const Footer: React.FC<FooterProps> = ({ deck, type }) => {
  return (
    <>
      <div className={"mt-4 flex w-full items-center justify-between"}>
        {type === "public" && <PublicFooter deck={deck as PublicDeckSchema} />}
        {type === "standard" && <StandardFooter deck={deck} />}
        {(type === "group" || type === "groupAdmin") && (
          <GroupFooter deck={deck} />
        )}
      </div>
    </>
  );
};

export { Footer };
