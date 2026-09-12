import { ArrowUpCircleIcon } from "@heroicons/react/20/solid";
import type { McqAnswer } from "@source/client";
import { IconButton } from "@source/common/Buttons/IconButton";
import { McqOption } from "@source/common/Questions/Mcq/McqOption";
import { shuffleArray } from "@source/lib/utils/functions";
import type { IGameRounds } from "@source/types";
import { ErrorMessage } from "formik";
import React, { type SetStateAction, useEffect, useState } from "react";
interface McqAnswerInputProps {
  currentRound: IGameRounds;
  canAnswer: boolean;
  username: string;
  answer: string;
  handleSubmitAnswer: (endAnswers: boolean) => void;

  setAnswer: React.Dispatch<React.SetStateAction<string>>;
}

const McqAnswerInput: React.FC<McqAnswerInputProps> = ({
  currentRound,
  canAnswer,
  username,
  answer,
  handleSubmitAnswer,
  setAnswer,
}) => {
  const [shuffledValues, setShuffledValues] = useState<
    Array<string | null | undefined>
  >([]);

  const correctOption = isMcqAnswer(currentRound.question.answer)
    ? currentRound.question.answer.correctOption
    : "";

  useEffect(() => {
    if (isMcqAnswer(currentRound.question.answer)) {
      const options: string[] = currentRound.question.answer.options;
      setShuffledValues(shuffleArray(options));
    }
  }, [currentRound.question]);

  const handleClick = (
    value: string,
    setAnswer: React.Dispatch<SetStateAction<string>>
  ): void => {
    if (!canAnswer) return;
    setAnswer(value);
  };

  if (correctOption === "") {
    return <ErrorMessage name='answer' component='div' />;
  }

  return (
    <div className=' z-[5] min-h-screen w-full '>
      <div className=' grid gap-4 py-2 md:grid-cols-2'>
        {shuffledValues.map((value, index) => (
          <McqOption
            key={index}
            index={index}
            answerGiven={answer}
            correctAnswer={correctOption}
            mcqOptionText={value ?? "No option provided"}
            handleClick={handleClick}
            setAnswer={setAnswer}
            isAnswered={false}
            type='game'
          />
        ))}
      </div>
      <IconButton
        disabled={!canAnswer}
        icon={<ArrowUpCircleIcon />}
        onClick={() => {
          handleSubmitAnswer(false);
        }}
        ariaLabel={"Submit answer"}
        to={""}
        classname={"flex-row-reverse mx-auto w-fit"}
        theme={"orange"}
        collapse={false}
      />
    </div>
  );
};

export { McqAnswerInput };

function isMcqAnswer(answer: unknown): answer is McqAnswer {
  if (typeof answer === "object" && answer !== null) {
    const potentialAnswer = answer as Partial<McqAnswer>;
    if (
      Array.isArray(potentialAnswer.options) &&
      Boolean(
        potentialAnswer.options.every((option) => typeof option === "string")
      )
    ) {
      if (typeof potentialAnswer.correctOption === "string") {
        return true;
      }
    }
  }
  return false;
}
