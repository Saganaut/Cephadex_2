import React from "react";
import { Dropdown } from "components/App/Shared/Dropdown";
import { Link } from "react-router-dom";

const CreateDropdown = () => {
  return (
    <div>
      <Dropdown
        trigger={<button>Create</button>}
        content={
          <div className="border rounded bg-white shadow-lg p-4 z-40">
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
