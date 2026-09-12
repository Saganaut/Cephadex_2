import AnchorIcon from "@assets/AnchorIcon.svg?react";
import { Tooltip } from "@source/common/Form/Tooltip";
import React from "react";

interface DeckSharesProps {
  shares?: number;
}
const DeckShares: React.FC<DeckSharesProps> = ({ shares }) => {
  return (
    <>
      {" "}
      <Tooltip text="Times shared">
        <div className="flex items-center space-x-2">
          <div className="text-tolopea dark:text-white">{shares ?? 0}</div>
          <AnchorIcon fill="#FFA500" className="h-[24px] w-[24px]" />
        </div>
      </Tooltip>
    </>
  );
};

export { DeckShares };
