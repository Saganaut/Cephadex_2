import React, { type ReactElement } from "react";

interface SearchFieldProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
  searchTerm,
  setSearchTerm,
}): ReactElement => {
  const handleSearchChange = (event: { target: { value: string } }) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a deck"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full rounded-lg p-2 text-aquamarine focus:outline-none"
      />
    </div>
  );
};

export { SearchField };
