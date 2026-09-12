import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface IconButtonProps {
  icon: string | ReactNode;
  onClick: () => void;
  ariaLabel: string;
  to: string;
  theme: "cyan" | "violet" | "transparent" | "orange";
  collapse: boolean;
  classname?: string;
  disabled?: boolean;
  active?: boolean;
  iconClassName?: string;
  onlyIconOnMobile?: boolean;
}
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  to,
  collapse,
  theme,
  classname,
  disabled,
  active,
  iconClassName,
  onlyIconOnMobile = false,
}) => {
  const className = twMerge(
    "flex items-center transition-all duration-300 rounded-full  px-[4px] py-[4px] text-sm",
    theme === "cyan"
      ? "dark:bg-aquamarine  bg-mariana-blue dark:text-mariana-blue text-white hover:bg-electric-violet"
      : theme === "violet"
      ? "bg-electric-violet text-white hover:bg-aquamarine dark:hover:text-white"
      : theme === "orange"
      ? "bg-blaze-orange text-white"
      : "imgHoverAqua dark:text-aquamarine text-tolopea dark:hover:text-white hover:text-electric-violet dark:hover:bg-tolopea hover:bg-electric-violet-200",
    collapse
      ? theme === "cyan"
        ? "w-[50px] min-h-[50px] bg-transparent"
        : theme === "violet"
        ? "w-[50px] min-h-[50px] hover:bg-blaze-orange dark:hover-text-white"
        : "w-[50px] min-h-[50px] hover:bg-transparent "
      : "w-full",
    disabled === true && "opacity-50 cursor-not-allowed",
    classname,
    active === true ? "bg-white dark:bg-mariana-blue-100" : "",
    onlyIconOnMobile ? " justify-center sm:justify-start" : ""
  );

  return (
    <Link to={to}>
      <button
        disabled={disabled}
        onClick={onClick}
        className={className}
        aria-label={ariaLabel}
        data-name="icon-button"
      >
        {typeof icon === "string" ? (
          <img
            src={icon}
            alt={`icon-${ariaLabel}`}
            className={twMerge(
              `h-[20px]  min-h-[42px] w-[20px] min-w-[42px] rounded-full ${
                active === true ? "border-[3px] border-aquamarine" : ""
              }`,
              iconClassName
            )}
          />
        ) : (
          <div
            className={twMerge(
              "flex h-[42px] w-[42px] items-center justify-center rounded-full",
              iconClassName
            )}
          >
            {React.cloneElement(icon as React.ReactElement, {
              className: `${
                theme === "violet"
                  ? "dark:text-aquamarine dark:text-tolopea"
                  : theme === "orange"
                  ? "dark:text-white text-white"
                  : "text-black"
              } h-[36px]  w-[36px] `,
            })}
          </div>
        )}
        {!collapse && (
          <span
            className={`mx-[10px] text-[14px] font-medium ${
              onlyIconOnMobile && "hidden sm:block"
            }`}
          >
            {ariaLabel}
          </span>
        )}
      </button>
    </Link>
  );
};

export { IconButton };
