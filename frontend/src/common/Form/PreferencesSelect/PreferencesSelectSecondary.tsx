import React from "react";

import { Tooltip } from "../Tooltip";

interface PreferencesSelectSecondaryProps {
  label: string;
  options: Array<{
    label: string;
    value: string;
    tooltip: string;
    id?: string;
  }>;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  id?: string;
}

const PreferencesSelectSecondary: React.FC<PreferencesSelectSecondaryProps> = ({
  label,
  options,
  activeIndex,
  setActiveIndex,
  id = "",
}) => {
  return (
    <div id={id}>
      {label !== "" && (
        <h1
          className={
            "text-[16px] font-semibold text-blaze-orange sm:pb-[24px] sm:pt-[50px] sm:text-[24px]"
          }
        >
          {label}
        </h1>
      )}

      <div
        className={
          "inline-flex items-center gap-x-[4px] rounded-full bg-electric-violet-900 p-[2px] text-white sm:gap-x-[16px]"
        }
      >
        {options.map((option, index) => (
          <Tooltip key={index} text={option.tooltip}>
            <p
              id={option.id ?? undefined}
              onClick={() => {
                setActiveIndex(index);
              }}
              key={index}
              className={`h-full min-w-[75px] rounded-full px-4 sm:min-w-[150px] ${
                activeIndex === index ? "bg-electric-violet" : " "
              }  cursor-pointer py-[10px] text-center transition-all duration-500 ease-in-out`}
              title={option.tooltip}
            >
              {option.label}
            </p>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
export { PreferencesSelectSecondary };
