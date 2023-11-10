import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const HowItWorksButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={` 
        hover:scale-101 active:bg-primary-400 hover:bg-blaze-orange-300 mb-4 mr-5 cursor-pointer rounded-full border border-white
       bg-electric-violet px-4 py-1 text-lg 
        text-white transition-transform hover:shadow-md 
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

export { HowItWorksButton };
