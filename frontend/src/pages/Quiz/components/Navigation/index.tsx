import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@source/common/Buttons/Button";
import { NextButton } from "@source/common/Buttons/NavButtons/NextButton";
import { PrevButton } from "@source/common/Buttons/NavButtons/PrevButton";
import { type QuizAndQuestionsSchema } from "@source/lib/store/quizzes/quizzesSlice";
import React from "react";
import { type Swiper } from "swiper/types";

interface NavigationProps {
  swiperRef: React.MutableRefObject<Swiper | null>;
  activeIndex: number;
  quizAndQuestions: QuizAndQuestionsSchema;
  handleSubmitQuiz: () => Promise<void>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const Navigation: React.FC<NavigationProps> = ({
  swiperRef,
  quizAndQuestions,
  handleSubmitQuiz,
  activeIndex,
  setIsOpen,
}) => {
  return (
    <div className={"flex items-center justify-between px-[40px]"}>
      {quizAndQuestions?.questions != null && (
        <>
          {activeIndex > 0 && (
            <PrevButton onClick={() => swiperRef.current?.slidePrev()} />
          )}
          {activeIndex + 1 < quizAndQuestions.questions.length && (
            <div className="">
              <Button
                label={"Submit"}
                onClick={() => {
                  setIsOpen(true);
                }}
              />
            </div>
          )}
          {activeIndex + 1 === quizAndQuestions.questions.length && (
            <Button
              label={"Submit quiz"}
              onClick={() => {
                setIsOpen(true);
              }}
            />
          )}

          {activeIndex + 1 < quizAndQuestions.questions.length && (
            <NextButton
              onClick={() => {
                swiperRef.current?.slideNext();
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
export { Navigation };
