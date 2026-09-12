import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

import { type LinksType } from "./DeckDropdown/data/links";

interface DropdownMenuProps {
  links: LinksType[];
  button: React.ReactNode;
  type: "Card" | "Deck" | "Group" | "User" | "Quiz" | "GroupDeck";
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ links, button, type }) => {
  return (
    <div
      className={"w-full"}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Menu>
        <Menu.Button className="relative w-full">{button}</Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className={"relative z-[999] w-full"}>
            <Menu.Items className="absolute right-0 top-0 mt-2 w-[160px] origin-top-right overflow-hidden text-clip rounded-md  bg-electric-violet-900    ">
              {links.map((link, index) => (
                <Menu.Item key={index}>
                  <div
                    className={`block w-full cursor-pointer px-2 py-1 text-center text-aquamarine ${
                      links.length - 1 === index
                        ? ""
                        : "border-b-[1px] border-gray-800"
                    } flex hover:bg-mariana-blue`}
                    onClick={link.onClick}
                  >
                    <div className="flex items-center space-x-2">
                      {link.icon != null && (
                        <link.icon
                          fill="aquamarine"
                          className={
                            "fill-aqumarine h-[18px] w-[18px] align-middle text-aquamarine"
                          }
                        />
                      )}
                      <span className="align-middle">{link.label}</span>
                    </div>
                  </div>
                </Menu.Item>
              ))}
            </Menu.Items>
          </div>
        </Transition>
      </Menu>
    </div>
  );
};

export { DropdownMenu };
