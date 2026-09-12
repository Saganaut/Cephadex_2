import CloseIcon from "@assets/CloseIcon.svg?react";
import Avatar from "@assets/UserAvatar.svg?react";
import { type NotificationsSchema } from "@source/client/models/NotificationsSchema";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface PopupProps {
  notification: NotificationsSchema;
  closeToast: () => void;
  toastProps: any;
}

const Popup: React.FC<PopupProps> = ({
  notification,
  closeToast,
  toastProps,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        toggle
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={"fixed bottom-[60px] left-[24px]"}
          >
            <div
              className={
                "rounded-[4px] border-[1px] border-white bg-tolopea  px-[16px] py-[14px]"
              }
            >
              <CloseIcon
                onClick={() => {
                  setIsOpen(false);
                }}
                className={
                  "absolute right-[12px] top-[12px] h-[10px] w-[10px] cursor-pointer fill-white"
                }
              />
              <div className={"flex items-center gap-x-[12px] text-white"}>
                <Avatar className="h-[40px] w-[40px]" />
                <div className={"text-left"}>
                  <h1 className={"font-semibold"}>John Doe</h1>
                  <p className={"text-[14px] font-medium"}>
                    {/* {notification.message} */} message
                  </p>
                  <p className={"text-[10px] opacity-70"}>Just now</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export { Popup };
