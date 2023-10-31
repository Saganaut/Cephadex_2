import React, { useState } from "react";
import { ExtractForm } from "@app/Features/Extract/ExtractForm";
import { SelectionButtonContainer } from "@app/Features/Extract/ExtractSelectionButtonContainer";

const Extract: React.FC = () => {
  const [customIsSelected, setCustomIsSelected] = useState(false);
  const toggleCustomSelection = () => {
    setCustomIsSelected(!customIsSelected);
  };

  return (
    <div>
      <section className="text-gray-600 body-font container px-5 my-24  ">
        <div className="flex">
          <SelectionButtonContainer
            customIsSelected={customIsSelected}
            toggleCustomSelection={toggleCustomSelection}
          />
        </div>
        <ExtractForm customIsSelected={customIsSelected} />
      </section>
    </div>
  );
};

export { Extract };
