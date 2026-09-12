import QuizPoints from "@assets/quizIcons/QuizPoints.svg?react";
import QuizQuestionMark from "@assets/quizIcons/QuizQuestionMark.svg?react";
import React from "react";

interface DetailsProps {
  questionPoints: number | null | undefined;
  questionsNumber: number | undefined;
  activeIndex: number;
}
const Details: React.FC<DetailsProps> = ({
  questionsNumber,
  questionPoints,
  activeIndex,
}) => {
  return (
    <div
      className={
        "relative ml-auto mr-2 mt-2 flex h-full w-fit items-center justify-between gap-x-[20px] rounded-[14px] bg-electric-violet-200/50 p-2 pb-8 dark:bg-mariana-blue dark:text-white"
      }
    >
      {/* Questions */}
      <div className={"no-wrap flex items-center gap-2 text-center"}>
        <h1 className = "whitespace-nowrap">
          {" "}
          {activeIndex + 1} | {questionsNumber}
        </h1>
        <QuizQuestionMark className="h-[20px] " />
      </div>

      {/* Separator */}
      <span className={"block h-[50px] w-[2px] bg-electric-violet-200 "} />

      {/* Points */}
      <div className={"flex flex-nowrap items-center gap-2 text-center"}>
        <h1>{questionPoints}</h1>
        <QuizPoints stroke="blaze-orange" className="h-[20px]" />
      </div>
      {/*   Progress Bar */}
      <div
        className={
          "absolute bottom-[10px] left-[50%] mx-auto h-[10px] w-[90%] -translate-x-1/2 rounded-full bg-electric-violet-200"
        }
      >
        <div
          style={{
            width: `${((activeIndex + 1) / (questionsNumber ?? 0)) * 100}%`,
          }}
          className={
            "h-full rounded-full bg-electric-violet transition-all duration-75 ease-linear dark:bg-aquamarine"
          }
        />
      </div>
      {/*    */}
    </div>
  );
};
export { Details };
