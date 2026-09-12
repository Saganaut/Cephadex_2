import { type NotificationsSchema } from "@source/client";
import React from "react";

import { NotificationItem } from "./NotificationItem";

interface NotificationsContainerProps {
  notificationsList: NotificationsSchema[];
}

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
  notificationsList,
}) => {
  return (
    <div className="h-full w-full bg-white p-4">
      {" "}
      {notificationsList.map((notification) => (
        <div key={notification.id} className="py-1">
          <NotificationItem notification={notification} />
        </div>
      ))}
    </div>
  );
};

export { NotificationsContainer };
