import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}
const Button: React.FC<ButtonProps> = ({
  label,
  className,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(`
        cursor-pointer rounded-full
       bg-blaze-orange px-[80px] py-[16px] text-[24px]
        text-white
        ${
          disabled === true
            ? "bg-grey-300 cursor-not-allowed text-opacity-10 shadow-none"
            : ""
        }
       ${className}
      `)}
    >
      {label}
    </button>
  );
};

export { Button };
