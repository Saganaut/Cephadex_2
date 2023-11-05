import React from "react";

interface CardStructureProps {
  children: React.ReactNode;
}
const CardStructure: React.FC<CardStructureProps> = ({ children }) => {
  return (
    <div className=" w-96 rounded-3xl bg-mariana-blue text-white p-6">
      {children}
    </div>
  );
};
export { CardStructure };
