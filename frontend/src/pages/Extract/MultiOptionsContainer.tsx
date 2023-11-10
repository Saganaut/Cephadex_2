import React, { useState } from "react";
import { MultiOptionsSelector } from "@extract/MultiOptionsSelector";
import { FormikContextType, useFormikContext } from "formik";

interface FormValues {
  multiOptionsField: string[];
}

const MultiOptionsContainer: React.FC = () => {
  const formik: FormikContextType<FormValues> = useFormikContext();

  // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const selectedOptions = formik.values.multiOptionsField;

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
        onChange={(newSelected) =>
          formik.setFieldValue("multiOptionsField", newSelected)
        }

        // onChange={setSelectedOptions}
      />
    </div>
  );
};

export { MultiOptionsContainer };
