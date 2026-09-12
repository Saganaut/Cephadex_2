import { Quiz } from "@quizzes/components/Quiz";
import { Crickets } from "@source/common/InfoComponents/Crickets";
import { Loading } from "@source/common/InfoComponents/Loading";
import { SelectWrapper } from "@source/common/SelectWrapper";
import { useFetchSharedQuizzes } from "@source/lib/hooks/quizzesHooks/useFetchQuizzes";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface AssignedQuizzesProps {
  quizSearchQuery: string;
}

// TODO : Add type here
const AssignedQuizzes: React.FC<AssignedQuizzesProps> = ({
  quizSearchQuery,
}) => {
  const { sharedQuizzes, sharedQuizzesStatus } = useFetchSharedQuizzes();

  if (sharedQuizzesStatus === "loading")
    return (
      <>
        <Loading />{" "}
      </>
    );

  return (
    <>
      {sharedQuizzes == null ? (
        <>
          <Loading />{" "}
        </>
      ) : sharedQuizzes.length > 0 ? (
        <SelectWrapper withFilter={false}>
          <AnimatePresence>
            {sharedQuizzes
              .filter((quiz) => quiz.quiz.name.includes(quizSearchQuery))
              .map((quiz, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  transition={{ delay: 0.05 * index, ease: "easeOut" }}
                  className="p-1"
                  key={index}
                >
                  <Quiz
                    Indictaor={
                      quiz.results != null && quiz?.results?.length <= 0
                    }
                    quizShareId={quiz.share.shareId}
                    quiz={quiz.quiz}
                    key={index}
                  />
                </motion.div>
              ))}{" "}
          </AnimatePresence>
        </SelectWrapper>
      ) : (
        <div className="flex w-full items-center justify-center">
          <Crickets message={"No quizzes have been assigned to you"} />
        </div>
      )}
    </>
  );
};

export { AssignedQuizzes };
