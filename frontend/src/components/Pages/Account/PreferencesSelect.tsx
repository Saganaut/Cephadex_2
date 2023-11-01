import React, { useState } from "react";

interface PreferencesSelectProps {
  label: string;
  options: Array<{ label: string; value: string }>;
}

const PreferencesSelect: React.FC<PreferencesSelectProps> = ({
  label,
  options,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <h1
        className={
          "pb-[24px] pt-[50px] text-[24px] font-semibold text-blaze-orange"
        }
      >
        {label}
      </h1>

      <div
        className={
          "inline-flex items-center gap-x-[16px] rounded-full bg-mariana-blue p-[5px] text-white"
        }
      >
        {options.map((option, index) => (
          <p
            onClick={() => {
              setActiveIndex(index);
            }}
            key={index}
            className={`h-full min-w-[125px] rounded-full ${
              activeIndex === index ? "bg-electric-violet" : "bg-tolopea"
            }  cursor-pointer py-[14px] text-center transition-all duration-500 ease-in-out`}
          >
            {option.label}
          </p>
        ))}
      </div>
    </div>
  );
};
export { PreferencesSelect };
