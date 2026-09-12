import { type NotificationsSchema } from "@source/client";
import { useAppDispatch } from "@source/lib/store/hooks";
import {
  deleteNotification,
  markAsRead,
} from "@source/lib/store/notifications/actions";
import { timeSinceNotification } from "@source/lib/utils/functions";
import { useNavigate } from "react-router-dom";

const useNotification = (
  notification: NotificationsSchema
): {
  timeCreated: string;
  handleClick: () => void;
  delNotification: () => void;
  markRead: () => void;
} => {
  const timeCreated = timeSinceNotification(notification.timeCreated);
  const dispatch = useAppDispatch();

  const linkStart =
    notification.notificationType === "group_invite"
      ? "/groups/invitation/"
      : notification.notificationType === "deck_shared"
      ? "/deck/shared/"
      : "/quiz/shared?shareId=";
  const fullLink = linkStart + notification.shareId;
  const navigate = useNavigate();

  const handleClick = (): void => {
    void dispatch(markAsRead(notification));

    navigate(fullLink);
  };

  const markRead = (): void => {
    void dispatch(markAsRead(notification));
  };

  const delNotification = (): void => {
    void dispatch(deleteNotification(notification));
  };

  return { timeCreated, handleClick, delNotification, markRead };
};
export { useNotification };
