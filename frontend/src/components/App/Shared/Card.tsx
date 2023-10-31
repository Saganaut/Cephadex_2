import React from "react";

interface CardProps {
  children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="h-96  w-96 rounded-3xl bg-mariana-blue text-white">
      {children}
    </div>
  );
};
export { Card };
