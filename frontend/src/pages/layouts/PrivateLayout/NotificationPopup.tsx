import { BellIcon } from "@heroicons/react/20/solid";
import React from "react";

interface NotificationPopUpProps {}
const NotificationPopUp: React.FC<NotificationPopUpProps> = () => {
  return (
    <>
      {" "}
      {/* <div
        className={
          "fixed right-0 top-[30%] flex w-[80px] cursor-pointer items-center gap-x-[20px] rounded-l-[46px] bg-electric-violet p-[8px] transition-all duration-300 ease-linear hover:w-[200px]"
        }
      >
        <div
          className={
            "relative flex min-h-[56px] min-w-[56px] items-center justify-center rounded-full bg-white"
          }
        >
          <BellIcon className={"w-[36px] resize text-electric-violet"} />
          <p
            className={
              "absolute right-[20%] top-[15px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-blaze-orange text-xs font-semibold  text-white"
            }
          >
            1
          </p>
        </div>
        <p
          className={
            "flex h-min w-full min-w-full items-center whitespace-nowrap rounded-l-full bg-blaze-orange px-[12px] py-[4px] font-medium text-white"
          }
        >
          Take Quiz
        </p>
      </div> */}
    </>
  );
};

export { NotificationPopUp };
