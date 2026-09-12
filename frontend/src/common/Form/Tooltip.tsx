import React, { type ReactNode, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: "top" | "bottom";
}
const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  position = "bottom",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (): void => {
    timeoutId.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // 2000ms = 2s
  };

  const handleMouseLeave = (): void => {
    if (timeoutId.current != null) {
      clearTimeout(timeoutId.current);
    }
    setShowTooltip(false);
  };

  return (
    <div
      className="group relative flex flex-col z-[20] items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div
          className={twMerge(
            position === "top" && "top-[-120%] -translate-y-1/2",
            position === "bottom" && "bottom-[-120%] translate-y-1/2",
            "pointer-events-none absolute hidden flex-col items-center group-hover:flex"
          )}
        >
          <div className="pointer-events-auto relative z-[99999] whitespace-nowrap rounded-[12px] bg-aquamarine p-[8px] text-sm leading-none text-black shadow-lg">
            {/* Arrow */}
            <div
              className={twMerge(
                position === "bottom" &&
                  "left-[50%] top-[0%] -translate-x-1/2 -translate-y-1/2",
                position === "top" &&
                  "left-[50%] bottom-[0%] -translate-x-1/2 translate-y-1/2",
                "absolute h-3 w-3 rotate-45 bg-aquamarine"
              )}
            />
            {text}
          </div>
        </div>
      )}
    </div>
  );
};
export { Tooltip };
