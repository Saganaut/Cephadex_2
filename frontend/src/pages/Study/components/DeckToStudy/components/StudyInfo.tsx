import React from "react";

interface StudyInfoProps {
  currentDeckAnswers: any;
  correctPercent: number;
  skippedCards: number;
  leftToStudy: number;
}
const StudyInfo: React.FC<StudyInfoProps> = ({
  currentDeckAnswers,
  correctPercent,
  skippedCards,
  leftToStudy,
}) => {
  return (
    <>
      <div
        className={
          "flex items-center gap-x-[20px] rounded-full bg-electric-violet-200 dark:bg-mariana-blue md:p-2 md:px-6"
        }>
        <p className={"hidden text-tolopea dark:text-aquamarine"}>
          Answered |{" "}
          <span className={"text-white"}>
            {currentDeckAnswers?.length ?? 0}
          </span>
        </p>
        <p className={"hidden text-tolopea dark:text-aquamarine lg:block"}>
          Correct |{" "}
          <span className={"text-white"}>{correctPercent.toFixed(2)}%</span>
        </p>

        <p
          className={
            "flex flex-col items-center text-xs  text-tolopea dark:text-aquamarine lg:hidden"
          }>
          Correct
          <span className={"my-[4px] block h-[2px] w-full bg-aquamarine"} />
          <span className={"text-white"}>{correctPercent.toFixed(2)}%</span>
        </p>

        <p className={"hidden text-tolopea dark:text-aquamarine"}>
          Skipped | <span className={"text-white"}>{skippedCards}</span>
        </p>

        <p className={"hidden text-tolopea dark:text-aquamarine lg:block"}>
          Left to study | <span className={"text-white"}>{leftToStudy}</span>
        </p>

        <p
          className={
            "flex flex-col items-center text-xs text-tolopea dark:text-aquamarine  lg:hidden"
          }>
          Left
          <span className={"my-[4px] block h-[2px] w-full bg-aquamarine"} />
          <span className={"text-white"}>{leftToStudy}</span>
        </p>
      </div>
    </>
  );
};

export { StudyInfo };
