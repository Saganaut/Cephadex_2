import { Card } from "@app/Shared/Card";
import { type Card as CardType } from "@source/types/Globals";
import React from "react";

interface CardDefaultProps {
  data: CardType;
}
const CardDefault: React.FC<CardDefaultProps> = ({ data }) => {
  return (
    <>
      <Card>
        <div className="h-full w-full rounded-3xl bg-mariana-blue p-4 hover:bg-tolopea">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg">{data.name}</h1>
            <div>...</div>
          </div>
          <div className="mb-4 flex items-center">
            <div className="mr-4">
              <svg
                className="h-10 w-10 text-purple-400" /* Add the SVG path for the "Deck" icon here */
              ></svg>
            </div>
            <h2 className="text-xl font-medium">{data.type}</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm">Decks: 2</h3>
              <h3 className="text-sm">New cards: 84</h3>
              <h3 className="text-sm">Cards: 84</h3>
            </div>
            <div>
              <h3 className="text-sm">Cards mastered: 0</h3>
              <h3 className="text-sm">Cards: 84</h3>
            </div>
            <div>
              <h3 className="text-sm">New cards: 84</h3>
            </div>
          </div>
          <p className="mt-4 text-sm">Updated 2 days ago</p>
        </div>
      </Card>
    </>
  );
};

export { CardDefault };
