import React from "react";

interface CardsTagProps {
  qtyCards: number;
}
const CardsTag: React.FC<CardsTagProps> = ({ qtyCards }) => {
  return (
    <>
      {" "}
      <div
        className={
          "whitespace-nowrap rounded-full  bg-electric-violet px-4 py-1 text-xs text-white dark:bg-mariana-blue-100  sm:text-sm sm:font-medium"
        }
      >
        {qtyCards} Cards
      </div>
    </>
  );
};

export { CardsTag };
