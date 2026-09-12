import {
  type DeckSchema,
  type GroupSchema,
  type QuizSchema,
} from "@source/client";
import { FavoriteToggler } from "@source/common/Favorite";
import { formatDate } from "@source/lib/utils/functions";
import React from "react";

interface FooterProps {
  data: DeckSchema | QuizSchema | GroupSchema;
  style?: string;
}
const Footer: React.FC<FooterProps> = ({ data, style }) => {
  return (
    <>
      <div className="mt-4 flex justify-between">
        <p className="text-xs text-tolopea dark:text-aquamarine">
          {formatDate(data.timeCreated)}
        </p>
        {data.type === "Deck" && (
          <FavoriteToggler
            itemId={data.id}
            isFavorite={data.fav}
            itemType={data.type}
          />
        )}
      </div>
    </>
  );
};

export { Footer };
