import { TermsAndConditions } from "@source/pages/Terms/components/TermsAndConditions";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";

interface TermsModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const TermsModal: React.FC<TermsModalProps> = ({ isOpen, setIsOpen }) => {
  return (
    <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        className={
          "mx-auto h-[90vh] w-[90vw] overflow-auto py-12 dark:text-white lg:px-[63px] xl:px-[126px]"
        }
      >
        <TermsAndConditions />
      </div>
    </ModalWrapper>
  );
};

export { TermsModal };
