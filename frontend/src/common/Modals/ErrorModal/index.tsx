import CephCircleSad from "@assets/bubbles/CephCircleSad.png";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";

interface ErrorModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  setIsOpen,
  message,
  title,
}) => {
  return (
    <>
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div
          className={
            " relative mx-auto flex flex-col items-center px-[62px]  py-[30px] sm:min-w-[30vw] sm:max-w-[60vw]"
          }
        >
          <div className="flex justify-center">
            <img
              src={CephCircleSad}
              alt="Cepha Deck Ready"
              className=" max-h-[100px] max-w-[100px] rounded-full"
            />
          </div>

          <div className="mt-2 flex justify-center text-blaze-orange">
            {title}
          </div>
          <div className="text-tolopea dark:text-aquamarine">
            <p>{message}</p>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};

export { ErrorModal };
