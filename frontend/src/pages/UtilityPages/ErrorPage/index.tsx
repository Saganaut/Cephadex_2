import { ErrorMessage } from "@source/common/InfoComponents/ErrorMessage";
import React from "react";

interface ErrorPageProps {
  error: Error;
}
const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  const errorTitle = "Error - " + error.message;
  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-tolopea">
      <ErrorMessage title={"Error"} />
    </div>
  );
};

export { ErrorPage };
