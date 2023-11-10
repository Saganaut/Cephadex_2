import { NavBarButtonCreate } from "@layouts/PrivateLayout//NavBar/NavBarButtons";
import { ThemeToggle } from "@common/ThemeToggle";
import UpgradeIcon from "@assets/UpgradeIcon.svg";
import Avatar from "@assets/UserAvatar.svg";
import { PreferencesSelect } from "@common/Form/PreferencesSelect";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@account/IconButton";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavBarAppProps {
  isSidebarOpen: boolean;
}

const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Decks",
    value: "decks",
  },
  {
    label: "Quizzes",
    value: "quizzes",
  },
  {
    label: "Saved",
    value: "saved",
  },
];
const NavBarApp: React.FC<NavBarAppProps> = ({ isSidebarOpen }) => {
  const { pathname } = useLocation();

  return (
    <header
      className={` ${
        isSidebarOpen ? "w-[calc(100vw-220px)]" : "w-[calc(100vw-110px)]"
      }  fixed right-0 top-0 z-[20] mt-[64px] transition-all duration-300`}
    >
      <div className={"ml-auto flex w-full justify-between px-[60px]"}>
        {/*   LEFT  */}
        <div className={"flex items-center gap-x-[54px]"}>
          {pathname === "/account" ? (
            <>
              <IconButton
                collapse={false}
                theme={"violet"}
                icon={<ChevronDoubleLeftIcon />}
                onClick={() => {}}
                ariaLabel={"Go Back"}
                to={"/"}
              />
              <NavBarButtonCreate />
            </>
          ) : (
            <>
              <PreferencesSelect label={""} options={options} />
            </>
          )}
        </div>
        {/*   RIGHT */}
        <div className={"flex items-center gap-x-[54px]"}>
          <IconButton
            collapse={false}
            theme={"cyan"}
            icon={UpgradeIcon}
            onClick={() => {}}
            ariaLabel={"Upgrade"}
            to={"/upgrade"}
          />
          <ThemeToggle />
          <Link to={"/account"}>
            <img
              src={Avatar}
              alt="avatar-img"
              className={"h-[44px] w-[44px]"}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export { NavBarApp };
