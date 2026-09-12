import FullMarkDown from "@source/common/FullMarkDown";
import { ExpandContentModal } from "@source/common/Modals/ExpandContentModal/ExpandContentModal";
import { ModalWrapper } from "@source/common/Modals/ModalWrapper";
import { truncate } from "@source/lib/utils/functions";
import React, { type SetStateAction, useState } from "react";
import { twMerge } from "tailwind-merge";

type TwoArgFunction = (
  value: string,
  setAnswer: React.Dispatch<SetStateAction<string>>
) => void;

type SingleArgFunction = (mcqOptionText: string) => void;

interface McqOptionProps {
  index: number;
  answerGiven: string | null | undefined | boolean;
  mcqOptionText: string;
  setAnswer?: React.Dispatch<SetStateAction<string>>;
  correctAnswer: string | null | undefined;
  handleClick?: TwoArgFunction | SingleArgFunction;
  isAnswered: boolean;
  type: "quiz" | "study" | "game" | "card-modal";
}
const McqOption: React.FC<McqOptionProps> = ({
  index,
  answerGiven,
  correctAnswer,
  mcqOptionText,
  handleClick,
  setAnswer,
  isAnswered,
  type,
}) => {
  const [expandAnswer, setExpandAnswer] = useState(false);
  const [answerToExpand, setAnswerToExpand] = useState("");
  const QTY_CHARACTERS_BEFORE_TRUNCATION = 100;

  const studyClass = twMerge(
    " relative line-clamp-3 max-h-[100px] mb-2 overflow-hidden cursor-pointer z-10 select-none text-ellipsis  rounded-2xl border-2 px-4 py-[12px]  text-[18px] transition-all  duration-300 ease-in-out ",
    answerGiven != null && correctAnswer === mcqOptionText
      ? "border-electric-violet dark:bg-electric-violet bg-aquamarine-900 "
      : answerGiven != null && correctAnswer !== mcqOptionText
        ? "dark:border-mariana-blue/50 bg-mariana-blue/50 dark:text-aquamarine/20 "
        : "dark:border-aquamarine-100/20 border-mariana-blue-100/40 dark:text-white ",
    isAnswered
      ? ""
      : "  hover:bg-aquamarine-100 hover:dark:bg-electric-violet-900",
    answerGiven === mcqOptionText
      ? "dark:border-aquamarine  border-blaze-orange text-tolopea dark:text-aquamarine"
      : ""
  );

  const quizClass = twMerge(
    `mb-[32px]  relative line-clamp-3 cursor-pointer select-none text-ellipsis sm:rounded-full rounded-xl border-2 dark:border-aquamarine border-tolopea bg-transparent px-4 py-[12px] text-center text-[18px]  dark:text-white text-tolopea transition-all duration-300 ease-in-out hover:line-clamp-none hover:max-h-[500px] hover:border-mariana-blue hover:bg-mariana-blue hover:text-white`,
    answerGiven !== ""
      ? answerGiven === mcqOptionText
        ? "bg-electric-violet border-electric-violet text-white"
        : "opacity-50"
      : ""
  );
  const gameClass = twMerge(
    " relative line-clamp-3 mb-2 h-full max-h-[100px] w-full cursor-pointer z-10 select-none text-ellipsis md:rounded-xl rounded-xl border-2 px-4 py-[12px]  text-[18px] transition-all  duration-300 ease-in-out ",
    answerGiven === mcqOptionText
      ? "dark:border-aquamarine  border-blaze-orange text-tolopea dark:text-aquamarine"
      : ""
  );

  const classToUse =
    type === "quiz" ? quizClass : type === "study" ? studyClass : gameClass;
  //TODO: Figure out why this type never issue comes up, only an issue for quiz
  const onClickToUse = (): void => {
    if (handleClick === undefined) return;
    if (setAnswer === undefined) return;
    if (type === "quiz" || type === "game") {
      setAnswer(mcqOptionText);
      if (!isTwoArgFunction(handleClick) && type === "quiz")
        handleClick(mcqOptionText);
    } else {
      if (isTwoArgFunction(handleClick)) handleClick(mcqOptionText, setAnswer);
    }
  };

  return (
    <>
      <li
        key={index}
        className={classToUse}
        onClick={() => {
          onClickToUse();
        }}>
        <div className='pr-[28px]'>
          {mcqOptionText != null && (
            <FullMarkDown
              content={truncate(
                mcqOptionText,
                QTY_CHARACTERS_BEFORE_TRUNCATION
              )}
            />
          )}
        </div>

        <span
          onClick={(e) => {
            e.stopPropagation();
            setExpandAnswer(true);
            setAnswerToExpand(mcqOptionText);
          }}
          className={
            "absolute right-[10px] top-1/2 z-[99999] flex size-[30px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-aquamarine-900/40 text-xl text-tolopea hover:bg-aquamarine-900"
          }>
          +
        </span>
      </li>
      <ModalWrapper isOpen={expandAnswer} setIsOpen={setExpandAnswer}>
        <div className={"flex flex-col items-center justify-center p-[40px]"}>
          <div className={"text-xl dark:text-white"}>
            <FullMarkDown content={answerToExpand} />
          </div>
        </div>
      </ModalWrapper>
      <ExpandContentModal
        isOpen={expandAnswer}
        setIsOpen={setExpandAnswer}
        content={answerToExpand}
      />
    </>
  );
};

function isTwoArgFunction(
  func: TwoArgFunction | SingleArgFunction
): func is TwoArgFunction {
  return func.length === 2;
}
export { McqOption };
