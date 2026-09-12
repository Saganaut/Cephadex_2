import CephaDeckReady from "@assets/CephaDeckReady.svg";
import { Button } from "@source/common/Buttons/Button";
import React from "react";
import { Link } from "react-router-dom";

import { ModalWrapper } from "../ModalWrapper";

interface InsufficientCreditModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

const InsufficientCreditModal: React.FC<InsufficientCreditModalProps> = ({
  isOpen,
  setIsOpen,
  setIsClosed,
}) => {
  return (
    <>
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="max-w-lg rounded-xl border-2 border-white bg-tolopea p-4">
          <div className="flex justify-center">
            {" "}
            <img
              src={CephaDeckReady}
              alt="Cepha Deck Ready"
              className=" max-h-[100px] max-w-[100px] rounded-full"
            />
          </div>

          <div className="mt-2 flex justify-center text-blaze-orange">
            Not enough credits!
          </div>
          <div className="text-aquamarine  ">
            <p>
              Okay so this is a bit awkward... and I really hate to be the
              bearer of bad news, but we have bills to pay and you don`&apos;`t
              have enough credits to create this deck.{" "}
            </p>{" "}
            <p>
              You can try creating a deck using a different source or{" "}
              <Link to="/upgrade" className="text-blaze-orange underline">
                upgrade your account.
              </Link>
            </p>
            <p>
              If you choose to upgrade your account know that if you are not
              happy with it you can cancel within a week and get a full refund!
            </p>
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => {
                setIsClosed(false);
              }}
              label="Close"
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};

export { InsufficientCreditModal };
