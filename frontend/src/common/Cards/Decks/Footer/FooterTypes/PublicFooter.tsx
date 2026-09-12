import { DeckService, type PublicDeckSchema } from "@source/client";
import { FavoriteToggler } from "@source/common/Favorite";
import React, { useState } from "react";

import { CardsTag } from "../components/CardsTag";
import { DeckShares } from "../components/DeckShares";

interface PublicFooterProps {
  deck: PublicDeckSchema;
}

const PublicFooter: React.FC<PublicFooterProps> = ({ deck }) => {
  const [liveLikes, setLiveLikes] = useState(deck.likes);
  const [liked, setLiked] = useState(deck.liked);

  const likeDeck = async (): Promise<void> => {
    const response = await DeckService.toggleLikeDeck(deck.id);
    if (response.liked === true) {
      setLiveLikes((liveLikes) => liveLikes + 1);
    } else {
      setLiveLikes((liveLikes) => liveLikes - 1);
    }
    setLiked(response.liked);
  };
  return (
    <>
      {" "}
      <>
        {" "}
        <CardsTag qtyCards={deck?.qtyCards ?? 0} />
        <div className="flex items-end gap-2 ">
          {/* <span
            className={"block px-2 text-right text-[12px] text-aquamarine"}
          ></span> */}
          <DeckShares shares={deck.shares} />
          <span className="text-tolopea dark:text-white"> {liveLikes}</span>
          <FavoriteToggler
            itemId={deck.id}
            isFavorite={liked}
            itemType={"public"}
            toggleFunction={likeDeck}
          />
        </div>{" "}
      </>
    </>
  );
};

export { PublicFooter };
