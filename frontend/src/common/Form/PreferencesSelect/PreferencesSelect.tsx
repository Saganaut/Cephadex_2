import React from "react";
import { twMerge } from "tailwind-merge";

import { Item } from "./Items";

interface PreferencesSelectProps {
  label: string;
  options: Array<{ label: string; value: string; icon?: any }>;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  className?: string;
}

const PreferencesSelect: React.FC<PreferencesSelectProps> = ({
  label,
  options,
  activeIndex,
  setActiveIndex,
  className,
}) => {
  return (
    <div
      className={twMerge("w-fit min-w-[200px] rounded-full px-1", className)}
    >
      {label.length > 0 && (
        <h1
          className={
            "pb-[18px] text-[18px] font-semibold text-tolopea dark:text-white lg:text-[24px]"
          }
        >
          {label}
        </h1>
      )}

      <div
        className={
          " inline-flex h-[42px] w-full items-center gap-4 rounded-full  bg-electric-violet-900  text-white "
        }
      >
        {options.map((option, index) => (
          <Item
            key={index}
            option={option}
            index={index}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ))}
      </div>
    </div>
  );
};
export { PreferencesSelect };
