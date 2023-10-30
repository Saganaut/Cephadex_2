import React, { useState } from "react";
import { Link } from "react-router-dom"; // if you're using 'react-router-dom' for navigation
import { SideBarLink } from "@app/Dashboard/SideBar/SideBarLink";
import { SideBarUpgradeLink } from "@app/Dashboard/SideBar/SideBarLink";

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

const SideBarApp = ({ isSidebarOpen, setSidebarOpen }) => {
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <div
        className={`transform top-0 left-0 bg-mariana-blue fixed h-full ease-in-out transition-all duration-300 z-30
  ${isSidebarOpen ? "translate-x-0 w-40" : "-translate-x-full w-20"}
  lg:translate-x-0 lg:relative lg:z-0`}
      >
        <div className="flex items-center  mt-4">
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
