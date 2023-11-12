import { CheckIcon } from "@heroicons/react/20/solid";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React from "react";

interface ControlButtonsProps {
  handleDefinitionCardUpdate: (gotIt: boolean) => void;
  currentCardState: boolean | null;
  currentCardShow: boolean;
  activeCard: any;
  deckCards: any;
  swiperRef: any;
}
const ControlButtons: React.FC<ControlButtonsProps> = ({
  currentCardState,

  currentCardShow,
  deckCards,
  handleDefinitionCardUpdate,
  activeCard,
  swiperRef,
}) => {
  return (
    <div className={"flex w-full items-center justify-around"}>
      {/* navigation */}

      {/* Message */}
      <div
        className={`${
          currentCardState !== null ? "opacity-100" : "opacity-0"
        }  flex h-full w-[30%] items-center justify-center rounded-full  bg-electric-violet`}
      >
        {currentCardState === true && <h1>Wow! You are a smart octopus.</h1>}
        {currentCardState === false && <h1>Oops! You need to study more.</h1>}
      </div>

      {/* Navigation */}
      <div
        className={
          "flex h-[35px] w-[20%] items-center justify-between  rounded-full bg-mariana-blue"
        }
      >
        <div
          className={
            "flex h-full items-center rounded-[100%_0_100%_100%] bg-[#4E26A5] px-2 "
          }
        >
          <button
            onClick={() => {
              swiperRef?.current?.slidePrev();
            }}
          >
            <ArrowSmallLeftIcon
              className={"h-[25px] w-[25px] text-aquamarine"}
            />
          </button>
        </div>
        <h1>
          {activeCard?.id} | {deckCards?.deckCards?.cards.length}
        </h1>
        <div
          className={
            "flex h-full items-center rounded-[0_100%_100%_100%] bg-[#4E26A5] px-2 "
          }
        >
          <button
            onClick={() => {
              swiperRef?.current?.slideNext();
            }}
          >
            <ArrowSmallRightIcon
              className={"h-[25px] w-[25px] text-aquamarine"}
            />
          </button>
        </div>
      </div>

      {/* Lost it/Got it */}

      <div
        className={`${
          activeCard?.category !== "Mcq" && currentCardShow
            ? "opacity-100"
            : "opacity-0"
        } flex w-[30%] justify-between gap-x-[20px]`}
      >
        <button
          onClick={() => {
            handleDefinitionCardUpdate(false);
          }}
          className={
            "flex w-full items-center justify-between rounded-full border-2 border-aquamarine px-4 py-[4px] text-[18px]"
          }
        >
          <span>Lost it</span>

          <XMarkIcon className={"h-[24px] w-[24px] text-aquamarine"} />
        </button>
        <button
          onClick={() => {
            handleDefinitionCardUpdate(true);
          }}
          className={
            "flex w-full items-center justify-between rounded-full border-2 border-aquamarine bg-aquamarine px-4 py-[4px] text-[18px] text-mariana-blue"
          }
        >
          <span>Got it</span>

          <CheckIcon className={"h-[20px] w-[20px] text-mariana-blue"} />
        </button>
      </div>
    </div>
  );
};
export { ControlButtons };
