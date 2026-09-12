/** Flashcards used in Study
 * They load either regular (definition) type cards, or MCQ
 *
 * TODO:
 * - Consolidate useStates for answer and setAnswer
 * - Move it all to one setter that contains the complete response object
 * - And includes, easy, hard, incr, decr
 * **/

import type { StudyCardSchema } from "@source/client";
import { Loading } from "@source/common/InfoComponents/Loading";
import { ControlButtons } from "@study/components/DeckToStudy/ControlButtons";
import React, { useEffect, useState } from "react";

import { Definition } from "./Definition";
import { MCQ } from "./MCQ";

export type TFlashcardLevel = "incr" | "decr" | "easy" | "hard" | "skip";

export interface IFlashcardAnswer {
  revealAnswer: boolean;
  answer: string | null; // if answer is null, then question has not been answered yet
  answerIsCorrect: TFlashcardLevel | null;
}

interface FlashCardProps {
  card: StudyCardSchema;
  isLoading: boolean;
  isPrev: boolean;
  deckId: string | undefined;
  activeCard: StudyCardSchema | null;
}
const Flashcard: React.FC<FlashCardProps> = ({
  card,
  deckId,
  isPrev,
  isLoading,
  activeCard,
}) => {
  const [flashcardAnswer, setFlashcardAnswer] = useState<IFlashcardAnswer>({
    revealAnswer: false, // SHould we reveal the answer
    answer: null, // what is the answer
    answerIsCorrect: null, // How well does the user know the answer, did they get it correct or wrong or mark it easy or hard
  });

  useEffect(() => {
    if (isPrev && flashcardAnswer.answer !== null) {
      setFlashcardAnswer({ ...flashcardAnswer, answerIsCorrect: "skip" });
    }
  }, [flashcardAnswer.answer, flashcardAnswer, isPrev]);

  return (
    <div
      className={
        "flex size-full flex-col justify-between text-tolopea dark:text-white "
      }>
      {isLoading ? (
        <>
          <Loading />{" "}
        </>
      ) : (
        <div className=' mb-2 size-full overflow-auto'>
          {card.category === "Mcq" ? (
            <MCQ
              card={card}
              content={card.content}
              boc2={card.boc2}
              flashcardAnswer={flashcardAnswer}
              setFlashcardAnswer={setFlashcardAnswer}
              boc3={card.boc3}
              boc4={card.boc4}
              activeCard={activeCard}
            />
          ) : (
            <Definition
              activeCard={activeCard}
              deckId={deckId}
              card={card}
              flashcardAnswer={flashcardAnswer}
              setFlashcardAnswer={setFlashcardAnswer}
            />
          )}
        </div>
      )}

      <ControlButtons
        setFlashcardAnswer={setFlashcardAnswer}
        flashcardAnswer={flashcardAnswer}
        activeCard={card}
      />
    </div>
  );
};

export default React.memo(Flashcard);
