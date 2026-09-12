import ShellIcon from "@assets/ShellIcon.svg?react";
import React from "react";

interface BodyProps {
  remainingCredit: number | string;
}
const Body: React.FC<BodyProps> = ({ remainingCredit }) => {
  return (
    <>
      {" "}
      <span className="px-1">
        <p>credits: {remainingCredit}</p>
      </span>
      <span>
        <ShellIcon className=" fill-electric-violet mx-1 h-5 w-5" />
      </span>{" "}
    </>
  );
};

export { Body };
