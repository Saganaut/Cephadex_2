import React from "react";
import { SubjectSelector } from "@extract/SubjectSelector";
import { DetailSelector } from "@extract/DetailSelector";

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
