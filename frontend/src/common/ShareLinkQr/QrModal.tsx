import React from "react";

import { ModalWrapper } from "../Modals/ModalWrapper";

interface QrModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  qrImage: string;
  qrDownload: () => void;
}

// TODO: probably not actually necessary
const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  setIsOpen,
  qrImage,
  qrDownload,
}) => {
  return (
    <>
      {" "}
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={"flex flex-col items-center justify-center"}>
          <img src={qrImage} alt={"qr-code"} />
          <div className={"mt-4 flex gap-4"}>
            <button onClick={qrDownload} className="">
              Download
            </button>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};

export { QrModal };
