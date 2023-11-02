import React from "react";

interface InputErrorMessageProps {
  error: boolean;
  errorMessage: string;
}
const InputErrorMessage: React.FC<InputErrorMessageProps> = ({
  errorMessage,
  error,
}) => {
  return (
    <>{error && <div className=" mt-2 text-red-500">{errorMessage}</div>}</>
  );
};
export { InputErrorMessage };
