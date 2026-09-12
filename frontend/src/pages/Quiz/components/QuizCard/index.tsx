import { ModalWrapper } from "@common/Modals/ModalWrapper";
import type { QuestionSchema } from "@source/client";
import { McqOption } from "@source/common/Questions/Mcq/McqOption";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import { addAnswerToQuiz } from "@store/quizzes/quizzesSlice";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface QuizCardProps {
  question: QuestionSchema;
  quizId: string | undefined;
  setProxyDefAnswer?: React.Dispatch<React.SetStateAction<string>>;
  guestId?: number;
}
const QuizCard: React.FC<QuizCardProps> = ({
  question,
  setProxyDefAnswer,
  quizId,
  guestId,
}) => {
  //TODO: Why might setanswer ever
  const [answer, setAnswer] = useState<string>("");
  const [expandAnswer, setExpandAnswer] = useState(false);
  const [answerToExpand, setAnswerToExpand] = useState("");
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.user);

  const handleAddAnswer = (answer: string): void => {
    dispatch(
      addAnswerToQuiz({
        answer,
        testId: parseInt(quizId ?? ""),
        questionId: question.id ?? 0,
        taker: users?.user?.id ?? guestId ?? 0,
      })
    );
  };
  return (
    <div
      className='flex  h-full items-center justify-center'
      data-testid='take-quiz-card'>
      {question.qType === "Mcq" ? (
        //   For Multiple Choice Questions
        <ul className={"flex w-full flex-col justify-between"}>
          {Array.from([
            question.content,
            question.boc3,
            question.boc2,
            question.boc4,
          ])?.map((value, index) => (
            <McqOption
              key={index}
              index={index}
              answerGiven={answer}
              mcqOptionText={value ?? "Answer not provided"}
              setAnswer={setAnswer}
              correctAnswer={undefined}
              isAnswered={false}
              type={"quiz"}
              handleClick={handleAddAnswer}
            />
          ))}
        </ul>
      ) : (
        //   For Definition Questions
        //   TabIndex = -1 to disable moving between inputs with tab, it causes Swiper to crash.
        <div className='w-full   '>
          <TextareaAutosize
            tabIndex={-1}
            value={answer ?? "Answer not provided"}
            onChange={(e) => {
              setAnswer(e.target.value ?? "");
              setProxyDefAnswer?.(e.target.value ?? "");
            }}
            className={
              "size-full resize-none rounded-[18px] border-2 border-tolopea bg-transparent p-[20px]  text-[18px] text-tolopea outline-none focus:outline-none focus:ring-0 dark:border-aquamarine dark:text-white"
            }
            placeholder={"Enter you answer here"}
          />
        </div>
      )}
      <ModalWrapper isOpen={expandAnswer} setIsOpen={setExpandAnswer}>
        <div className={"flex flex-col items-center justify-center p-[40px]"}>
          <p className={"text-xl dark:text-white"}>{answerToExpand}</p>
        </div>
      </ModalWrapper>
    </div>
  );
};
export { QuizCard };
