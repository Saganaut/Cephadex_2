import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { type QuestionResultSchema } from "@source/client";
import React, { useEffect, useState } from "react";

interface AnswerProps {
  correct: boolean | undefined;
  term: string;
  points: number;
  yourAnswer: string | null | undefined;
  correctAnswer: string;
  collapse: boolean;
  assignedPoints: number | undefined;
  setGradedQuestions: React.Dispatch<
    React.SetStateAction<QuestionResultSchema[]>
  >;
  gradedQuestions: Array<QuestionResultSchema | null> | undefined;
  id: number;
}
const Answer: React.FC<AnswerProps> = ({
  points,
  id,
  term,
  correct,
  yourAnswer,
  correctAnswer,
  collapse,
  assignedPoints,
  setGradedQuestions,
  gradedQuestions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPoints, setNewPoints] = useState<number>(points);
  useEffect(() => {
    if (!collapse) {
      setIsOpen(true);
    }
    if (collapse) {
      setIsOpen(false);
    }
  }, [collapse]);

  const handleQuestionUpdate = (questionId: number): void => {
    const updatedQuestions = gradedQuestions?.map((q) => {
      if (q?.questionId === questionId) {
        return {
          ...q,
          points: newPoints,
          correct: assignedPoints != null ? newPoints >= assignedPoints : false,
        };
      } else {
        return q;
      }
    });
    if (updatedQuestions != null)
      setGradedQuestions(
        updatedQuestions.filter((q) => q !== null) as QuestionResultSchema[]
      );
  };

  useEffect(() => {
    handleQuestionUpdate(id);
  }, [newPoints]);
  // TODO - answer and single answer components are similar, consider refactoring them
  return (
    <div
      className={
        "mt-[20px] w-full rounded-[10px] bg-electric-violet-200 px-[25px] py-[12px] dark:bg-mariana-blue sm:rounded-[20px]"
      }
    >
      <div className={"flex items-center gap-x-[15px]"}>
        <ChevronDownIcon
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={`${
            isOpen ? "" : "-rotate-90"
          }  h-[28px] w-[28px] cursor-pointer text-tolopea dark:text-white`}
        />
        <h1 className={"font-medium text-tolopea dark:text-white"}>{term}</h1>

        <div className={"ml-auto flex items-center gap-x-[10px]"}>
          <div
            className={
              "flex items-center overflow-hidden rounded-full border border-white"
            }
          >
            <input
              className="w-[40px] bg-transparent  pl-[20px] font-medium text-tolopea outline-none focus:outline-none dark:text-white"
              type="number"
              onChange={(e) => {
                setNewPoints(parseInt(e.currentTarget.value));
              }}
              min={0}
              max={assignedPoints}
              value={newPoints}
            />
            <span className="font-medium mr-1"> /{assignedPoints}</span>
            {/* <p className={"px-[10px] text-lg font-medium dark:text-white text-tolopea"}> */}
            {/*   {correct === true ? points : "0"} */}
            {/* </p> */}
            <div
              className={`m-[1px] flex h-[30px] w-[30px] items-center justify-center rounded-full ${
                correct === true ? "bg-blaze-orange" : "bg-white"
              } `}
            >
              {correct === true ? (
                <CheckIcon
                  className={`h-[18px] w-[18px] text-tolopea dark:text-white`}
                />
              ) : (
                <XMarkIcon className={`h-[18px] w-[18px] text-tolopea`} />
              )}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={"px-[40px] pt-4"}>
          {correct === true ? (
            <div
              className={
                "flex h-[28px] w-[28px] items-center justify-center rounded-full bg-blaze-orange "
              }
            >
              <CheckIcon
                className={"h-[18px] w-[18px] text-tolopea dark:text-white"}
              />
            </div>
          ) : (
            <div
              className={
                "flex w-fit items-center gap-x-[10px] rounded-full bg-aquamarine/30 p-2 text-tolopea dark:bg-tolopea dark:text-white"
              }
            >
              <div
                className={
                  "flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white "
                }
              >
                <XMarkIcon className={"h-[18px] w-[18px] text-tolopea"} />
              </div>
              <p className={"pr-2 font-medium"}>Student&apos;s answer :</p>
            </div>
          )}
          <p className={"pt-2 font-medium text-tolopea dark:text-white"}>
            {yourAnswer ?? "it was left blank!"}
          </p>

          {correct === false && (
            <div className={"pt-6"}>
              <div
                className={
                  "flex w-fit items-center gap-x-[10px] rounded-full bg-aquamarine/30 p-2 text-tolopea dark:bg-tolopea dark:text-white"
                }
              >
                <div
                  className={
                    "flex h-[28px] w-[28px] items-center justify-center rounded-full bg-blaze-orange "
                  }
                >
                  <CheckIcon
                    className={"h-[18px] w-[18px] text-tolopea dark:text-white"}
                  />
                </div>
                <p className={"pr-2 font-medium"}>Correct answer :</p>
              </div>

              <p className={"pt-2 font-medium text-tolopea dark:text-white"}>
                {correctAnswer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { Answer };
