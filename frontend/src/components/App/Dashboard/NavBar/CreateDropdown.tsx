import { Dropdown } from "@app/Shared/Dropdown";
import React from "react";
import { Link } from "react-router-dom";

const CreateDropdown: React.FC = () => {
  return (
    <div>
      <Dropdown
        trigger={<button>Create</button>}
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
