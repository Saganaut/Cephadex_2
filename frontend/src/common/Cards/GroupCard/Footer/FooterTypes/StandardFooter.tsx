import { type GroupSchema } from "@source/client";
import { formatDate } from "@source/lib/utils/functions";
import React from "react";

interface StandardFooterProps {
  group: GroupSchema;
}
const StandardFooter: React.FC<StandardFooterProps> = ({ group }) => {
  return (
    <>
      {" "}
      <div
        className={
          "rounded-full bg-electric-violet-900 px-4 py-1 text-sm font-medium text-white dark:bg-mariana-blue-100"
        }
      >
        {group.groupType ?? "group"}
      </div>
      <div className="flex items-end ">
        <span
          className={"block px-2 text-right text-[12px] dark:text-aquamarine"}
        >
          {"timeCreated" in group && formatDate(group.timeCreated ?? "")}
        </span>
        {/* <FavoriteToggler
          itemId={group.id}
          isFavorite={"fav" in group ? group.fav : false}
          itemType={"standard"}
        /> */}
      </div>{" "}
    </>
  );
};

export { StandardFooter };
