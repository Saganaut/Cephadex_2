import {
  SideBarLink,
  SideBarUpgradeLink,
} from "@app/Dashboard/SideBar/SideBarLink";
import React from "react";
import { Link } from "react-router-dom"; // if you're using 'react-router-dom' for navigation

const LINKS = [
  {
    title: "Decks",
    href: "/decks",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    title: "Games",
    href: "/games",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    title: "Groups",
    href: "/groups",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
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
        className={`fixed left-0 top-0 z-30 h-full bg-mariana-blue transition-all duration-300 ease-in-out${
          isSidebarOpen ? "w-40 translate-x-0" : "w-20 -translate-x-full"
        }
  lg:relative lg:z-0 lg:translate-x-0`}
      >
        <div className="mt-4 flex  items-center">
          <Link to="/" className="mt-20 p-2 text-2xl font-semibold ">
            {isSidebarOpen ? (
              <span className="text-white">Cephadex</span>
            ) : (
              <span>
                <img src=""></img>
              </span>
            )}
          </Link>
        </div>
        <div className="border-red-500 p-5">
          <button onClick={toggleSidebar} aria-label="Close sidebar">
            <span className="text-red-500">XX</span>
          </button>
        </div>

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
