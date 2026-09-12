import { type QuizAndResults, type QuizSchema } from "@source/client";
import { Crickets } from "@source/common/InfoComponents/Crickets";
import { Loading } from "@source/common/InfoComponents/Loading";
import { SelectWrapper } from "@source/common/SelectWrapper";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";

import { DateDisplay } from "../../common/DateDisplay";
import { QuizResultItem } from "./components/Results/QuizResult";

interface ResultsProps {
  results?: QuizAndResults[] | null;
  resultIndex: number | null;
  setResultIndex: (index: number | null) => void;
}
// TODO add past due indicator here
const ResultItem: React.FC<{ result: any; quiz: QuizSchema }> = ({
  result,
  quiz,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(
          `/quiz/${quiz.id}/${
            "grade-result"
            // result.taker === result.creator ? "result" : "grade-result"
          }/${result.id}`
        );
      }}
      className="w-full cursor-pointer rounded-2xl bg-electric-violet-500  px-[14px] py-[8px] hover:bg-electric-violet-700 dark:bg-tolopea dark:hover:bg-electric-violet"
    >
      <div className="flex justify-between gap-x-[12px]">
        <h1 className="flex items-center">
          {result.takerUsername ?? "No username"} -{" "}
          {result.takerName ?? "No name"}{" "}
        </h1>
        <div className={"flex items-center gap-x-[12px] "}>
          <div className="hidden sm:block">
            {" "}
            <DateDisplay date={result.endTime} style="result" />
          </div>
          <div className="rounded-full border-2 border-electric-violet-900 px-2 py-1 dark:border-white">
            <h1>{result.points} pts: </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

const Results: React.FC<ResultsProps> = ({
  results,
  setResultIndex,
  resultIndex,
}) => {
  const handleExpand = (index: number): void => {
    if (resultIndex === index) {
      setResultIndex(null);
    } else {
      setResultIndex(index);
    }
  };

  return (
    <>
      {" "}
      {/* <div className={"rounded-[18px] bg-mariana-blue p-[36px] text-white"}>
        <div className="flex flex-wrap gap-y-[16px]"> */}
      {results == null ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loading />
        </div>
      ) : results.length > 0 ? (
        <SelectWrapper withFilter={false}>
          <AnimatePresence>
            {results.map((quiz, index) => (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ delay: 0.05 * index, ease: "easeOut" }}
                className=""
                key={index}
              >
                <QuizResultItem
                  quiz={quiz}
                  resultIndex={resultIndex}
                  handleExpand={handleExpand}
                />
                {resultIndex === quiz.id && (
                  <div className="text:tolopea flex w-full flex-col gap-y-[6px] px-2 dark:text-white lg:pl-[24px]">
                    <AnimatePresence>
                      {quiz.results?.map((result, index) => (
                        <motion.div
                          initial={{ opacity: 0, y: -50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 100 }}
                          transition={{ delay: 0.05 * index, ease: "easeOut" }}
                          className=""
                          key={index}
                        >
                          <ResultItem result={result} quiz={quiz} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            ))}{" "}
          </AnimatePresence>
        </SelectWrapper>
      ) : (
        <div className="flex w-full items-center justify-center">
          <Crickets message={"You don't have any results yet"} />
        </div>
      )}
      {/* </div>
      </div> */}
    </>
  );
};

export { Results };
