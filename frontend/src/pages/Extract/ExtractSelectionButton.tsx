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
      if (customIsSelected) return "bg-electric-violet mr-5";
      else return "bg-tolopea mr-5";
    }
    if (id === 2) {
      if (customIsSelected) return "bg-tolopea ml-5";
      else return "bg-electric-violet ml-5";
    }
  };

  return (
    <div>
      <button
        className={`px-8 py-4  text-sm text-white flex items-center justify-center rounded-full ${computeClass()}`}
        onClick={toggleCustomSelection}
      >
        {name}
      </button>
    </div>
  );
};

export { ExtractSelectionButton };
