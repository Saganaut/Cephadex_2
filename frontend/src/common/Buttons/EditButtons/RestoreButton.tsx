import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React from "react";

interface RestoreButtonProps {
  onClick: () => void;
}
const RestoreButton: React.FC<RestoreButtonProps> = ({ onClick }) => {
  return (
    <button
      type={"reset"}
      onClick={onClick}
      className={"flex flex-col items-center justify-center"}
    >
      <div
        className={
          "flex h-[48px] w-[48px] items-center justify-center rounded-full bg-mariana-blue hover:bg-blaze-orange"
        }
      >
        <ArrowPathIcon className={"h-[28px] w-[28px] text-white"} />
      </div>
      <p
        className={
          "py-2 font-medium dark:text-white text-tolopea hidden sm:block"
        }
      >
        Restore
      </p>
    </button>
  );
};

export { RestoreButton };
