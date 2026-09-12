import UpgradeIcon from "@assets/UpgradeIcon.svg";
import {
  ButtonLink,
  ButtonLinkSecondary,
} from "@source/common/Buttons/ButtonLink";
import React from "react";
import { Link } from "react-router-dom";

interface SideBarLinkProps {
  isSidebarOpen: boolean;
  title: string;
  href: string;
  img: string;
  id: string;
}
const SideBarLink: React.FC<SideBarLinkProps> = ({
  isSidebarOpen,
  title,
  href,
  img,
  id,
}) => {
  return (
    <>
      <Link to={href}>
        <ButtonLink>
          <div
            id={id}
            className={"flex items-center gap-x-[10px] px-[8px] py-[6px]"}
          >
            <img src={img} alt={title} className="h-[42px] w-[42px]" />
            {isSidebarOpen && (
              <span className="font-medium text-tolopea">{title}</span>
            )}
          </div>
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
          <img src={UpgradeIcon} alt="Upgrade" className="h-[42px] w-[42px]" />{" "}
          {isSidebarOpen && (
            <span className="ml-[10px] text-[14px] font-medium text-mariana-blue">
              Upgrade
            </span>
          )}
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
          <img src={UpgradeIcon} alt="Upgrade" className="h-[42px] w-[42px]" />{" "}
          <span className="ml-[10px] text-[14px] font-medium text-mariana-blue">
            Upgrade
          </span>
        </ButtonLinkSecondary>
      </Link>
    </div>
  );
};

export { SideBarLink };
export { SideBarUpgradeLink };
export { NavBarUpgradeLink };
