import { type GroupSchema } from "@source/client";
import React from "react";

import { StandardFooter } from "./FooterTypes/StandardFooter";

interface FooterProps {
  group: GroupSchema;
  type: "group" | "standard" | "simple" | "public" | "groupAdmin" | "full";
}

const Footer: React.FC<FooterProps> = ({ group, type }) => {
  return (
    <>
      <div className={"mt-4 flex w-full items-center justify-between"}>
        <StandardFooter group={group} />
      </div>
    </>
  );
};

export { Footer };
