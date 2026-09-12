import React, { type ReactElement } from "react";

interface SortFieldProps {
  filterOption: string;
  setFilterOption: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}
const SortField: React.FC<SortFieldProps> = ({
  filterOption,
  setFilterOption,
  options,
}): ReactElement => {
  const handleFilterChange = (event: { target: { value: string } }) => {
    setFilterOption(event.target.value);
  };
  return (
    <div>
      <select
        value={filterOption}
        onChange={handleFilterChange}
        className="ml-4 rounded-lg bg-white p-2 text-gray-700 focus:outline-none"
      >
        {options.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export { SortField };
