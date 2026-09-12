import CommunityIcon from "@assets/CommunityIcon.svg";
import CreateIcon from "@assets/CreateIcon.svg";
import DeckIcon from "@assets/DeckIcon.svg";
import DisplayClose from "@assets/DisplayClose.svg?react";
import DisplayOpen from "@assets/DisplayOpen.svg?react";
import GameIcon from "@assets/GameIcon.svg";
import GroupOctopusIcon from "@assets/GroupOctopusIcon.svg";
import CephadexLogoSix from "@assets/logos/CephadexLogoSix.png";
import CephadexLogoWhite from "@assets/logos/CephadexLogoWhite.svg";
import LogoInvisibleBackground from "@assets/logos/LogoInvisibleBackground.svg";
import LogoWithTitle from "@assets/logos/LogoWithTitle.svg";
import QuizIcon from "@assets/QuizIcon.svg";
import StudyIcon from "@assets/StudyIcon.svg";
import UpgradeIcon from "@assets/UpgradeIcon.svg";
import { IconButton } from "@source/common/Buttons/IconButton";
import React from "react";
import { Link } from "react-router-dom";

const LINKS = [
  {
    title: "Create",
    href: "/create-deck",
    img: CreateIcon,
    id: "sidebar-create-deck",
  },
  {
    title: "Decks",
    href: "/decks",
    img: DeckIcon,
    id: "sidebar-decks",
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    img: QuizIcon,
    id: "sidebar-quizzes",
  },
  {
    title: "Study",
    href: "/study",
    img: StudyIcon,
    id: "sidebar-study",
  },
  {
    title: "Play",
    href: "/game",
    img: GameIcon,
    id: "sidebar-play",
  },
  {
    title: "Groups",
    href: "/groups",
    img: GroupOctopusIcon,
    id: "sidebar-groups",
  },
  {
    title: "Community",
    href: "/community",
    img: CommunityIcon,
    id: "sidebar-community",
  },
];

interface SideBarAppProps {
  isSidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  banner: boolean;
  sideBarRef: React.RefObject<HTMLDivElement>;
}
const SideBarApp: React.FC<SideBarAppProps> = ({
  isSidebarOpen,
  setSidebarOpen,
  banner,
  sideBarRef,
}) => {
  const toggleSidebar: () => void = () => {
    setSidebarOpen((prev) => !prev);
  };
  const path = window.location.pathname;
  const bannerHeight = banner ? " sm:mt-2 mt-12 " : "mt-0";

  // TODO for some reason teh tailwind config colors is not working
  return (
    <>
      <div
        id='sidebar'
        className={`fixed  ${bannerHeight} left-0 top-0 z-[499] flex h-full max-h-[100vh] w-full flex-col items-center overflow-y-auto bg-zinc-200 px-[10px]  transition-all duration-300 ease-in-out dark:bg-mariana-blue ${
          isSidebarOpen
            ? "max-w-[220px] translate-x-0"
            : "max-w-[110px] -translate-x-full"
        }
          lg:relative lg:z-30 lg:translate-x-0  `}
        data-testid='sidebar'
        ref={sideBarRef}>
        {/* LOGO */}
        <div className='mt-[30px] flex  items-center'>
          <Link to='/' className='  text-2xl font-semibold '>
            {isSidebarOpen ? (
              <>
                <img
                  src={LogoWithTitle}
                  alt={"logo"}
                  className={"hidden h-[40px] w-full dark:block"}
                />
                <img
                  src={LogoInvisibleBackground}
                  alt={"logo"}
                  className={"h-[40px] w-full dark:hidden"}
                />
              </>
            ) : (
              <>
                <img
                  src={CephadexLogoWhite}
                  alt={"logo"}
                  className={"hidden h-[40px] w-full dark:block"}
                />
                <img
                  src={CephadexLogoSix}
                  alt={"logo"}
                  className={"h-[40px] w-full  dark:hidden"}
                />
              </>
            )}
          </Link>
        </div>
        <hr className='mx-auto mt-4 w-full border-t-2 border-slate-300 p-4 dark:border-tolopea' />

        {/* CTA BUTTONS */}
        <nav className={"w-full"}>
          {LINKS.map((link, index) => (
            <div
              id={link.id}
              className={`${
                isSidebarOpen
                  ? "w-full "
                  : "flex w-full items-center justify-center "
              } h-16  transition-all duration-300`}
              key={index}>
              <IconButton
                active={path === link.href}
                collapse={!isSidebarOpen}
                theme={"transparent"}
                icon={link.img}
                onClick={() => {}}
                ariaLabel={link.title}
                to={link.href}
              />
            </div>
          ))}
          <div
            className={`${
              isSidebarOpen
                ? "w-full"
                : "flex w-full items-center justify-center"
            } mt-[40px] transition-all duration-300`}>
            <IconButton
              collapse={!isSidebarOpen}
              theme={"cyan"}
              icon={UpgradeIcon}
              onClick={() => {}}
              ariaLabel={"Upgrade"}
              to={"/upgrade"}
            />
          </div>
          {/* CLOSE / OPEN SIDEBAR BUTTON */}

          <div
            className={`flex w-full ${
              isSidebarOpen ? "justify-end" : "justify-center"
            }`}>
            <button
              className={
                "mt-[30px]  flex h-[40px] w-[40px] items-center justify-center rounded-full bg-electric-violet-700 text-tolopea hover:bg-electric-violet dark:bg-transparent dark:text-white"
              }
              onClick={toggleSidebar}
              aria-label='Close sidebar'>
              {isSidebarOpen ? (
                <DisplayClose className='h-4 w-4' />
              ) : (
                <DisplayOpen className='h-4 w-4' />
              )}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export { SideBarApp };
