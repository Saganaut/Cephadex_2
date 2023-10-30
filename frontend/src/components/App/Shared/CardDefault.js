import React from "react";
import { Card } from "components/App/Shared/Card";

const CardDefault = ({data}) => {
  return (
    <>
      <Card>
        <div className="bg-mariana-blue rounded-3xl h-full w-full p-4 hover:bg-color-2">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg">{data.name}</h1>
            <div>...</div>
          </div>
          <div className="flex items-center mb-4">
            <div className="mr-4">
              <svg
                className="w-10 h-10 text-purple-400" /* Add the SVG path for the "Deck" icon here */
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
          <p className="text-sm mt-4">Updated 2 days ago</p>
        </div>
      </Card>
    </>
  );
};

export { CardDefault };
