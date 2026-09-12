import CephCircleTie from "@assets/bubbles/CephCircleTie.png";
import CephCircleUnsure from "@assets/bubbles/CephCircleUnsure.png";
import { Button } from "@source/common/Buttons/Button";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";

interface DeleteConfirmationModalProps {
  handleDelete: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  message: string;
  type?: "submit" | "delete";
}
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  handleDelete,
  isOpen,
  setIsOpen,
  title,
  message,
  type,
}) => {
  const label = type === "submit" ? "Submit" : "Delete";

  const image = type === "submit" ? CephCircleTie : CephCircleUnsure;
  return (
    <>
      {" "}
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={"flex flex-col items-center sm:px-[62px] sm:py-[30px]"}>
          <img src={image} alt='Cephadex Delete' className={"size-[100px]"} />
          <h1
            className={
              "max-w-[250px] pt-2 text-[18px] font-semibold text-tolopea dark:text-aquamarine"
            }>
            {title}
          </h1>
          <p
            className={
              "max-w-[250px] pt-2 text-center text-[16px] font-normal "
            }>
            {" "}
            {message}{" "}
          </p>
          <div className={"flex w-full justify-between gap-x-[60px] pt-[28px]"}>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              className={
                "border-2 border-white bg-electric-violet-200 px-[35px] py-[8px] text-[18px] dark:bg-transparent"
              }
              label={"Cancel"}
            />
            <Button
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                handleDelete();
              }}
              label={label}
              className={
                "border-2 border-blaze-orange px-[35px]  py-[8px] text-[18px]"
              }
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};

export { DeleteConfirmationModal };
