/** Definition (for study)
 *
 * This component is only used in the study feature
 *
 * TODO:
 * - Fix dependency array on useEffect
 *
 */

import type { StudyCardSchema } from "@source/client";
import FullMarkDown from "@source/common/FullMarkDown";
import { addAnswer } from "@store/answers/answersSlice";
import { useAppDispatch } from "@store/hooks";
import React, { useEffect } from "react";

import { IFlashcardAnswer } from "..";
import { BackCardDefinition } from "../components/BackCardDefinition";
import { FrontCardHeader } from "../components/FrontCardHeader";
import { GotIt } from "../components/GotIt";
import { LostIt } from "../components/LostIt";
import { ShowAnswer } from "../components/ShowAnswer";

interface DefinitionProps {
  card: StudyCardSchema;
  setFlashcardAnswer: React.Dispatch<React.SetStateAction<IFlashcardAnswer>>;
  deckId: string | undefined;
  activeCard: StudyCardSchema | null;
  flashcardAnswer: IFlashcardAnswer;
}
const Definition: React.FC<DefinitionProps> = ({
  card,
  setFlashcardAnswer,
  deckId,
  activeCard,
  flashcardAnswer,
}) => {
  const dispatch = useAppDispatch();

  const handleGotIt = (): void => {
    setFlashcardAnswer({
      ...flashcardAnswer,
      revealAnswer: true,
      answer: "correct",
      answerIsCorrect: "incr",
    });
    dispatch(
      addAnswer({
        cardId: card.id,
        deckId: parseInt(deckId ?? ""),
        action: "incr",
        uniqueId: card.uniqueId,
      })
    );
  };
  const handleLostIt = (): void => {
    setFlashcardAnswer({
      ...flashcardAnswer,
      revealAnswer: true,
      answer: "wrong",
      answerIsCorrect: "decr",
    });
    dispatch(
      addAnswer({
        cardId: card.id,
        deckId: parseInt(deckId ?? ""),
        action: "decr",
        uniqueId: card.uniqueId,
      })
    );
  };

  const getFontSize = (cardTerm: string): string => {
    if (cardTerm.length > 100) {
      return "text-sm";
    } else if (cardTerm.length > 50) {
      return "text-md";
    } else if (cardTerm.length > 30) {
      return "text-xl";
    } else if (cardTerm.length > 15) {
      return "text-2xl";
    } else {
      return "text-3xl";
    }
  };
  //TODO: Add misisng depdenencies (carefully!)
  useEffect(() => {
    const keyboardHandler = (event: KeyboardEvent): void => {
      if (card.uniqueId !== activeCard?.uniqueId) return;
      const key = event.key;
      if (event.target instanceof Element) {
        switch (key) {
          case "ArrowUp":
            handleGotIt();
            break;
          case "ArrowDown":
            handleLostIt();
            break;
          default:
            break;
        }
      }
    };
    window.document.addEventListener("keydown", keyboardHandler);
    return () => {
      window.document.removeEventListener("keydown", keyboardHandler);
    };
  }, [activeCard]); // Empty dependency array means this effect runs once when the component mounts
  return (
    <div
      className={
        "flex h-full flex-col items-center  overflow-auto px-2 focus:outline-none md:px-0 lg:flex-row lg:justify-center"
      }>
      <div
        className={`duration-400 absolute inset-0 transition-opacity ${
          flashcardAnswer.revealAnswer
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}>
        {" "}
        <FrontCardHeader text={card.term} type='study' />
        <h2 className='flex w-full items-center justify-center px-2 md:py-4'>
          {card.content != null && <BackCardDefinition text={card.content} />}
        </h2>
      </div>

      <div
        className={`${getFontSize(card.term)} ${!flashcardAnswer.revealAnswer ? "opacity-100" : "opacity-0"} absoltue duration 400 inset-0 inline-flex h-full flex-col items-center justify-center gap-y-[28px] text-3xl transition-opacity `}>
        <h2>
          {" "}
          <FullMarkDown inline={false} content={card.term} />
        </h2>
        <div className={" flex w-full justify-between gap-x-[20px]"}>
          <LostIt onClick={handleLostIt} />
          <GotIt onClick={handleGotIt} />
        </div>
        <ShowAnswer
          onClick={() => {
            setFlashcardAnswer({ ...flashcardAnswer, revealAnswer: true });
          }}
        />
      </div>
    </div>
  );
};
export { Definition };
