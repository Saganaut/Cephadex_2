import { Quiz } from "@quizzes/components/Quiz";
import { type QuizSchema } from "@source/client";
import { Crickets } from "@source/common/InfoComponents/Crickets";
import { Loading } from "@source/common/InfoComponents/Loading";
import { SelectWrapper } from "@source/common/SelectWrapper";
import { useFetchUser } from "@source/lib/hooks/userHooks/useFetchUser";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface MyQuizzesProps {
  sortedArray?: QuizSchema[];
  quizSearchQuery: string;
}
const MyQuizzes: React.FC<MyQuizzesProps> = ({
  sortedArray,
  quizSearchQuery,
}) => {
  const { user } = useFetchUser();

  // !important have to filter out quizzes that are not created by the user as they get stored in the same redux store.  Could also have a seperate selector - consider refactor

  return (
    <div id="my-quizzes">
      {" "}
      {/* <div className={"rounded-[18px] bg-mariana-blue sm:p-[36px] "}>
        <div className=" flex flex-wrap gap-y-[16px]"> */}
      {sortedArray == null ? (
        <>
          <Loading />{" "}
        </>
      ) : sortedArray.length > 0 ? (
        <SelectWrapper withFilter={false}>
          <div>
            <AnimatePresence>
              {sortedArray
                .filter((quiz: QuizSchema) =>
                  quiz.name.includes(quizSearchQuery)
                )
                .filter((quiz: QuizSchema) => quiz.creator === user.id)
                .map((quiz: QuizSchema, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ delay: 0.05 * index, ease: "easeOut" }}
                    className="p-1"
                    key={index}
                  >
                    <Quiz quiz={quiz} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </SelectWrapper>
      ) : (
        <div className="flex w-full items-center justify-center">
          <Crickets message={"Click create quiz to make your first quiz"} />
        </div>
      )}
      {/* </div>
      </div> */}
    </div>
  );
};

export { MyQuizzes };
