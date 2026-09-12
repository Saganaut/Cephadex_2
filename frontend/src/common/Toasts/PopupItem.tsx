import DeckIcon from "@assets/DeckIcon.svg?react";
import GroupOctopusIcon from "@assets/GroupOctopusIcon.svg?react";
import QuizIcon from "@assets/QuizIcon.svg?react";
import { type NotificationsSchema } from "@source/client";
import React from "react";

import { useNotification } from "./useNotification";

interface PopupItemProps {
  closeToast?: () => void;
  toastProps?: any;
  notification: NotificationsSchema;
}

const PopupItem: React.FC<PopupItemProps> = ({
  closeToast,
  toastProps,
  notification,
}) => {
  const { timeCreated, handleClick } = useNotification(notification);

  return (
    <>
      <div
        className={
          "flex items-center  gap-x-[12px] p-[12px] text-tolopea dark:text-white"
        }
        onClick={handleClick}
      >
        {notification.notificationType === "group_invite" && (
          <GroupOctopusIcon className="h-[40px] w-[40px]" />
        )}
        {notification.notificationType === "deck_shared" && (
          <DeckIcon className="h-[40px] w-[40px]" />
        )}
        {notification.notificationType === "quiz_assigned" && (
          <QuizIcon className="h-[40px] w-[40px]" />
        )}
        <div className={"text-left"}>
          {/* <h1 className={"font-semibold"}>John Doe</h1> */}
          <p className={"text-[14px] font-medium"}>{notification.message}</p>
          <p className={"text-[10px] opacity-70"}>{timeCreated}</p>
        </div>
      </div>
    </>
  );
};
export { PopupItem };
