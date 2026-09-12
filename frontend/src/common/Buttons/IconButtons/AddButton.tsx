import PlusIcon from "@assets/PlusIcon.svg?react";
import React from "react";

import { IconButtonWrapper } from ".";

interface AddButtonProps {
  onClick: () => void;
  style: "depths" | "shallows" | "vivid";
  tooltip?: string;
}
const AddButton: React.FC<AddButtonProps> = ({ onClick, style, tooltip }) => {
  const className =
    style === "depths"
      ? "bg-tolopea hover:bg-electric-violet  "
      : style === "vivid"
      ? "bg-aquamarine hover:bg-electric-violet  "
      : "bg-mariana-blue-100 hover:bg-electric-violet ";

  const fillClass =
    style === "depths"
      ? "fill-white"
      : style === "vivid"
      ? "fill-electric-violet hover:fill-white"
      : "fill-aquamarine";

  return (
    <IconButtonWrapper>
      <div
        className={`flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full ${className} `}
        onClick={onClick}
      >
        <PlusIcon className={`${fillClass}`} />
      </div>
    </IconButtonWrapper>
  );
};

export { AddButton };
