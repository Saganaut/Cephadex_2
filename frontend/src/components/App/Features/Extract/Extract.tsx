import React, { useState } from "react";
import { ExtractForm } from "@app/Features/Extract/ExtractForm";
import { SelectionButtonContainer } from "@app/Features/Extract/ExtractSelectionButtonContainer";
// custom is selected does the opposite of what it should, the name should be custom is not selected
const Extract: React.FC = () => {
  const [customIsSelected, setCustomIsSelected] = useState(true);
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
