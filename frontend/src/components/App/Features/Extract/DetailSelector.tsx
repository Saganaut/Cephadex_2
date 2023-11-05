import React from "react";
import { Dropdown } from "@common/Form/Dropdown";
import { FormikContextType, useFormikContext } from "formik";

const detail: Array<{ value: number; label: string }> = [
  { value: -1, label: "" },
  { value: 0, label: "Low" },
  { value: 1, label: "Medium" },
  { value: 2, label: "High" },
];

interface DetailFormValues {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  detailField: string;
}

const DetailSelector: React.FC = () => {
  const formik: FormikContextType<DetailFormValues> = useFormikContext();

  return (
    <div className=" w-full max-w-sm">
      <Dropdown
        name="detailField"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        label="Detail"
        value={formik.values.detailField}
        options={detail}
      />
    </div>
  );
};
export { DetailSelector };
