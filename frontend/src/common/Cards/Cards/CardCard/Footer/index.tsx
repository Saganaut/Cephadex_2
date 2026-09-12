import { type CardSchema } from "@source/client";
import { FavoriteToggler } from "@source/common/Favorite";
import React from "react";

const daysUntilNextReview = (card: CardSchema): number => {
  const now = new Date();
  const lastUpdate = new Date(card.timeUpdated ?? "");
  const diff = Math.abs(now.getTime() - lastUpdate.getTime());
  const diffMinutes = Math.ceil(diff / (1000 * 60));
  const daysUntilNextReview = (card.srsInterval - diffMinutes) / 1440;
  const roundedDays = Math.round(daysUntilNextReview);
  if (roundedDays < 0) {
    return 0;
  }
  return roundedDays;
};

const timeSinceLastReview = (card: CardSchema): string => {
  const now = new Date();
  const lastUpdate = new Date(card.timeUpdated ?? "");
  const diff = Math.abs(now.getTime() - lastUpdate.getTime());
  const diffMinutes = Math.ceil(diff / (1000 * 60));
  if (diffMinutes < 2) {
    return `${diffMinutes} min`;
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} mins`;
  }
  if (diffMinutes < 60 * 2) {
    return `1 hour`;
  }
  if (diffMinutes < 60 * 24) {
    return `${Math.floor(diffMinutes / 60)} hours`;
  }
  if (diffMinutes < 60 * 24 * 2) {
    return `1 day`;
  }
  return `${Math.floor(diffMinutes / 1440)} days`;
};

interface FooterProps {
  card: CardSchema;
}
const Footer: React.FC<FooterProps> = ({ card }) => {
  const daysLeft = daysUntilNextReview(card);

  return (
    <>
      <div
        className={`${
          daysLeft === 0 ? "text-blaze-orange" : "text-aquamarine"
        } rounded-full bg-electric-violet px-4 py-1 text-sm font-medium text-white dark:bg-mariana-blue-100`}
      >
        {card.boxId === 3 ? "Mastered" : card.bocId === 1 ? "New" : "Learning"}
      </div>
      <div className="flex items-end ">
        <span
          className={
            "block px-2 text-right text-[12px] text-tolopea dark:text-aquamarine"
          }
        >
          {timeSinceLastReview(card)} ago
        </span>
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <FavoriteToggler
            itemId={card.id}
            isFavorite={card.fav}
            itemType={"card"}
          />
        </div>
      </div>
    </>
  );
};

export { Footer };
