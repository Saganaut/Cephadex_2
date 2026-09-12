import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

interface PointsInfoProps {
  numCorrect: number | null;
  numPoints: number | null | undefined;
}
const PointsInfo: React.FC<PointsInfoProps> = ({ numCorrect, numPoints }) => {
  return (
    <>
      {" "}
      <div>
        <div
          className={
            "flex max-w-[100px] items-center justify-between gap-x-[10px]   rounded-full bg-tolopea px-[4px] py-[1px] pr-4"
          }
        >
          <div
            className={
              "flex h-[20px] w-[20px] items-center justify-center rounded-full bg-blaze-orange"
            }
          >
            <CheckIcon className={"h-[16px] w-[16px]"} />
          </div>
          <h1 className={"text-lg font-medium"}>
            {numCorrect} |{" "}
            <span className={"text-blaze-orange"}>{numPoints ?? 0}</span>
          </h1>
        </div>
        <h1 className={"py-[2px] text-sm"}>Points</h1>
        <span className={"block h-[2px] w-full rounded-full bg-blaze-orange"} />
      </div>
    </>
  );
};

export { PointsInfo };
