import { Dropdown } from "@common/Form/Dropdown";
import { PlusIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "react-router-dom";

const CreateDropdown: React.FC = () => {
  return (
    <div>
      <Dropdown
        trigger={
          <button
            className={
              "flex h-[54px] w-[54px] items-center justify-center rounded-full"
            }
          >
            <PlusIcon className={"h-[34px] w-[34px]"} />
          </button>
        }
        content={
          <div className="z-40 rounded border bg-white p-4 shadow-lg">
            <Link to="/create-deck" className="text-black">
              Deck
            </Link>
            <div>Quiz</div>
            <div>Group</div>
          </div>
        }
      />
    </div>
  );
};

export { CreateDropdown };
