import ChatbotIcon from "@assets/Chatbot.svg";
import React from "react";

interface ChatbotToggleProps {
  setOpenChatModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const ChatbotToggle: React.FC<ChatbotToggleProps> = ({ setOpenChatModal }) => {
  return (
    <>
      {" "}
      <div
        className={
          "sm:right-30 fixed right-[-34px] top-[70px] z-[100] flex  w-[80px] cursor-pointer items-center gap-x-[20px] rounded-l-[46px] bg-electric-violet p-[8px] transition-all duration-300 ease-linear hover:w-[180px] sm:hover:w-[200px] md:top-1/4 lg:right-[-20px]"
        }>
        <div
          id='chat-bot-toggle'
          className={
            "relative flex min-w-[30px] items-center justify-center rounded-full bg-white sm:min-h-[42px] sm:min-w-[42px]"
          }>
          <img src={ChatbotIcon} className={"hidden sm:block sm:w-[42px] "} />
          <img
            src={ChatbotIcon}
            onClick={() => {
              setOpenChatModal(true);
            }}
            className={"sm:hidden sm:w-[42px] "}
          />
        </div>
        <p
          onClick={() => {
            setOpenChatModal(true);
          }}
          className={
            "flex h-min w-full min-w-full items-center whitespace-nowrap rounded-l-full bg-blaze-orange px-[12px] py-[4px] font-medium text-white"
          }>
          Ask Ceph
        </p>
      </div>
    </>
  );
};

export { ChatbotToggle };
