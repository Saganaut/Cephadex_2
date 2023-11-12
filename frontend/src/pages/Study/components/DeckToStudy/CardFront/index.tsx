import { type Card } from "@customTypes/Deck";
import React from "react";
import { twMerge } from "tailwind-merge";

interface CardFrontProps {
  cardsHistory: Card[];
  activeCard: any;
  swiperRef: any;
}
const CardFront: React.FC<CardFrontProps> = ({
  cardsHistory,
  activeCard,
  swiperRef,
}) => {
  return (
    <div
      className={
        "custom-scrollbar h-full max-h-[500px]  w-[20%] overflow-y-scroll rounded-[18px] bg-tolopea p-2"
      }
    >
      {cardsHistory.map((card, index) => (
        <div
          onClick={() => swiperRef.current?.slideTo(index)}
          key={index}
          className={twMerge(
            `${
              card.id === activeCard?.id
                ? "opacity-100 py-2"
                : "opacity-50 py-[4px]"
            }`,
            "mb-2 w-full cursor-pointer rounded-[15px] bg-electric-violet px-4 transition-all ease-linear duration-300"
          )}
        >
          <h1
            className={twMerge(
              `${
                card.id === activeCard?.id
                  ? "text-[20px] font-semibold"
                  : "text-[14px] font-normal whitespace-nowrap overflow-hidden text-ellipsis "
              }`,
              "transition-all ease-linear duration-300"
            )}
          >
            {card?.term}
          </h1>
        </div>
      ))}
    </div>
  );
};
export { CardFront };
