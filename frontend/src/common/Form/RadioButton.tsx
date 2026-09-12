import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

interface RadioButtonProps {
  isChecked: boolean;
  handleInputChange: () => void;
  label: string;
  theme: "violet" | "marina-blue";
}
const RadioButton: React.FC<RadioButtonProps> = ({
  handleInputChange,
  isChecked,
  label,
  theme,
}) => {
  return (
    <label className={"relative flex  cursor-pointer items-center gap-x-[8px]"}>
      <input
        className={"absolute z-[20] opacity-0"}
        type="radio"
        name="answer"
        checked={isChecked}
        onChange={() => {}}
        aria-label={label}
        onClick={handleInputChange}
      />
      <div
        className={`${
          isChecked
            ? `${
                theme === "violet"
                  ? " border-electric-violet bg-electric-violet"
                  : " border-mariana-blue bg-electric-violet dark:bg-mariana-blue"
              }`
            : "border-tolopea bg-transparent dark:border-white"
        } flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-75 ease-linear`}
      >
        {isChecked && <CheckIcon className="h-[18px] w-[18px] text-white" />}
      </div>
      <h1
        className={
          "max-w-[50vw] text-ellipsis text-[12px] font-medium text-tolopea dark:text-white sm:text-[18px]"
        }
      >
        {label}
      </h1>
    </label>
  );
};
export { RadioButton };
