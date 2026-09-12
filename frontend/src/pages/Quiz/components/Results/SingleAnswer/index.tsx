import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

interface SingleAnswerProps {
  correct: boolean | undefined;
  term: string;
  points: number;
  yourAnswer: string | null | undefined;
  correctAnswer: string;
  collapse: boolean;
}
const SingleAnswer: React.FC<SingleAnswerProps> = ({
  points,
  term,
  correct,
  yourAnswer,
  correctAnswer,
  collapse,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!collapse) {
      setIsOpen(true);
    }
    if (collapse) {
      setIsOpen(false);
    }
  }, [collapse]);

  return (
    <div
      className={
        "mt-[20px] w-full rounded-[20px] dark:bg-mariana-blue bg-electric-violet-200  px-[25px] py-[12px]"
      }
    >
      <div className={"flex items-center gap-x-[15px]"}>
        {/*   Drag Icon */}
        <div>
          <ChevronDownIcon
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className={`${
              isOpen ? "" : "-rotate-90"
            } h-[28px]  w-[28px] shrink-0 cursor-pointer dark:text-white text-black`}
          />
        </div>
        <h1 className={"font-medium dark:text-white text-black"}>{term}</h1>
        <div className={"ml-auto flex items-center gap-x-[10px]"}>
          <h1 className={"text-sm font-medium dark:text-white text-black"}>
            Points
          </h1>
          <div
            className={
              "flex items-center rounded-full border border-white p-[4px]"
            }
          >
            <p
              className={
                "px-[10px] text-lg font-medium dark:text-white text-black"
              }
            >
              {points}
            </p>
            <div
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${
                correct === true ? "bg-blaze-orange" : "bg-white"
              } `}
            >
              {correct === true ? (
                <CheckIcon
                  className={`h-[18px] w-[18px] dark:text-white text-black`}
                />
              ) : (
                <XMarkIcon className={`h-[18px] w-[18px] text-tolopea`} />
              )}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={"px-[40px] pt-4"}>
          {correct === true ? (
            <div
              className={
                "flex h-[28px] w-[28px] items-center justify-center rounded-full bg-blaze-orange "
              }
            >
              <CheckIcon
                className={"h-[18px] w-[18px] dark:text-white text-black"}
              />
            </div>
          ) : (
            <div
              className={
                "flex w-fit items-center gap-x-[10px] rounded-full dark:bg-tolopea  bg-aquamarine/30  p-2 text:tolopea dark:dark:text-white text-black"
              }
            >
              <div
                className={
                  "flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white "
                }
              >
                <XMarkIcon className={"h-[18px] w-[18px] text-tolopea"} />
              </div>
              <p className={"pr-2 font-medium"}>Your answer :</p>
            </div>
          )}
          <p className={"pt-2 font-medium dark:text-white text-black"}>
            {yourAnswer ?? "You left it blank!"}
          </p>

          {correct === false && (
            <div className={"pt-6"}>
              <div
                className={
                  "flex w-fit items-center gap-x-[10px] rounded-full dark:bg-tolopea  bg-aquamarine/30  p-2 text:tolopea dark:dark:text-white text-black"
                }
              >
                <div
                  className={
                    "flex h-[28px] w-[28px] items-center justify-center rounded-full bg-blaze-orange "
                  }
                >
                  <CheckIcon
                    className={"h-[18px] w-[18px] dark:text-white text-black"}
                  />
                </div>
                <p className={"pr-2 font-medium"}>Correct answer :</p>
              </div>

              <p className={"pt-2 font-medium dark:text-white text-black"}>
                {correctAnswer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export { SingleAnswer };
