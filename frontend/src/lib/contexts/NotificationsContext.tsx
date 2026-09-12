import { NotificationsModal } from "@common/Modals/NotificationsModal";
import React, { createContext, useContext, useState } from "react";

interface NotificationsContextProps {
  isNotificationsModalOpen: boolean;
  openNotificationsModal: () => void;
  closeNotificationsModal: () => void;
  setIsNotificationsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const NotificationsContext = createContext<
  NotificationsContextProps | undefined
>(undefined);

interface NotificationsProviderProps {
  children: React.ReactNode;
}
const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const openNotificationsModal = (): void => {
    setIsNotificationsModalOpen(true);
  };
  const closeNotificationsModal = (): void => {
    setIsNotificationsModalOpen(false);
  };

  return (
    <NotificationsContext.Provider
      value={{
        isNotificationsModalOpen,
        openNotificationsModal,
        closeNotificationsModal,
        setIsNotificationsModalOpen,
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};

const useNotificationsModal = (): NotificationsContextProps => {
  return useContext(NotificationsContext) as NotificationsContextProps;
};

export { NotificationsProvider };
export { NotificationsContext };
export { useNotificationsModal };
