import { NavBarButtonCreate } from "@app/Dashboard/NavBar/NavBarButtons";
import { SelectionButtonContainer } from "@app/Dashboard/NavBar/SelectionButtonContainer";
import { NavBarUpgradeLink } from "@app/Dashboard/SideBar/SideBarLink";
import { ThemeToggle } from "@app/ThemeToggle";
import React from "react";

const NavBarApp: React.FC = () => {
  return (
    <header className="absolute left-1/2 right-0 top-0 mt-4 flex -translate-x-1/2 items-center  rounded-bl-3xl p-2 text-white">
      <nav>
        <div className="flex flex-row items-center">
          <NavBarButtonCreate />
          <SelectionButtonContainer />
          <NavBarUpgradeLink />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export { NavBarApp };
