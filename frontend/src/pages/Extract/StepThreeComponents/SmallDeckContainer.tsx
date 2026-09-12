import { type DeckSchema } from "@source/client";
import { DeckCard } from "@source/common/Cards/Decks/DeckCard";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface SmallDeckContainerProps {
  decks: DeckSchema[];
}

const SmallDeckContainer: React.FC<SmallDeckContainerProps> = ({ decks }) => {
  const [sortedDecks, setSortedDecks] = useState<DeckSchema[]>([]);

  useEffect(() => {
    if (decks.length > 0) {
      const sorted = [...decks].sort((a, b) => {
        const dateA = new Date(a.timeCreated?.replace(" ", "T") ?? "");
        const dateB = new Date(b.timeCreated?.replace(" ", "T") ?? "");
        return dateB.getTime() - dateA.getTime();
      });
      setSortedDecks(sorted);
    }
  }, [decks]);

  return (
    <>
      {" "}
      <div className="flex flex-wrap ">
        {sortedDecks.slice(0, 3).map((deck, index) => (
          <div
            key={index}
            className="mx-auto mb-8 max-w-md  px-2 sm:w-full md:w-1/2 lg:w-1/3 lg:max-w-none"
          >
            <Link to={`/study/deck/${deck.id}`}>
              <DeckCard deck={deck} type="simple" />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export { SmallDeckContainer };
