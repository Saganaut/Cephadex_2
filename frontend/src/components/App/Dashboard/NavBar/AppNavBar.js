import React from "react";
import { ThemeToggle } from "components/App/ThemeToggle";
import { NavBarButtonCreate } from "components/App/Dashboard/NavBar/NavBarButtons" 
import {NavBarUpgradeLink } from 'components/App/Dashboard/SideBar/SideBarLink';
import { SelectionButtonContainer } from "components/App/Dashboard/NavBar/SelectionButtonContainer";

const NavBarApp = () => {

  return (
    <header className="flex items-center absolute top-0 right-0 p-2 mt-4 rounded-bl-3xl  text-white -translate-x-1/2 left-1/2">
        <nav
 
        >
  <div className = "row flex items-center">
      <NavBarButtonCreate />
        <SelectionButtonContainer />
        <NavBarUpgradeLink/>
        <ThemeToggle /></div>
    </nav>
    </header>
  );
};

export { NavBarApp };
