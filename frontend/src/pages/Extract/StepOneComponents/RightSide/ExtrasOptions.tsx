import { MultiOptionsSelector } from "@source/pages/Extract/StepOneComponents/RightSide/MultiOptionsSelector";
import { type FormikContextType, useFormikContext } from "formik";
import React, { type ReactElement } from "react";

import { extraOptions } from "../../StepTwoComponents/data/extraOptions";

interface FormValues {
  multiOptionsField: string[];
}

const ExtrasOptions = (): ReactElement => {
  const formik: FormikContextType<FormValues> = useFormikContext();

  const selectedOptions = formik.values.multiOptionsField;

  return (
    <div>
      <div className=" p-2 dark:text-aquamarine text-tolopea">
        Select extras from the list below
      </div>
      <MultiOptionsSelector
        options={extraOptions}
        selected={selectedOptions}
        onChange={async (newSelected) =>
          await formik.setFieldValue("multiOptionsField", newSelected)
        }
      />
    </div>
  );
};

export { ExtrasOptions };
