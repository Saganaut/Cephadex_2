import React from "react";

interface ExtractProps {
  customIsSelected: boolean;
  toggleCustomSelection: () => void;
  name: string;
  id: number;
}

const ExtractSelectionButton: React.FC<ExtractProps> = ({
  name,
  id,
  customIsSelected,
  toggleCustomSelection,
}) => {
  const computeClass = () => {
    if (id === 1) {
      if (customIsSelected) return "bg-red-500 mr-5";
      else return "bg-blue-500 mr-5";
    }
    if (id === 2) {
      if (customIsSelected) return "bg-blue-500 ml-5";
      else return "bg-red-500 ml-5";
    }
  };

  return (
    <div>
      <button
        className={`h-10 px-2 py-2 w-full text-sm text-white flex items-center justify-center rounded-full ${computeClass()}`}
        onClick={toggleCustomSelection}
      >
        {name}
      </button>
    </div>
  );
};

export { ExtractSelectionButton };
