import { truncate } from "@source/lib/utils/functions";
import React from "react";

const TRUNCATE_LENGTH = 20;
interface GroupNameProps {
  name: string;
}
const GroupName: React.FC<GroupNameProps> = ({ name }) => {
  return (
    <>
      {" "}
      <h1
        className={
          "border-b-[1px] border-tolopea  text-[14px] font-bold dark:border-white "
        }
      >
        {truncate(name, TRUNCATE_LENGTH)}
      </h1>
    </>
  );
};

export { GroupName };
