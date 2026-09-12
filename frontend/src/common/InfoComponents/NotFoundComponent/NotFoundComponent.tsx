import BottleAndFish from "@assets/message/BottleAndFish.svg?react";
import React from "react";

interface NotFoundComponentProps {
  title?: string;
  message?: string;
}

const NotFoundComponent: React.FC<NotFoundComponentProps> = ({
  title,
  message,
}) => {
  const compTitle = title ?? "404 - Page Not Found";
  const compMessage = message ?? "The page you are looking for does not exist.";

  return (
    <div className="mx-auto flex h-full items-center justify-center px-4 text-blaze-orange sm:px-0">
      <div>
        <h1 className="mb-4 flex justify-center p-2 text-xl sm:text-2xl">
          {compTitle}
        </h1>
        <div className="flex justify-center">
          <BottleAndFish className="w-full  text-xs sm:text-xl" />
        </div>
        <p className="mt-6 flex justify-center p-2 text-xs sm:text-xl ">
          {compMessage}
        </p>
      </div>
    </div>
  );
};
export { NotFoundComponent };
