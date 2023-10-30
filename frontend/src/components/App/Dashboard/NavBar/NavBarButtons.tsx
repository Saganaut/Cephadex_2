import React from "react";
import { CreateDropdown } from "@app/Dashboard/NavBar/CreateDropdown";
import { ButtonLink, ButtonLinkSecondary } from "@app/Shared/ButtonLink";
import { useFilter } from "@contexts/FilterContext";

const NavBarButton = ({ filter, selectedFilter, setSelectedFilter }) => {
  const { setFilter } = useFilter();
  console.log("In NavBarButton: ", setSelectedFilter);

  const handleButtonClick = () => {
    setFilter(filter.value);
    console.log("filter value", filter.value);
    setSelectedFilter(filter.value);
  };

  return (
    <div>
      <button
        className={`h-10 w-24 px-2 py-2 text-sm flex items-center rounded-full ${
          filter.value === selectedFilter ? "bg-blue-500 text-white" : ""
        }`}
        onClick={handleButtonClick}
      >
        {filter.name}
        <span className="">{filter.count}</span>
      </button>
    </div>
  );
};

const NavBarButtonCreate = () => {
  return (
    <div>
      <ButtonLink>
        <CreateDropdown />
      </ButtonLink>
    </div>
  );
};

export { NavBarButtonCreate };
export { NavBarButton };
