import CephSleeping1 from "@assets/message/CephSleeping1.svg?react";
import React from "react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  type?: string;
  style?: string;
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type,
  style,
}) => {
  const compTitle = title ?? "Error";
  const compMessage =
    message ?? "Seems like you caught Ceph napping.  Try refreshing the page.";

  return (
    <div className="flex h-full items-center justify-center px-4 text-blaze-orange  sm:px-0">
      <div>
        <h1 className="mb-4 flex flex-wrap justify-center p-2 text-xl sm:text-2xl">
          {compTitle}
        </h1>
        <div className="flex justify-center">
          <CephSleeping1 className="max-h-[100px] max-w-[50vw] sm:max-h-none" />
        </div>
        <p className="mt-6 flex flex-wrap justify-center p-2 text-xs sm:text-xl">
          {compMessage}
        </p>
      </div>
    </div>
  );
};

export { ErrorMessage };
