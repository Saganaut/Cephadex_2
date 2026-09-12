import { type GroupSchema } from "@source/client";
// import { GroupgroupDropdown } from "@source/common/DropdownMenu/GroupDropdown";
import React from "react";

// import { groupDropdown } from "../../../DropdownMenu/groupDropdown";
import { GroupName } from "./GroupName";

interface CardHeaderProps {
  group: GroupSchema;
  groupId?: number;
  type: "group" | "standard" | "simple" | "public" | "groupAdmin" | "full";
}
const Header: React.FC<CardHeaderProps> = ({ group, type, groupId }) => {
  return (
    <>
      {" "}
      <div className={"flex items-center justify-between"}>
        <GroupName name={group.name} />
        {/* {type === "standard" && (
          <groupDropdown groupId={group.id} type={type} groupId={groupId} />
        )}
        {type === "group" ||
          (type === "groupAdmin" && groupId != null && (
            <GroupgroupDropdown groupId={group.id} groupId={groupId} type={type} />
          ))}
        {type === "public" && (
          <PublicgroupDropdown groupId={group.id} type={type} />
        )} */}
      </div>
    </>
  );
};

export { Header };
