/** History of cards studied in session
 *
 * This displays a list of all cards studied
 * Only visible on large screens
 * On large screens it is also where the question is displayed
 *
 * TODO:
 * - Reverse order of queue, so that newer cards are stacked on top.
 * Need to do so without reversing the array every render.
 * -
 *
 * **/

import type { StudyCardSchema } from "@source/client";
import FullMarkDown from "@source/common/FullMarkDown";
import { truncate } from "@utils/functions";
import React, { useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper/types";
import { twMerge } from "tailwind-merge";

interface CardFrontProps {
  cardsHistory: StudyCardSchema[] | undefined;
  swiperRef: React.MutableRefObject<SwiperType | null>;
  activeIndex: number;
}
const CardFront: React.FC<CardFrontProps> = ({
  cardsHistory,
  swiperRef,
  activeIndex,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToCardInHistorySidebar = (index: number): void => {
    const cardId = `card-${index}`;
    const cardElement = document.getElementById(cardId);

    if (cardElement != null && containerRef.current != null) {
      const containerOffsetTop = containerRef.current.offsetTop;
      const cardOffsetTop = cardElement.offsetTop;
      containerRef.current.scrollTop = cardOffsetTop - containerOffsetTop;
    }
  };
  const getFontSize = (cardTerm: string): string => {
    if (cardTerm.length > 100) {
      return "text-sm";
    } else if (cardTerm.length > 50) {
      return "text-md";
    } else if (cardTerm.length > 30) {
      return "text-xl";
    } else {
      return "text-2xl";
    }
  };

  useEffect(() => {
    scrollToCardInHistorySidebar(activeIndex - 1);
  }, [activeIndex]);
  return (
    <div
      id='study-card-history'
      ref={containerRef}
      className={
        "custom-scrollbar hidden h-full max-h-[520px] w-1/5  overflow-hidden rounded-[18px]  bg-black-white p-2 hover:overflow-y-scroll dark:bg-tolopea lg:block"
      }>
      {cardsHistory?.map((card, index) => (
        <div
          id={`card-${index}`}
          onClick={() => {
            scrollToCardInHistorySidebar(index);
            swiperRef.current?.slideTo(index);
          }}
          key={index}
          className={twMerge(
            `${
              activeIndex === index ? "opacity-100 py-2" : "opacity-50 py-[4px]"
            }`,
            "mb-2 w-full cursor-pointer rounded-[15px_15px_0px_15px] dark:bg-electric-violet bg-electric-violet-200 px-4 transition-all ease-linear duration-75"
          )}>
          <div
            className={twMerge(
              `${
                activeIndex === index
                  ? `${getFontSize(card.term)} font-semibold`
                  : "text-[14px] font-normal whitespace-nowrap overflow-hidden text-ellipsis "
              }`,
              "transition-all dark:text-white text-tolopea ease-linear "
            )}>
            {card != null && (
              <FullMarkDown
                content={
                  card?.term.length > 100
                    ? truncate(card?.term ?? "", 50)
                    : card?.term
                }
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export { CardFront };
