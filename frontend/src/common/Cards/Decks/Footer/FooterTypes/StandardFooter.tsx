import { type DeckSchema, type PublicDeckSchema } from "@source/client";
import { FavoriteToggler } from "@source/common/Favorite";
import { formatDate } from "@source/lib/utils/functions";
import React from "react";

import { CardsTag } from "../components/CardsTag";

interface StandardFooterProps {
  deck: DeckSchema | PublicDeckSchema;
}
const StandardFooter: React.FC<StandardFooterProps> = ({ deck }) => {
  return (
    <>
      {" "}
      <CardsTag qtyCards={deck?.qtyCards ?? 0} />
      <div className="flex items-end ">
        <span
          className={
            "block px-2 text-right text-[12px] text-tolopea dark:text-aquamarine"
          }
        >
          {"accessDate" in deck && formatDate(deck.accessDate ?? "")}
        </span>
        <FavoriteToggler
          itemId={deck.id}
          isFavorite={"fav" in deck ? deck.fav : false}
          itemType={"standard"}
        />
      </div>{" "}
    </>
  );
};

export { StandardFooter };
