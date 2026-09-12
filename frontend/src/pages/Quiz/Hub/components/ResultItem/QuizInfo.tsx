import { type QuizSchema, type QuizSharingFullSchema } from "@source/client";
import React from "react";

interface QuizInfoProps {
  quizDetails: QuizSchema | null;
  sharedQuiz: QuizSharingFullSchema | null;
}
const QuizInfo: React.FC<QuizInfoProps> = ({ quizDetails, sharedQuiz }) => {
  return (
    <div>
      <h1 className="pb-[16px] sm:text-[28px] text-[18px] font-bold">
        {quizDetails?.name ?? sharedQuiz?.quiz?.name}
      </h1>

      <div className="flex flex-wrap gap-1">
        {quizDetails?.subject != null && (
          <p className="rounded-xl border-[1px] border-white px-2 text-[14px] font-medium">
            {quizDetails?.subject}
          </p>
        )}
        {quizDetails?.topic != null && (
          <p className="rounded-xl border-[1px] border-white px-2 text-[14px] font-medium">
            {quizDetails?.topic}
          </p>
        )}
      </div>
      {quizDetails?.description != null && (
        <p className="p-2 text-[14px] font-medium">
          {quizDetails?.description}
        </p>
      )}

      <p className="p-2 text-[14px] font-medium">
        {quizDetails?.instructions ??
          "No instructions were provided for this quiz."}
      </p>
    </div>
  );
};

export { QuizInfo };
