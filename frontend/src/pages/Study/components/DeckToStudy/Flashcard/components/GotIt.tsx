import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

interface GotItProps {
  onClick: () => void;
}
const GotIt: React.FC<GotItProps> = ({ onClick }) => {
  return (
    <>
      {" "}
      <button
        onClick={onClick}
        className={
          "group flex w-full items-center justify-between rounded-full border-2  border-tolopea px-4 py-1 text-[16px]  text-mariana-blue duration-100 ease-linear hover:scale-105 hover:bg-electric-violet hover:text-white dark:border-aquamarine dark:bg-aquamarine dark:hover:text-mariana-blue"
        }>
        <span>Got it</span>

        <CheckIcon
          className={
            "size-[20px] text-mariana-blue group-hover:text-white dark:group-hover:text-mariana-blue"
          }
        />
      </button>
    </>
  );
};

export { GotIt };
