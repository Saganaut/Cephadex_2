import React, { useState } from "react";
import { MultiOptionsSelector } from "@app/Features/Extract/MultiOptionsSelector";

const MultiOptionsContainer: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  return (
    <div className=" rounded-xl min-h-full bg-mariana-blue p-2 h-auto">
      <div className="flex justify-center ">
        <div className="text-aquamarine pb-4">Other options:</div>
      </div>
      <MultiOptionsSelector
        options={[
          "Generate images",
          "Save text",
          "Create summary",
          "Create study notes",
        ]}
        selected={selectedOptions}
        onChange={setSelectedOptions}
      />
    </div>
  );
};

export { MultiOptionsContainer };
