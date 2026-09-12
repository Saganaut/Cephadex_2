import NothingHere from "@assets/message/NothingHere.svg?react";
import React from "react";

interface CricketsProps {
  message?: string;
  type?: string;
  style?: string;
}
const Crickets: React.FC<CricketsProps> = ({ message, type, style }) => {
  return (
    <div className="mx-auto flex h-full grow items-center justify-center">
      <div className="mx-auto  text-center text-blaze-orange">
        <div className="flex items-center justify-center  ">
          <NothingHere className="max-h-[100px] max-w-[80vw] sm:max-h-none " />
        </div>
        <div className="mt-6 text-xs sm:text-xl ">
          {message ?? "It seems there is nothing here..."}
        </div>
      </div>
    </div>
  );
};

export { Crickets };
