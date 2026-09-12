import { DeckService, type PublicDeckSchema } from "@source/client";
import { FavoriteToggler } from "@source/common/Favorite";
import React, { useState } from "react";

import { DeckShares } from "../components/DeckShares";

interface PublicFooterProps {
  deck: PublicDeckSchema;
}

const PublicFooter: React.FC<PublicFooterProps> = ({ deck }) => {
  const [liveLikes, setLiveLikes] = useState(deck.likes);
  const [liked, setLiked] = useState(deck.liked);

  const likeDeck = async () => {
    const response = await DeckService.toggleLikeDeck(deck.id);
    if (response.liked) {
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
        <div
          className={
            "rounded-full bg-mariana-blue-100 px-4 py-1 text-sm font-medium text-white"
          }
        >
          {deck?.qtyCards ?? 0} Cards
        </div>
        <div className="flex items-end ">
          <span
            className={"block px-2 text-right text-[12px] text-aquamarine"}
          ></span>
          <DeckShares shares={deck.shares} />

          <FavoriteToggler
            itemId={deck.id}
            isFavorite={liked}
            itemType={"public"}
            toggleFunction={likeDeck}
          />
          <span className="text-aquamarine"> {liveLikes}</span>
        </div>{" "}
      </>
    </>
  );
};

export { PublicFooter };
