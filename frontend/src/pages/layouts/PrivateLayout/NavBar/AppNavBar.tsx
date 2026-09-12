import AccountIcon from "@assets/cardMenuIcons/AccountIcon.svg?react";
import SignOutIcon from "@assets/cardMenuIcons/SignOutIcon.svg?react";
import FeedbackBottleIcon from "@assets/FeedbackBottleIcon.svg?react";
// import UpgradeIcon from "@assets/UpgradeIcon.svg";
import Avatar from "@assets/UserAvatar.svg?react";
import { DropdownMenu } from "@common/DropdownMenu";
import { ThemeToggle } from "@common/ThemeToggle";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { NotificationBell } from "@layouts/PrivateLayout/NavBar/components/Notifications/NotificationBell";
import { useFeedbackModal } from "@source/lib/contexts/FeedbackContext";
import { useAppDispatch } from "@source/lib/store/hooks";
import { logoutUser } from "@source/lib/store/user/actions";
// import { useNotificationsModal } from "@source/lib/contexts/NotificationsContext";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavBarAppProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isTransparent?: boolean;
}
const NavBarApp: React.FC<NavBarAppProps> = ({
  isSidebarOpen,
  toggleSidebar,
  isTransparent,
}) => {
  const { pathname } = useLocation();
  const { openFeedbackModal } = useFeedbackModal();
  const dispatch = useAppDispatch();
  // const { openNotificationsModal } = useNotificationsModal();
  const navigate = useNavigate();

  const signOut = async (): Promise<void> => {
    await dispatch(logoutUser());
    navigate("/logged-out");
  };

  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.body.classList.contains("dark");
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true, // configure it to listen to attribute changes
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  const links = [
    {
      label: "Account",
      type: "top",
      icon: AccountIcon,
      onClick: () => {
        navigate("/account");
      },
    },
    {
      href: null,
      label: "Feedback",
      type: "bottom",
      icon: FeedbackBottleIcon,
      onClick: openFeedbackModal,
    },
    // {
    //   label: "Notifications",
    //   type: "bottom",
    //   icon: FeedbackBottleIcon,
    //   onClick: openNotificationsModal,
    // },
    {
      label: "Sign out",
      type: "bottom",
      icon: SignOutIcon,
      onClick: signOut,
    },
  ];

  return (
    <>
      <header className={`fixed z-30 h-24 w-full `}>
        <div className=' mx-4 mt-4 flex items-center justify-between md:mx-9 md:mt-8'>
          <Bars3Icon
            onClick={toggleSidebar}
            className='sidebar hover:cursor size-8 cursor-pointer text-electric-violet-900 dark:text-white lg:hidden'
          />
          <div className={"hidden items-center gap-x-[54px] sm:flex"}>
            {/* {pathname === "/account" && (
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
            )}
            {pathname.startsWith("/study/deck") && (
              <>
                <IconButton
                  collapse={false}
                  theme={"violet"}
                  icon={<ChevronDoubleLeftIcon />}
                  onClick={() => {}}
                  ariaLabel={"Go Back"}
                  to={"/study"}
                />
                <NavBarButtonCreate />
              </>
            )} */}
          </div>
          <div id='navbar' className='flex gap-6'>
            <NotificationBell />

            <ThemeToggle />
            <div className={"relative h-8 sm:hidden"}>
              <DropdownMenu
                type='User'
                button={<Avatar width={32} height={32} />}
                links={links}
              />
            </div>
            <div className={"relative mr-[54px] hidden sm:block"}>
              <DropdownMenu
                type='User'
                button={<Avatar width={48} height={48} />}
                links={links}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export { NavBarApp };
