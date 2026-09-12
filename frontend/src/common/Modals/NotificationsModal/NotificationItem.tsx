import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import { type NotificationsSchema } from "@source/client";
import { formatDate } from "@utils/functions";
import React from "react";
import { Link } from "react-router-dom";

const typeMapping: Record<string, string> = {
  deck_shared: "Deck shared",
  quiz_assigned: "Quiz shared",
  group_invite: "Group invite",
};

const linkMapping: Record<string, string> = {
  deck_shared: "/deck/shared/",
  quiz_assigned: "/quiz/shared/",
  group_invite: "/group",
};

interface NotificationItemProps {
  notification: NotificationsSchema;
}
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const generatedLink =
    linkMapping[notification.notificationType] + notification.shareId;
  return (
    <>
      <Link to={generatedLink}>
        <div className="flex  rounded-xl bg-electric-violet-200 px-2 py-1 text-white">
          <span className="w-[15%] px-2">
            {typeMapping[notification.notificationType]}
          </span>
          <h5 className="w-[50%] cursor-pointer hover:text-blaze-orange">
            {notification.message}
          </h5>
          <span> {formatDate(notification.timeCreated)}</span>
          <div className=" flex">
            <DeleteIcon className=" h-5 w-5" />
          </div>
        </div>
      </Link>
    </>
  );
};

export { NotificationItem };
