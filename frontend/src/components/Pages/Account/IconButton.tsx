import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface IconButtonProps {
  icon: string | ReactNode;
  onClick: () => void;
  ariaLabel: string;
  to: string;
  theme: "cyan" | "white";
  collapse: boolean;
}
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  to,
  collapse,
  theme,
}) => {
  const className = twMerge(
    `flex items-center transition-all duration-300 rounded-full p-2 text-sm", ${
      theme === "cyan" ? "bg-aquamarine text-mariana-blue" : "bg-white"
    }
    ${collapse ? "w-[60px]" : "w-full"}
    
    `
  );

  return (
    <Link to={to}>
      <button onClick={onClick} className={className} aria-label={ariaLabel}>
        {typeof icon === "string" ? (
          <img
            src={icon}
            alt={`icon-${ariaLabel}`}
            className="min-h-[42px] min-w-[42px]"
          />
        ) : (
          <div
            className={
              "flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gray-200"
            }
          >
            {React.cloneElement(icon as React.ReactElement, {
              className: "h-[24px] w-[24px]",
            })}
          </div>
        )}
        {!collapse && (
          <span className="mx-[10px] text-[14px] font-medium">{ariaLabel}</span>
        )}
      </button>
    </Link>
  );
};

export { IconButton };
