import React from "react";
import { twMerge } from "tailwind-merge";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}
const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => {
  return (
    <div
      data-name="PageWrapper"
      className={twMerge(
        className,
        "h-full w-full sm:px-9  pt-[120px] pb-[40px] lg:px-[64px] lg:pt-[120px] text-tolopea dark:text-white"
      )}
      data-testid="page-wrapper"
    >
      {children}
    </div>
  );
};
export { PageWrapper };
