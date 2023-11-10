import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}
const StdButton: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={` 
        hover:border-secondary-400 hover:scale-101 active:bg-primary-400 mb-4 mr-5 cursor-pointer rounded-full border-2 
       bg-electric-violet px-4 py-1 text-lg 
        text-white transition-transform hover:bg-blaze-orange hover:shadow-md 
        ${
          disabled === true
            ? "bg-grey-300 cursor-not-allowed text-opacity-10 shadow-none"
            : ""
        }
      `}
    >
      {label}
    </button>
  );
};

export { StdButton };
