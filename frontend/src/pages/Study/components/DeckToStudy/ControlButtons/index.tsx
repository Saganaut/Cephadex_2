/** Control buttons -
 * These are the buttons on the bottom of the flashcard
 * They are within the swiper, one instance per card
 * There is room left in the middle for hte buttons that allow to swipe through the cards
 * as this one SHOULD NOT BE in the swiper
 *
 * TODO:
 * - Should be able to remove isPassed, replace it with "skip" in flashcardAnswer.answerIsCorrect
 * **/

import { CheckIcon } from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  FireIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { StudyCardSchema } from "@source/client";
import { addAnswer } from "@store/answers/answersSlice";
import {
  removeOneCard,
  selectAllCardInstances,
} from "@store/cardInstances/cardInstancesSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import React from "react";
import { twMerge } from "tailwind-merge";

import { IFlashcardAnswer, TFlashcardLevel } from "../Flashcard";
import { messages } from "./messages";

interface ControlButtonsProps {
  activeCard: StudyCardSchema;
  setFlashcardAnswer: React.Dispatch<React.SetStateAction<IFlashcardAnswer>>;
  flashcardAnswer: IFlashcardAnswer;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  activeCard,
  setFlashcardAnswer,
  flashcardAnswer,
}) => {
  const dispatch = useAppDispatch();
  const allCardInstances = useAppSelector(selectAllCardInstances);

  const handleClick = (action: TFlashcardLevel): void => {
    setFlashcardAnswer({ ...flashcardAnswer, answerIsCorrect: action });
    if (action) {
      // If the user has answered easy, remove all instances of the card
      // so they don't study it again
      if (action === "easy") {
        allCardInstances.forEach((cardInstance) => {
          if (
            cardInstance.id === activeCard.id &&
            cardInstance.uniqueId !== activeCard.uniqueId
          ) {
            dispatch(removeOneCard(cardInstance));
          }
        });
      }
      if (activeCard.deckId == null) {
        return;
      }
      dispatch(
        addAnswer({
          deckId: activeCard.deckId,
          cardId: activeCard.id,
          action: action,
          uniqueId: activeCard.uniqueId,
        })
      );
    }
  };

  const getRandomMessage = (type: string | null): string => {
    if (type == null) return "";
    const filteredMessages = messages.filter(
      (message) => message.type === type
    );
    const randomIndex = Math.floor(Math.random() * filteredMessages.length);
    if (filteredMessages[randomIndex] == null) {
      return "Hard work pays off";
    }
    return filteredMessages[randomIndex].message;
  };
  return (
    <div
      className={
        "flex w-full flex-col items-end justify-center gap-2 lg:grid lg:grid-cols-3 lg:items-end lg:gap-2"
      }>
      {/* Message */}
      <div
        className={`${
          flashcardAnswer.answerIsCorrect !== null ? "opacity-100" : "opacity-0"
        }  flex w-full items-center justify-center rounded-full bg-aquamarine-900 px-[12px] py-[6px] text-center dark:bg-electric-violet md:mb-[20px] lg:relative lg:mb-0  lg:p-[4px]`}>
        <h1>{getRandomMessage(flashcardAnswer.answerIsCorrect)}</h1>
      </div>

      {/* Navigation */}
      <div className={"hidden h-[50px]  w-[15%] lg:block"}></div>

      {/* Control Buttons */}
      <div
        className={`${
          activeCard?.category !== "Mcq" && flashcardAnswer.revealAnswer
            ? "opacity-100"
            : "hidden opacity-0 lg:block lg:opacity-0"
        } flex w-full flex-col gap-2 p-1 lg:gap-2 lg:p-0`}>
        {/* Top row - Normal buttons */}
        <div className='flex justify-between gap-x-[20px] lg:gap-x-[4px] xl:gap-x-[20px]'>
          <button
            onClick={() => {
              handleClick("decr");
            }}
            className={twMerge(
              "flex w-full items-center group transition-all ease-linear duration-100 justify-between rounded-full border-2 border-aquamarine px-4 py-[4px] text-[16px]",
              "hover:bg-electric-violet hover:text-white hover:border-electric-violet hover:scale-105 hover:opacity-100",
              flashcardAnswer.revealAnswer ? "opacity-100" : "opacity-50",
              flashcardAnswer.answerIsCorrect === "decr"
                ? "opacity-100"
                : "opacity-50"
            )}>
            <span className='whitespace-nowrap'>Lost it</span>
            <XMarkIcon
              className={"size-[20px] text-aquamarine group-hover:text-white"}
            />
          </button>
          <button
            onClick={() => {
              handleClick("incr");
            }}
            className={twMerge(
              "flex w-full items-center justify-between rounded-full border-2 border-aquamarine bg-aquamarine px-4 py-[4px] text-[16px] text-mariana-blue transition-all ease-linear duration-100",
              "hover:scale-105 hover:opacity-100",
              flashcardAnswer.revealAnswer ? "opacity-100" : "opacity-50",
              flashcardAnswer.answerIsCorrect === "incr"
                ? "opacity-100"
                : "opacity-50"
            )}>
            <span className='whitespace-nowrap'>Got it</span>
            <CheckIcon className={"size-[18px] text-mariana-blue"} />
          </button>
        </div>

        {/* Bottom row - Special buttons */}
        <div className='flex justify-between gap-x-[20px] lg:gap-x-[4px] xl:gap-x-[20px]'>
          <button
            onClick={() => {
              handleClick("hard");
            }}
            className={twMerge(
              "flex w-full items-center group transition-all ease-linear duration-100 justify-between rounded-full border-2 border-red-400 px-4 py-[4px] text-[16px] text-red-400",
              "hover:bg-red-400 hover:text-white hover:scale-105 hover:opacity-100",
              flashcardAnswer.revealAnswer ? "opacity-100" : "opacity-50",
              flashcardAnswer.answerIsCorrect === "hard"
                ? "opacity-100"
                : "opacity-50"
            )}>
            <span className='whitespace-nowrap'>Hard!</span>
            <ExclamationTriangleIcon
              className={"size-[18px] text-red-400 group-hover:text-white"}
            />
          </button>
          <button
            onClick={() => {
              handleClick("easy");
            }}
            className={twMerge(
              "flex w-full items-center justify-between rounded-full border-2 border-orange-400 bg-orange-400 px-4 py-[4px] text-[16px] text-white transition-all ease-linear duration-100",
              "hover:scale-105 hover:opacity-100",
              flashcardAnswer.revealAnswer ? "opacity-100" : "opacity-50",
              flashcardAnswer.answerIsCorrect === "easy"
                ? "opacity-100"
                : "opacity-50"
            )}>
            <span className='whitespace-nowrap'>Easy!</span>
            <FireIcon className={"size-[18px] text-white"} />
          </button>
        </div>
      </div>
    </div>
  );
};
export { ControlButtons };
