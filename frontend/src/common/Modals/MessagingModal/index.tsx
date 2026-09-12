import CephCircleHappy from "@assets/bubbles/CephCircleHappy.png";
import CephCircleSad from "@assets/bubbles/CephCircleSad.png";
import { useMessagingModal } from "@source/lib/contexts/MessagingContext";
import React from "react";

import { ModalWrapper } from "../ModalWrapper";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";

const MessagingModal: React.FC = () => {
  const { modalState } = useMessagingModal();
  const { setIsMessageModalOpen } = useMessagingModal();
  const {
    isOpen,
    message,
    img,
    title,
    type,
    optionalProps,
    withFooter = false,
  } = modalState;

  const messagingImg =
    img.length === 0
      ? type === "error"
        ? CephCircleSad
        : CephCircleHappy
      : img;
  const messagingTitle =
    title.length === 0 ? "We just wanted to let you know..." : title;

  return (
    <>
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsMessageModalOpen}>
        <div
          className={
            " relative mx-auto flex flex-col items-center px-[62px]  py-[30px] sm:min-w-[30vw] sm:max-w-[60vw]"
          }
        >
          <Header img={messagingImg} title={messagingTitle} />
          <Body
            type={type}
            optionalProps={optionalProps}
            message={message}
            setIsMessageModalOpen={setIsMessageModalOpen}
          />
          {withFooter && <Footer setIsOpen={setIsMessageModalOpen} />}
        </div>
      </ModalWrapper>
    </>
  );
};

export { MessagingModal };
