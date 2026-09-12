import React, { type ReactElement, type ReactNode, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const ErrorBoundaryComponent = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const ErrorFallback = ({ error }: { error: any }): ReactElement => {
    // we can customize the UI as we want
    return (
      <div
        className={
          "flex h-[100vh] w-full items-center justify-center bg-black text-white"
        }
      >
        <h2>
          Oops! An error occurred
          <br />
          <br />
          {error.message}
        </h2>
        {/* Additional custom error handling */}
      </div>
    );
  };
  const logError = (error: any): void => {
    setErrorMessage(error.message);

    // we can also send the error to a logging service
  };

  const handleResetError = (): void => {
    setErrorMessage("");
    // additional logic to perform code cleanup and state update actions
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <ErrorBoundary
      onError={logError}
      onReset={handleResetError}
      FallbackComponent={ErrorFallback}
    >
      {children}
    </ErrorBoundary>
  );
};
