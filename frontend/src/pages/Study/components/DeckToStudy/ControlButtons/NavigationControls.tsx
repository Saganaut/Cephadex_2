import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import type { Swiper as SwiperType } from "swiper/types";

interface NavigationControlsProps {
  currentIndex: number;
  swiperRef: SwiperType | null;
  totalCards: number | null;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  swiperRef,
  currentIndex,
  totalCards,
}) => {
  return (
    <div
      className={
        "bottom-5 left-[45%] z-50 mx-auto hidden h-[35px] items-center justify-between rounded-full bg-electric-violet-200 dark:bg-mariana-blue  dark:text-white lg:absolute lg:flex"
      }>
      <div
        className={
          "flex h-full  rounded-[100%_0_100%_100%] bg-electric-violet-900  px-2 dark:bg-[#4E26A5] "
        }>
        <button
          onClick={() => {
            swiperRef?.slidePrev();
          }}>
          <ArrowLeftIcon className={"size-[25px] text-aquamarine"} />
        </button>
      </div>

      {totalCards != null && totalCards > 0 ? (
        <h1 className='text-nowrap px-1'>
          {isNaN(currentIndex) ? 0 : currentIndex}| {totalCards}
        </h1>
      ) : (
        <h1>None</h1>
      )}
      <div
        className={
          "flex h-full items-center rounded-[0_100%_100%_100%] bg-electric-violet-900 px-2 dark:bg-[#4E26A5] "
        }>
        <button
          onClick={() => {
            swiperRef?.slideNext();
          }}>
          <ArrowRightIcon className={"size-[25px] text-aquamarine"} />
        </button>
      </div>
    </div>
  );
};
export { NavigationControls };
