import {
  SideBarLink,
  SideBarUpgradeLink,
} from "@app/Dashboard/SideBar/SideBarLink";
import CephadexLogoWhite from "@assets/CephadexLogoWhite.svg";
import DeckIcon from "@assets/DeckIcon.svg";
import QuizIcon from "@assets/QuizIcon.svg";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "react-router-dom";

const LINKS = [
  {
    title: "Decks",
    href: "/decks",
    // img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    img: DeckIcon,
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    // img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    img: QuizIcon,
  },
  // {
  //   title: "Games",
  //   href: "/games",
  //   img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  // },
  // {
  //   title: "Groups",
  //   href: "/groups",
  //   img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  // },
];

interface SideBarAppProps {
  isSidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const SideBarApp: React.FC<SideBarAppProps> = ({
  isSidebarOpen,
  setSidebarOpen,
}) => {
  const toggleSidebar: () => void = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-30 flex h-full w-full flex-col items-center bg-mariana-blue  px-[10px] transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "max-w-[220px] translate-x-0"
            : "max-w-[110px] -translate-x-full"
        }
  lg:relative lg:z-0 lg:translate-x-0`}
      >
        <div className="mt-[64px] flex  items-center">
          <Link to="/" className=" text-2xl font-semibold ">
            <img
              src={CephadexLogoWhite}
              alt={"logo"}
              className={"h-full w-full"}
            />
          </Link>
        </div>
        <button
          className={
            "my-[80px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
          }
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <ChevronDoubleLeftIcon className={"h-[16px] w-[16px] text-black"} />
        </button>

        <nav className="mt-5 px-4">
          {LINKS.map((link, index) => (
            <div className="py-2" key={index}>
              <SideBarLink isSidebarOpen={isSidebarOpen} {...link} />
            </div>
          ))}
          <div className="mt-20">
            <SideBarUpgradeLink isSidebarOpen={isSidebarOpen} />
          </div>
        </nav>
      </div>
    </>
  );
};

export { SideBarApp };
