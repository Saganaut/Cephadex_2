import React from "react";

import { Tooltip } from "../Tooltip";

interface ItemProps {
  option: { label: string; value: string; icon?: any };
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const Item: React.FC<ItemProps> = ({
  option,
  index,
  activeIndex,
  setActiveIndex,
}) => {
  return (
    <>
      {" "}
      <div
        key={index}
        className={`flex h-full w-full cursor-pointer items-center justify-center rounded-full px-2 sm:gap-x-[10px] sm:px-4 lg:min-w-[150px] ${
          activeIndex === index
            ? "bg-electric-violet sm:border-0"
            : "bg-transparent"
        } `}
        onClick={() => {
          setActiveIndex(index);
        }}
      >
        {option.icon === null ? (
          <p
            className={` items-center whitespace-nowrap rounded-full  text-center text-[12px] font-medium transition-all duration-500 ease-in-out sm:px-8 sm:py-2 sm:text-lg lg:block ${
              activeIndex === index ? "" : ""
            }`}
          >
            {option.label}
          </p>
        ) : (
          <div
            className={`flex flex-nowrap items-center sm:px-2 ${
              activeIndex === index ? "" : ""
            } `}
          >
            <Tooltip text={option.label}>
              <div
                className={` rounded-full ${activeIndex === index ? "" : ""}`}
              >
                {option.icon}
              </div>
            </Tooltip>

            <p
              className={`hidden  whitespace-nowrap rounded-full px-3 py-[6px] text-center text-sm font-medium transition-all duration-500 ease-in-out sm:block sm:text-lg lg:px-6 `}
            >
              {option.label}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export { Item };
