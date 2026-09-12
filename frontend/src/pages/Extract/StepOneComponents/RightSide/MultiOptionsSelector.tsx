import React from "react";

import { ExtrasOptionsButtons } from "./ExtrasOptionsButton";

interface MultiOptionsProps {
  value: string;
  type: string;
}

interface MultiOptionsSelectorProps {
  options: MultiOptionsProps[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
}

const MultiOptionsSelector: React.FC<MultiOptionsSelectorProps> = ({
  options,
  selected,
  onChange,
}) => {
  const toggleOption = (option: string): void => {
    let newSelected = [...selected];
    if (newSelected.includes(option)) {
      newSelected = newSelected.filter((s) => s !== option);
    } else {
      if (option === "Create summary") {
        newSelected = newSelected.filter((s) => s !== "Create notes");
      } else if (option === "Create notes") {
        newSelected = newSelected.filter((s) => s !== "Create summary");
      }
      newSelected.push(option);
    }
    onChange(newSelected);
  };

  return (
    <>
      <div className=" flex flex-wrap justify-evenly ">
        {options.map((option) => (
          <div key={option.value} className=" flex rounded-full p-1">
            <ExtrasOptionsButtons
              optionToPass={option}
              toggleOption={() => {
                toggleOption(option.value);
              }}
              selected={selected}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export { MultiOptionsSelector };
