import React, { createContext, useContext, useState } from "react";

interface FilterContextType {
  filter: string;
  setFilter: (value: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: React.ReactNode;
}
const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filter, setFilter] = useState("");

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context == null) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

export { FilterProvider };
export { useFilter };
