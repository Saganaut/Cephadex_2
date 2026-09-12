import { Loading } from "@source/common/InfoComponents/Loading";
import { useFetchQuizzes } from "@source/lib/hooks/quizzesHooks/useFetchQuizzes";
import { useAppSelector } from "@source/lib/store/hooks";
import { selectQuizzesByDeckId } from "@source/lib/store/quizzes/quizzesSlice";
import React from "react";
import { useNavigate } from "react-router-dom";

import { QuizItem } from "./QuizItem";

interface QuizContainerProps {
  deckId: number;
}

const QuizContainer: React.FC<QuizContainerProps> = ({ deckId }) => {
  const navigate = useNavigate();
  const { quizzes, quizzesStatus } = useFetchQuizzes();

  const quizzesForDeck = useAppSelector((state) =>
    selectQuizzesByDeckId(state, deckId)
  );

  if (quizzesStatus === "loading") {
    return <Loading />;
  }

  return (
    <div className={"min-w-[200px] rounded-[18px] p-[10px] sm:min-w-[400px]"}>
      <div className="rounded-2xl  p-2">
        <>
          <div className="flex items-center justify-between">
            <h1 className={"mb-2 text-lg "}>Quizzes</h1>{" "}
            {/* <EditNoBorder
              className={"h-[25px] w-[25px] cursor-pointer  "}
              onClick={() => {}}
            /> */}
          </div>
          <div className={"mx-auto  "}>
            {quizzesForDeck?.map((quiz) => (
              <div
                className="cursor-pointer "
                key={quiz.quiz.id} // Assuming this is within a .map() or similar
                onClick={() => {
                  navigate(`/quiz/hub/${quiz.quiz.id}`);
                }}
              >
                <QuizItem quiz={quiz.quiz} />
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
};

export { QuizContainer };
