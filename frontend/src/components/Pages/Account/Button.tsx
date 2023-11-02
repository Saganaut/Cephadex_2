import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}
const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={` 
        hover:scale-101 active:bg-primary-400 hover:bg-blaze-orange-300 cursor-pointer rounded-full
       bg-blaze-orange px-[80px] py-[16px] text-[24px]
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

export { Button };
