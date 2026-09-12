import React from "react";

interface RadioSwitchButtonProps {
  isChecked: boolean;
  handleInputChange: () => void;
  label: string;
}
// TODO this component needs to be fixed
const RadioSwitchButton: React.FC<RadioSwitchButtonProps> = ({
  handleInputChange,
  label,
  isChecked,
}) => {
  return (
    <label
      className={"relative flex  cursor-pointer items-center gap-x-[14px]"}
    >
      <h1>{label}</h1>
      <input
        className={"absolute z-[20] opacity-0"}
        type="radio"
        name="answer"
        checked={isChecked}
        aria-label={"Select all questions and answers"}
        onClick={handleInputChange}
        readOnly={true}
      />
      <div
        className={`${
          isChecked
            ? "bg-aquamarine"
            : "bg-electric-violet-900 dark:bg-electric-violet-200"
        } relative flex h-[24px] min-w-[48px] items-center justify-center rounded-full transition-all duration-75 ease-linear`}
      >
        <div
          className={`absolute ${
            isChecked
              ? "translate-x-[75%] bg-electric-violet"
              : "translate-x-[-75%] bg-tolopea dark:bg-mariana-blue"
          } top-[50%] h-[16px] w-[16px] -translate-y-1/2 rounded-full transition-all duration-75 ease-linear`}
        />
      </div>
    </label>
  );
};

export { RadioSwitchButton };
