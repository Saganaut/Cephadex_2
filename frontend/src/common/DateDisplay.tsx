import CalendarIcon from "@assets/CalendarIcon.svg?react";
import { formatDate } from "@source/lib/utils/functions";
import React from "react";

interface DateDisplayProps {
  date?: string | null;
  style?: string;
}
const DateDisplay: React.FC<DateDisplayProps> = ({ date, style }) => {
  const className =
    style === "result"
      ? "flex items-center justify-center text-center gap-x-[5px] rounded-full md:bg-white text-sm sm:px-[10px] sm:py-[4px] "
      : "flex items-center gap-x-[10px] rounded-full md:bg-white text-sm md:text-md text-white md:text-tolopea sm:px-[16px] py-[6px]";

  return (
    <>
      {" "}
      <div className={`${className}`}>
        <div className="rounded-full bg-white  p-1 md:p-0 ">
          <CalendarIcon className={"h-[24px] w-[24px] text-electric-violet"} />
        </div>
        <h1
          className={
            "whitespace-nowrap text-xs font-medium text-tolopea  sm:text-base md:text-tolopea  "
          }
        >
          {formatDate(date ?? "")}{" "}
        </h1>
      </div>
    </>
  );
};

export { DateDisplay };
