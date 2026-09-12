import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";

interface NextButtonProps {
  onClick: () => void;
  style?: string;
}
const NextButton: React.FC<NextButtonProps> = ({ onClick }) => {
  return (
    <>
      <div
        onClick={onClick}
        className={"group flex cursor-pointer items-center gap-x-[8px]"}
      >
        <p className={"hidden text-lg text-tolopea dark:text-white sm:block"}>
          Next
        </p>
        <div
          className={
            "flex h-[32px] w-[32px] items-center justify-center rounded-full border-[2px] border-electric-violet group-hover:bg-aquamarine dark:border-aquamarine"
          }
        >
          <ArrowRightIcon
            className={
              "h-[20px] w-[20px] text-tolopea group-hover:text-mariana-blue dark:text-aquamarine"
            }
          />
        </div>
      </div>
    </>
  );
};

export { NextButton };
