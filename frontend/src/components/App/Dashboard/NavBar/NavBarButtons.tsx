import { CreateDropdown } from "@app/Dashboard/NavBar/CreateDropdown";
import { ButtonLink } from "@app/Shared/ButtonLink";
import { useFilter } from "@contexts/FilterContext";
import React from "react";

interface NavBarButtonProps {
  filter: {
    name: string;
    value: string;
    count: string;
    icon: string;
  };
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
}
const NavBarButton: React.FC<NavBarButtonProps> = ({
  filter,
  selectedFilter,
  setSelectedFilter,
}) => {
  const { setFilter } = useFilter();
  console.log("In NavBarButton: ", setSelectedFilter);

  const handleButtonClick: () => void = () => {
    setFilter(filter.value);
    console.log("filter value", filter.value);
    setSelectedFilter(filter.value);
  };

  return (
    <div>
      <button
        className={`flex h-10 w-24 items-center rounded-full p-2 text-sm${
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

const NavBarButtonCreate: React.FC = () => {
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
