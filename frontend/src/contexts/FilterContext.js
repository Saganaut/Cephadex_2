import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

const FilterProvider = ({ children }) => {
    const [filter, setFilter] = useState("");
    
    return (
        <FilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </FilterContext.Provider>
    );
};

const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
};

export { FilterProvider};  
export { useFilter };