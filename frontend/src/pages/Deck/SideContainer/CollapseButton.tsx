import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import React from "react";

interface CollapseButtonProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}
const CollapseButton: React.FC<CollapseButtonProps> = ({
  isCollapsed,
  setIsCollapsed,
}) => {
  return (
    <div className={"ring-electric-violet"}>
      <button
        className={`flex h-[40px] w-[40px] items-center justify-center  rounded-full bg-electric-violet-200 hover:bg-electric-violet hover:text-white dark:bg-electric-violet dark:hover:bg-electric-violet-500`}
        aria-label="Close sidebar"
      >
        {isCollapsed ? (
          <ChevronLeftIcon
            onClick={() => {
              setIsCollapsed(!isCollapsed);
            }}
            className={"relative  z-[99] h-[24px] w-[24px]   text-white  "}
          />
        ) : (
          <ChevronRightIcon
            onClick={() => {
              setIsCollapsed(!isCollapsed);
            }}
            className={"z-50 h-[24px] w-[24px]  text-white"}
          />
        )}
      </button>
      <div className="pointer-events-none absolute right-0 top-[-170px] z-[15] h-[400px] w-[200px] select-none overflow-hidden">
        <div
          className={`${
            isCollapsed ? "opacity-40 dark:opacity-60" : "opacity-0"
          } absolute right-[-100px] top-[110px] z-40 h-[200px] w-[200px] rounded-full bg-gradient-circle text-white  blur-[40px] transition-opacity duration-1000`}
        />
      </div>
    </div>
  );
};

export { CollapseButton };
