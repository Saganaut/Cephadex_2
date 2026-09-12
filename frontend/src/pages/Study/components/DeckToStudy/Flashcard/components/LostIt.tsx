import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

interface LostItProps {
  onClick: () => void;
}
const LostIt: React.FC<LostItProps> = ({ onClick }) => {
  return (
    <>
      {" "}
      <button
        onClick={onClick}
        className={
          "group flex w-full items-center justify-between rounded-full border-2 border-tolopea px-4 py-1 text-[16px] transition-all duration-100 ease-linear hover:scale-105 hover:border-electric-violet hover:bg-electric-violet hover:text-white  dark:border-aquamarine"
        }>
        <span className='whitespace-nowrap'>Lost it</span>

        <XMarkIcon
          className={
            "size-[24px] text-tolopea group-hover:text-white dark:text-aquamarine"
          }
        />
      </button>
    </>
  );
};

export { LostIt };
