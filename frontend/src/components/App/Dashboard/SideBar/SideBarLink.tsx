import React from "react";
import { Link } from "react-router-dom";
import { ButtonLink, ButtonLinkSecondary } from "@app/Shared/ButtonLink";
const SideBarLink = ({ isSidebarOpen, title, href, img }) => {
  return (
    <>
      <Link to={href}>
        <ButtonLink>
          <div className="mr-3 w-6 h-6 ">
            <img src={img} alt={title} className="" />{" "}
          </div>
          {isSidebarOpen && <span className="">{title}</span>}
        </ButtonLink>
      </Link>
    </>
  );
};

const SideBarUpgradeLink = ({ isSidebarOpen }) => {
  return (
    <div>
      <Link to="/upgrade">
        <ButtonLinkSecondary>
          <div className="mr-3 w-6 h-6">
            <img src="/" alt="Upgrade" className="" />{" "}
          </div>
          {isSidebarOpen && <span className="">Upgrade</span>}
        </ButtonLinkSecondary>
      </Link>
    </div>
  );
};

const NavBarUpgradeLink = () => {
  return (
    <div>
      <Link to="/upgrade">
        <ButtonLinkSecondary>
          <div className="mr-3 w-6 h-6">
            <img src="/" alt="Upgrade" className="" />{" "}
          </div>
          <span className="">Upgrade</span>
        </ButtonLinkSecondary>
      </Link>
    </div>
  );
};

export { SideBarLink };
export { SideBarUpgradeLink };
export { NavBarUpgradeLink };
