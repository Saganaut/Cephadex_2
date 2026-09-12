import QuizIcon from "@assets/QuizIcon.svg?react";
import { type QuizSchema } from "@source/client";
import React from "react";

interface QuizItemProps {
  quiz: QuizSchema;
}
const QuizItem: React.FC<QuizItemProps> = ({ quiz }) => {
  return (
    <>
      <div className="flex max-w-[200px] items-center justify-start rounded-full p-1 sm:max-w-[400px]">
        <QuizIcon className="h-6 w-6" />
        <div className={"flex items-center"}>
          <h1
            className={
              " pl-[12px]  pr-[20px] text-xs sm:text-base  dark:hover:text-blaze-orange hover:text-mariana-blue"
            }
          >
            {quiz.name}
          </h1>
        </div>
      </div>
    </>
  );
};

export { QuizItem };
