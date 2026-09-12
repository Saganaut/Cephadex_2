import { type LinksType } from "@source/common/DropdownMenu/DeckDropdown/data/links";
import React from "react";

interface MenuItemProps {
  link: LinksType;
  lastItem: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ link, lastItem }) => {
  return (
    <div
      className={`block w-full cursor-pointer px-4 py-2 text-center text-white ${
        lastItem ? "" : "border-b-[1px] border-white"
      } flex hover:bg-mariana-blue`}
      onClick={link.onClick}
    >
      <div className="flex items-center space-x-2">
        {link.icon != null && (
          <link.icon
            className={"h-[18px] w-[18px] align-middle text-aquamarine"}
          />
        )}
        <span className="align-middle">{link.label}</span>
      </div>
    </div>
  );
};

export { MenuItem };
