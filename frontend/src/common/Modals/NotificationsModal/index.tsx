import { BottomModalWrapper } from "@common/Modals/BottomModalWrapper";
import { useNotificationsModal } from "@source/lib/contexts/NotificationsContext";
import { useAppSelector } from "@source/lib/store/hooks";
import { selectAllNotifications } from "@source/lib/store/notifications/notificationsSlice";
import React from "react";

import { NotificationsContainer } from "./NotificationsContainer";

const NotificationsModal: React.FC = () => {
  const {
    isNotificationsModalOpen,
    openNotificationsModal,
    setIsNotificationsModalOpen,
  } = useNotificationsModal();
  const notifications = useAppSelector(selectAllNotifications);
  return (
    <BottomModalWrapper
      isOpen={isNotificationsModalOpen}
      setIsOpen={openNotificationsModal}
      bgColor={"bg-mariana-blue"}
      onModalClose={() => {
        setIsNotificationsModalOpen(false);
      }}
    >
      <div
        className={"mx-auto mt-[64px] h-[80%] w-[80%] rounded-2xl   text-white"}
      >
        <h1> Your notifications </h1>
        <div className="h-full w-full overflow-hidden rounded-2xl border-2 border-red-500">
          <NotificationsContainer notificationsList={notifications} />
        </div>
      </div>
    </BottomModalWrapper>
  );
};

export { NotificationsModal };
