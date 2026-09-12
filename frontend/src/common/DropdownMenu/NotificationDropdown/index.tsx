// import { getBasicLinks, getGroupLinks, getPublicLinks } from "./data/links";
import DeleteIcon from "@assets/cardMenuIcons/DeleteIcon.svg?react";
import ShareIcon from "@assets/cardMenuIcons/ShareIcon.svg?react";
import { type NotificationsSchema } from "@source/client";
import { DropdownMenu } from "@source/common/DropdownMenu";
import { EllipsisMenuButton } from "@source/common/DropdownMenu/components/EllipsisMenuButton";
import { useNotification } from "@source/common/Toasts/useNotification";
import React from "react";

interface NotificationDropdownProps {
  notification: NotificationsSchema;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notification,
}) => {
  const { markRead, delNotification } = useNotification(notification);

  const links = [
    {
      label: "Mark as read",
      type: "middle",
      icon: ShareIcon,
      onClick: markRead,
    },
    {
      label: "Delete",
      icon: DeleteIcon,
      type: "",
      onClick: delNotification,
    },
  ];

  return (
    <>
      {" "}
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <DropdownMenu
          type="Deck"
          button={<EllipsisMenuButton />}
          links={links}
        />
      </div>
    </>
  );
};

export { NotificationDropdown };

// // Here we finish constructing the links adding in the groupId, deckId and boolean.
