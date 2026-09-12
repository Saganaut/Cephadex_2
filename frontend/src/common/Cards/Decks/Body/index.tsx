import { type DeckSchema, type PublicDeckSchema } from "@source/client";
import React from "react";

import { DeckDescription } from "./DeckDescription";
import { DeckImg } from "./DeckImg";

interface BodyProps {
  deck: DeckSchema | PublicDeckSchema;
  type: "group" | "standard" | "simple" | "public" | "groupAdmin" | "full";
}
const Body: React.FC<BodyProps> = ({ deck, type }) => {
  return (
    <>
      <div className={"flex items-center gap-x-[10px] overflow-hidden pt-5"}>
        <DeckImg img={deck.img} />
        {/* <div className={"w-full pl-[15px]"}> */}
        <DeckDescription description={deck.description} />
      </div>
    </>
  );
};

export { Body };
