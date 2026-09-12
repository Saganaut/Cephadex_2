import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  label: string;
  onClick: (() => void) | ((event: Event) => void);
  disabled?: boolean;
  className?: string;
  id?: string;
}
const Button: React.FC<ButtonProps> = ({
  label,
  className,
  onClick,
  disabled,
  id = "",
}) => {
  return (
    <button
      id={id}
      type='button'
      onTouchEnd={onClick} // workaround for bug with not working buttons on touch mode (e.g. delete deck modal)
      onMouseUp={onClick}
      disabled={disabled}
      className={twMerge(`
        cursor-pointer rounded-full
       bg-blaze-orange hover:bg-blaze-orange-900 lg:px-[30px] lg:py-[12px] px-[15px] py-[4px] font-medium text-[18px]
         hover:scale-105 transition-transform duration-100 text-white

        ${
          disabled === true
            ? "bg-grey-300 border-2 border-stone-800 cursor-not-allowed dark:text-opacity-20 text-tolopea/40 shadow-none"
            : ""
        }
       ${className}
      `)}>
      {label}
    </button>
  );
};

export { Button };
