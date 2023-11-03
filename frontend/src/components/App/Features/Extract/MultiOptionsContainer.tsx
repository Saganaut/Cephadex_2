import React, { useState } from "react";
import { MultiOptionsSelector } from "@app/Features/Extract/MultiOptionsSelector";

const MultiOptionsContainer: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  return (
    <div className="rounded-3xl min-h-full bg-mariana-blue p-4 h-auto">
      <div className="flex justify-center  ">
        <div className="text-aquamarine p-2 pb-4">
          What else would you like to do?
        </div>
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
