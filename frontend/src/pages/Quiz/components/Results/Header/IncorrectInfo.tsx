import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

interface IncorrectInfoProps {
  numIncorrect: number;
}
const IncorrectInfo: React.FC<IncorrectInfoProps> = ({ numIncorrect }) => {
  return (
    <div>
      <div
        className={
          "flex max-w-[60px] items-center justify-between rounded-full bg-tolopea px-[4px] py-[1px] pr-4"
        }
      >
        <div
          className={
            "flex h-[20px] w-[20px] items-center justify-center rounded-full bg-white"
          }
        >
          <XMarkIcon className={"h-[16px] w-[16px] text-tolopea"} />
        </div>
        <h1 className={" text-lg font-medium"}>{numIncorrect}</h1>
      </div>
      <h1 className={"py-[2px] text-sm"}>Incorrect answers</h1>
      <span className={"block h-[2px] w-full rounded-full bg-white"} />
    </div>
  );
};

export { IncorrectInfo };
