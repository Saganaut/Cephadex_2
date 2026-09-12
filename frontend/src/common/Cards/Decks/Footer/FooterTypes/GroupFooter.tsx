import { type DeckSchema, type PublicDeckSchema } from "@source/client";
import React from "react";

import { CardsTag } from "../components/CardsTag";

interface GroupFooterProps {
  deck: DeckSchema | PublicDeckSchema;
}
const GroupFooter: React.FC<GroupFooterProps> = ({ deck }) => {
  return (
    <>
      <CardsTag qtyCards={deck?.qtyCards ?? 0} />

      <div className="flex items-end ">
        <span
          className={
            "darktext-aquamarine block px-2 text-right text-[12px] text-tolopea"
          }
        ></span>
      </div>
    </>
  );
};

export { GroupFooter };
