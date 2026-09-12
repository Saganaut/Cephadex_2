import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import React from "react";

import { IconButtonWrapper } from ".";

interface DeleteButtonProps {
  onClick: () => void;
  style: "depths" | "shallows" | "vivid";
  tooltip?: string;
}
const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  style,
  tooltip,
}) => {
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
        className={`flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full p-[4px] ${className} `}
        onClick={onClick}
      >
        <DeleteIcon className={`${fillClass} `} />
      </div>
    </IconButtonWrapper>
  );
};

export { DeleteButton };
