/** MCQ display component (study)
 * This is only used in study BUT the MCQOption is used in other sections (game, quiz)
 *
 *
 * TODO:
 * - Continue refactoring MCQOption
 *  **/

import type { StudyCardSchema } from "@source/client";
import { useAppDispatch } from "@source/lib/store/hooks";
import { addAnswer } from "@store/answers/answersSlice";
import { shuffleArray } from "@utils/functions";
import React, { type SetStateAction, useEffect, useState } from "react";

import { McqOption } from "../../../../../../common/Questions/Mcq/McqOption";
import { IFlashcardAnswer } from "..";
import { FrontCardHeader } from "../components/FrontCardHeader";

interface MCQProps {
  content?: string | null;
  boc2?: string | null | undefined;
  boc3?: string | null | undefined;
  boc4?: string | null | undefined;
  flashcardAnswer: IFlashcardAnswer;
  setFlashcardAnswer: React.Dispatch<SetStateAction<IFlashcardAnswer>>;
  card: StudyCardSchema;
  activeCard: StudyCardSchema | null;
}
const MCQ: React.FC<MCQProps> = ({
  flashcardAnswer,
  boc3,
  boc4,
  boc2,
  content,
  setFlashcardAnswer,
  card,
  activeCard,
}) => {
  const [shuffledValues, setShuffledValues] = useState<
    Array<string | null | undefined>
  >([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const valuesToShuffle = [content, boc2, boc3, boc4];
    setShuffledValues(shuffleArray(valuesToShuffle));
  }, [activeCard, boc2, boc3, boc4, content]);

  const handleClick = (
    value: string,
    setMCQAnswer: React.Dispatch<SetStateAction<string>>
  ): void => {
    if (card.deckId == null) return;
    setMCQAnswer(value);
    const isCorrect = value === content;

    if (isCorrect) {
      dispatch(
        addAnswer({
          deckId: card.deckId,
          cardId: card.id,
          action: "incr",
          uniqueId: card.uniqueId,
        })
      );
    }
    if (!isCorrect) {
      dispatch(
        addAnswer({
          deckId: card.deckId,
          cardId: card.id,
          action: "decr",
          uniqueId: card.uniqueId,
        })
      );
    }
  };

  const setAnswer = (newAnswer: string) => {
    const isCorrect = newAnswer === content ? "incr" : "decr";
    setFlashcardAnswer({
      ...flashcardAnswer,
      answer: newAnswer,
      answerIsCorrect: isCorrect,
    });
  };

  return (
    <div
      className={"flex h-full flex-col items-center justify-start py-[20px] "}>
      <FrontCardHeader text={card.term} />

      <ul className={"flex w-full flex-col p-2 lg:h-full lg:justify-between"}>
        {shuffledValues.map((value, index) => (
          <div key={index}>
            <McqOption
              index={index}
              answerGiven={flashcardAnswer.answer}
              correctAnswer={content}
              mcqOptionText={value ?? "No content"}
              handleClick={handleClick}
              setAnswer={setAnswer}
              isAnswered={false}
              type='study'
            />
          </div>
        ))}
      </ul>
    </div>
  );
};
export { MCQ };
