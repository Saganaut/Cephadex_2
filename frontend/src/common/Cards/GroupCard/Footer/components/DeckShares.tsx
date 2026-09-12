import SeagulIcon from "@assets/SeagullIcon.svg?react";
import React from "react";

interface DeckSharesProps {
  shares?: number;
}
const DeckShares: React.FC<DeckSharesProps> = ({ shares }) => {
  return (
    <>
      {" "}
      <div className="flex items-center space-x-2">
        <SeagulIcon fill="#FFA500" className="h-[28px] w-[28px]" />
        <div className="text-aquamarine">{shares ?? 0}</div>
      </div>
    </>
  );
};

export { DeckShares };
