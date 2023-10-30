import React from "react";
import { ThemeToggle } from "@app/ThemeToggle";
import { NavBarButtonCreate } from "@app/Dashboard/NavBar/NavBarButtons";
import { NavBarUpgradeLink } from "@app/Dashboard/SideBar/SideBarLink";
import { SelectionButtonContainer } from "@app/Dashboard/NavBar/SelectionButtonContainer";

const NavBarApp = () => {
  return (
    <header className="flex items-center absolute top-0 right-0 p-2 mt-4 rounded-bl-3xl  text-white -translate-x-1/2 left-1/2">
      <nav>
        <div className="row flex items-center">
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
