import React from "react";
import { SubjectSelector } from "@app/Features/Extract/SubjectSelector";
import { DetailSelector } from "@app/Features/Extract/DetailSelector";

const AdvancedOptionsContainer = () => {
  return (
    <div>
      <div className="p-4  flex justify-between my-5">
        <SubjectSelector />
        <DetailSelector />
        <div></div>
      </div>
    </div>
  );
};

export { AdvancedOptionsContainer };
