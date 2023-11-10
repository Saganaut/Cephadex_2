import React from "react";

interface InputErrorMessageProps {
  error?: boolean;
  errorMessage?: string;
}

const InputErrorMessage: React.FC<InputErrorMessageProps> = ({
  errorMessage,
  error = false,
}) => {
  return (
    <div
      className={`mt-2 text-sm text-red-500 ${
        error ? "visible" : "invisible"
      } h-5`}
    >
      {errorMessage}
    </div>
  );
};

export { InputErrorMessage };
