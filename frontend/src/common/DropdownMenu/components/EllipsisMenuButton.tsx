import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";
import React, { type ReactElement } from "react";

const EllipsisMenuButton = (): ReactElement => {
  return (
    <>
      {" "}
      <EllipsisVerticalIcon
        className={
          "relative h-[24px] w-[24px] rounded-full dark:text-white text-tolopea hover:rounded-full  hover:text-blaze-orange"
        }
      />
    </>
  );
};

export { EllipsisMenuButton };
