import BellIcon from "@assets/BellIcon.svg?react";
import CloseIcon from "@assets/CloseIcon.svg?react";
import { Dialog, Transition } from "@headlessui/react";
import { Loading } from "@source/common/InfoComponents/Loading";
import { useFetchNotifications } from "@source/lib/hooks/notificationHooks/useFetchNotifications";
import React, { Fragment, useMemo, useState } from "react";

import { NotificationItem } from "./NotificationItem";

const NotificationBell: React.FC = () => {
  const { notifications, notificationsStatus } = useFetchNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const lengthUnread = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const sortedNotifications = useMemo(
    () =>
      notifications.sort(
        (b, a) =>
          new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()
      ),
    [notifications]
  );

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-electric-violet sm:h-12 sm:w-12"
      >
        <BellIcon className=" h-4 w-4 sm:h-[26px] sm:w-6" />
        {lengthUnread > 0 && (
          <span className="absolute right-[4px] top-[11px] flex h-3 w-3 items-center justify-center rounded-full border border-white bg-blaze-orange text-[10px] font-bold text-white sm:right-[4px] sm:top-[8px] sm:h-[18px] sm:w-[18px] sm:text-xs">
            <div className="ms-[1px]">
              {lengthUnread > 10 ? 9 : lengthUnread}
            </div>
          </span>
        )}
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as={"div"}
          className={
            "fixed inset-0 z-[500] flex h-screen w-full items-center justify-center overflow-y-auto"
          }
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className=" fixed inset-0 z-[200] cursor-pointer bg-black/80" />
          </Transition.Child>
          <div className="right-8 top-[100px] z-[250] h-[100vh] w-[100vh] overflow-y-auto sm:fixed sm:right-[100px] sm:h-auto sm:w-auto ">
            <div className="flex h-full items-center justify-center text-center sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={
                    " flex h-full w-full rounded-[18px] sm:items-center sm:justify-center"
                  }
                >
                  <div
                    className={
                      "custom-scrollbar mx-auto h-full w-full overflow-auto rounded-md bg-mariana-blue  px-[20px] py-[24px] text-white sm:max-h-[60vh]"
                    }
                  >
                    {/*   Header */}
                    <div
                      className={"mb-[20px] flex items-center gap-x-[200px]"}
                    >
                      <h1>Notifications</h1>
                      <CloseIcon
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        className={
                          "h-[14px] w-[14px] cursor-pointer fill-white"
                        }
                      />
                    </div>
                    {/*   Body */}
                    {/*   Item */}
                    {notificationsStatus === "loading" && (
                      <Loading size="small" />
                    )}
                    {notificationsStatus === "failed" && (
                      <p>Failed to load notifications</p>
                    )}
                    {notificationsStatus === "succeeded" &&
                      sortedNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                        />
                      ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          <CloseIcon
            onClick={() => {
              setIsOpen(false);
            }}
            className={
              "absolute bottom-[20px] z-[9999] h-[14px] w-[14px] cursor-pointer fill-gray-500 hover:fill-white hover:text-white hover:dark:fill-white sm:hidden "
            }
          />
        </Dialog>
      </Transition>
    </>
  );
};
export { NotificationBell };
