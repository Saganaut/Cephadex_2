import React from "react";
import { ExtractSelectionButton } from "@app/Features/Extract/ExtractSelectionButton";

interface ExtractProps {
  customIsSelected: boolean;
  toggleCustomSelection: () => void;
}
const SelectionButtonContainer: React.FC<ExtractProps> = ({
  customIsSelected,
  toggleCustomSelection,
}) => {
  return (
    <div className="row flex  w-min-min justify-between bg-mariana-blue rounded-full border-2 border-mariana-blue ">
      <ExtractSelectionButton
        customIsSelected={customIsSelected}
        toggleCustomSelection={toggleCustomSelection}
        name="Selection & output"
        id={1}
      />
      <ExtractSelectionButton
        customIsSelected={customIsSelected}
        toggleCustomSelection={toggleCustomSelection}
        name="Customization"
        id={2}
      />
    </div>
  );
};

export { SelectionButtonContainer };
