import { NavBarButtonCreate } from "@app/Dashboard/NavBar/NavBarButtons";
import { NavBarUpgradeLink } from "@app/Dashboard/SideBar/SideBarLink";
import { ThemeToggle } from "@app/ThemeToggle";
import Avatar from "@assets/UserAvatar.svg";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import React from "react";

const NavBarApp: React.FC = () => {
  return (
    <header className="relative left-1/2 right-0 top-0 mt-[64px] w-full -translate-x-1/2 items-center  rounded-bl-3xl">
      <div
        className={
          "ml-auto flex w-full max-w-[1250px] justify-between px-[60px]"
        }
      >
        {/*   LEFT  */}
        <div className={"flex items-center gap-x-[54px]"}>
          <button
            className={
              "flex items-center gap-x-[10px] rounded-full bg-electric-violet p-[8px]"
            }
          >
            <div
              className={
                "flex h-[42px] w-[42px] items-center justify-center rounded-full bg-gray-200"
              }
            >
              <ChevronDoubleLeftIcon className={"h-[24px] w-[24px]"} />
            </div>
            <span className={"pr-4 text-white"}>Go Back</span>
          </button>

          <NavBarButtonCreate />
        </div>
        {/*   RIGHT */}
        <div className={"flex items-center gap-x-[54px]"}>
          <NavBarUpgradeLink />
          <ThemeToggle />
          <img src={Avatar} alt="avatar-img" className={"h-[44px] w-[44px]"} />
        </div>
      </div>
    </header>
  );
};

export { NavBarApp };
