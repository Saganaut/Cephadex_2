import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import React from "react";

interface DeleteButtonEditProps {
  onClick: () => void;
}
const DeleteButtonEdit: React.FC<DeleteButtonEditProps> = ({ onClick }) => {
  return (
    <button
      className={"flex flex-col items-center justify-center"}
      onClick={onClick}
      type="button"
    >
      <div
        className={
          "flex h-[48px] w-[48px] items-center justify-center rounded-full bg-mariana-blue hover:bg-blaze-orange"
        }
      >
        <DeleteIcon fill="white" className={"h-[28px] w-[28px] text-white "} />
      </div>
      <p
        className={
          "hidden py-2 font-medium dark:text-white text-tolopea sm:block"
        }
      >
        Delete
      </p>
    </button>
  );
};

export { DeleteButtonEdit };
