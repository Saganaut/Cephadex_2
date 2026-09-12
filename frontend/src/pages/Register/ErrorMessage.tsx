import React from "react";

interface ErrorMessageProps {
  message: string | undefined;
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="h-[20px] px-2 py-1 text-sm text-red-400">{message}</div>
  );
};

export { ErrorMessage };
