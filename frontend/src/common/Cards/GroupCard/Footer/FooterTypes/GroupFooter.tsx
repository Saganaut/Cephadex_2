import { type DeckSchema, type PublicDeckSchema } from "@source/client";
import React from "react";

interface GroupFooterProps {
  deck: DeckSchema | PublicDeckSchema;
}
const GroupFooter: React.FC<GroupFooterProps> = ({ deck }) => {
  return (
    <>
      <div
        className={
          "rounded-full bg-mariana-blue-100 px-4 py-1 text-sm font-medium text-white"
        }
      >
        {deck?.qtyCards ?? 0} Cards
      </div>
      <div className="flex items-end ">
        <span
          className={"block px-2 text-right text-[12px] text-aquamarine"}
        ></span>
      </div>
    </>
  );
};

export { GroupFooter };
