import { type NotificationsSchema } from "@source/client/models/NotificationsSchema";
import { useAppDispatch, useAppSelector } from "@source/lib/store/hooks";
import { fetchNotifications } from "@source/lib/store/notifications/actions";
import { selectAllNotifications } from "@source/lib/store/notifications/notificationsSlice";
import { useEffect } from "react";

const useFetchNotifications = (): {
  notifications: NotificationsSchema[];
  notificationsStatus: "idle" | "loading" | "succeeded" | "failed";
} => {
  const notificationsStatus = useAppSelector(
    (state) => state.notifications.status
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (notificationsStatus === "succeeded") {
      return;
    }
    if (notificationsStatus === "idle") {
      void dispatch(fetchNotifications());
    }
  }, [notificationsStatus, dispatch]);

  const notifications = useAppSelector(selectAllNotifications);
  return { notifications, notificationsStatus };
};

export { useFetchNotifications };
