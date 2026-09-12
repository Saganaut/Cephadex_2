import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

interface ConfirmButtonProps {
  onClick?: () => void;
}
const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onClick }) => {
  return (
    <button
      type={"submit"}
      className={"flex flex-col items-center justify-center"}
      onClick={onClick}>
      <div
        className={
          "flex size-[48px] items-center justify-center rounded-full bg-mariana-blue hover:bg-blaze-orange"
        }>
        <CheckIcon className={"size-[28px] text-white"} />
      </div>
      <p
        className={
          "hidden py-2 font-medium text-tolopea dark:text-white sm:block"
        }>
        Confirm
      </p>
    </button>
  );
};

export { ConfirmButton };
