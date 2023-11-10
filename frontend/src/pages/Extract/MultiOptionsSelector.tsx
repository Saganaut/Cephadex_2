import React from "react";

interface MultiOptionsSelectorProps {
  options: string[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
}

const MultiOptionsSelector: React.FC<MultiOptionsSelectorProps> = ({
  options,
  selected,
  onChange,
}) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className=" flex flex-wrap  overflow-hidden">
      {options.map((option) => (
        <div
          key={option}
          className=" px-2 overflow-hidden flex flex-center rounded-full sm:w-1/2 md:w-1/4 "
        >
          <div
            className={` border border-aquamarine  overflow-hidden w-full flex justify-center items-center rounded-full px-8 py-2  ${
              selected.includes(option)
                ? "bg-aquamarine text-tolopea"
                : "text-white"
            }`}
            onClick={() => toggleOption(option)}
          >
            {option}
          </div>
        </div>
      ))}
    </div>
  );
};

export { MultiOptionsSelector };
