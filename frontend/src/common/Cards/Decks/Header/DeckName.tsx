import { truncate } from "@source/lib/utils/functions";
import React from "react";

const TRUNCATE_LENGTH = 20;
interface DeckNameProps {
  name: string;
}
const DeckName: React.FC<DeckNameProps> = ({ name }) => {
  return (
    <>
      {" "}
      <h1
        className={
          "border-b-[1px] dark:border-white border-tolopea text-[14px] font-bold text-tolopea dark:text-white"
        }
      >
        {truncate(name, TRUNCATE_LENGTH)}
      </h1>
    </>
  );
};

export { DeckName };
