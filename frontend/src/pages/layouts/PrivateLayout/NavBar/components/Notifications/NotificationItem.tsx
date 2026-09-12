import DeckIcon from "@assets/DeckIcon.svg?react";
import GroupOctopusIcon from "@assets/GroupOctopusIcon.svg?react";
import QuizIcon from "@assets/QuizIcon.svg?react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { type NotificationsSchema } from "@source/client";
import { NotificationDropdown } from "@source/common/DropdownMenu/NotificationDropdown";
import React from "react";

import { useNotification } from "../../../../../../common/Toasts/useNotification";

interface NotificationItemProps {
  notification: NotificationsSchema;
}
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { timeCreated, handleClick } = useNotification(notification);

  return (
    <>
      {" "}
      {/* <Link to={fullLink}> */}
      <div
        className={
          "mt-[6px] flex cursor-pointer items-center justify-between rounded-xl p-2 hover:bg-mariana-blue-100"
        }
        onClick={handleClick}
      >
        {/* Content */}
        <div className={"flex items-center gap-x-[12px]"}>
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
            {/* <h1 className={"text-[13px] font-semibold"}>John Doe</h1> */}
            <p className={"text-[11px] font-medium"}>{notification.message}</p>
            <p className={"text-[10px] opacity-70"}>{timeCreated}</p>
          </div>
        </div>

        {/*   CTA */}

        <div className={"flex items-center gap-x-[10px]"}>
          {/*   Seen/unseen */}
          {!notification.read && (
            <span
              className={"block h-[8px] w-[8px] rounded-full bg-blaze-orange"}
            />
          )}
          <NotificationDropdown notification={notification} />
          {/* <ChevronRightIcon className={"h-[20px] w-[20px]"} /> */}
        </div>
      </div>
      {/* </Link> */}
    </>
  );
};

export { NotificationItem };
