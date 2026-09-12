import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";

interface PrevButtonProps {
  onClick: () => void;
  style?: string;
}
const PrevButton: React.FC<PrevButtonProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className={"group flex cursor-pointer items-center gap-x-[8px]"}
    >
      <div
        className={
          "flex h-[32px] w-[32px] items-center justify-center rounded-full border-[2px] border-electric-violet group-hover:bg-aquamarine dark:border-aquamarine"
        }
      >
        <ArrowLeftIcon
          className={
            "h-[20px] w-[20px] text-tolopea group-hover:text-mariana-blue dark:text-aquamarine"
          }
        />
      </div>
      <p className={"hidden text-lg text-tolopea dark:text-white sm:block"}>
        Previous
      </p>
    </div>
  );
};

export { PrevButton };
