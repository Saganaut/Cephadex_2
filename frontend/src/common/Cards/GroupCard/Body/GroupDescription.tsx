import { truncate } from "@source/lib/utils/functions";
import React from "react";

const TRUNCATE_LENGTH = 40;
interface GroupDescriptionProps {
  description: string | null | undefined;
}
const GroupDescription: React.FC<GroupDescriptionProps> = ({ description }) => {
  return (
    <>
      {" "}
      <p className={"pt-1 text-[11px] font-medium "}>
        {description != null && truncate(description, TRUNCATE_LENGTH)}
      </p>
    </>
  );
};

export { GroupDescription };
