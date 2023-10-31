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
    <div className="p-2 flex flex-wrap -mx-2 overflow-hidden">
      {options.map((option) => (
        <div
          key={option}
          className="px-4  overflow-hidden rounded-full sm:w-1/2 md:w-1/4 "
        >
          <button
            className={` border border-aquamarine overflow-hidden w-full flex justify-center items-center rounded-full px-8 py-2 mx-2 ${
              selected.includes(option)
                ? "bg-aquamarine text-tolopea"
                : "text-white"
            }`}
            onClick={() => toggleOption(option)}
          >
            {option}
          </button>
        </div>
      ))}
    </div>
  );
};

export { MultiOptionsSelector };
