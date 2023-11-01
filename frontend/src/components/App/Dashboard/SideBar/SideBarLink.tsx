import { ButtonLink, ButtonLinkSecondary } from "@app/Shared/ButtonLink";
import React from "react";
import { Link } from "react-router-dom";

interface SideBarLinkProps {
  isSidebarOpen: boolean;
  title: string;
  href: string;
  img: string;
}
const SideBarLink: React.FC<SideBarLinkProps> = ({
  isSidebarOpen,
  title,
  href,
  img,
}) => {
  return (
    <>
      <Link to={href}>
        <ButtonLink>
          <div className="mr-3 h-6 w-6 ">
            <img src={img} alt={title} className="" />{" "}
          </div>
          {isSidebarOpen && <span className="">{title}</span>}
        </ButtonLink>
      </Link>
    </>
  );
};

interface SideBarUpgradeLinkProps {
  isSidebarOpen: boolean;
}
const SideBarUpgradeLink: React.FC<SideBarUpgradeLinkProps> = ({
  isSidebarOpen,
}) => {
  return (
    <div>
      <Link to="/upgrade">
        <ButtonLinkSecondary>
          <div className="mr-3 h-6 w-6">
            <img src="/" alt="Upgrade" className="" />{" "}
          </div>
          {isSidebarOpen && <span className="">Upgrade</span>}
        </ButtonLinkSecondary>
      </Link>
    </div>
  );
};

const NavBarUpgradeLink: React.FC = () => {
  return (
    <div>
      <Link to="/upgrade">
        <ButtonLinkSecondary>
          <div className="mr-3 h-6 w-6">
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
