// import "react-toastify/dist/ReactToastify.css";
import "@source/styles/toastify.css";

import { type NotificationsSchema } from "@source/client";
import { PopupItem } from "@source/common/Toasts/PopupItem";
import { PopupItemSimple } from "@source/common/Toasts/PopupItemSimple";
import { useAppDispatch } from "@source/lib/store/hooks";
import { checkNewNotifications } from "@source/lib/store/notifications/actions";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { toast, ToastContainer } from "react-toastify";

interface FrenchToast {
  id?: string;
  type?: string;
  img?: any;
  message: string;
  timeCreated?: string;
  title: string;
  onClick?: () => void;
}

interface ToastContextProps {
  postToast: (toastItemProps: FrenchToast) => void;
}

interface ToastContextProviderProps {
  children: React.ReactNode;
}
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

const ToastContextProvider: React.FC<ToastContextProviderProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const notify = useCallback((notification: NotificationsSchema) => {
    toast(<PopupItem notification={notification} />, {});
  }, []);

  const postToast = useCallback((toastItemProps: FrenchToast) => {
    toast(<PopupItemSimple frenchToast={toastItemProps} />, {
      containerId: "toastContainer",
    });
  }, []);

  useEffect(() => {
    const checkNotifications = async (): Promise<void> => {
      try {
        const response = await dispatch(checkNewNotifications()).unwrap();
        if (
          response.notifications != null &&
          Array.isArray(response.notifications)
        ) {
          response.notifications.forEach(
            (notification: NotificationsSchema) => {
              notify(notification);
            }
          );
        }
      } catch (error) {}
    };

    const interval = setInterval(() => {
      void checkNotifications();
    }, 300000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, notify]);

  return (
    <ToastContext.Provider value={{ postToast }}>
      {children}
      <ToastContainer
        position="bottom-right"
        containerId="loadingSpinner"
        stacked
        // limit={1}
        autoClose={500}
      />
      <ToastContainer
        toastClassName="relative flex p-1 min-h-10 rounded-md overflow-hidden cursor-pointer"
        bodyClassName={() => "text-sm font-white font-med block "}
        position="bottom-left"
        limit={1}
        autoClose={3000}
        containerId="toastContainer"
      />
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastContextProvider");
  }
  return context;
};

export { ToastContextProvider, useToast };
