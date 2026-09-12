import React from "react";

interface CardTagProps {
  label: string;
  value: "group" | "default" | string;
}
const CardTag: React.FC<CardTagProps> = ({ label, value }) => {
  return (
    <div className="flex w-fit items-center gap-x-[8px] rounded-full bg-mariana-blue px-[10px] py-[5px] ">
      <p className={"rounded-full bg-electric-violet px-[8px]"}>{value}</p>
      <h3 className={"pr-[8px] text-sm font-medium text-white"}>{label}</h3>
    </div>
  );
};
export { CardTag };
