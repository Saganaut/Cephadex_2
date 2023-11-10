import React from "react";
import { Dropdown } from "./Dropdown";
import { subjectList } from "@extract/data/SubjectList";
import { FormikContextType, useFormikContext } from "formik";

interface SubjectFormValues {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  subjectField: string;
}

const SubjectSelector: React.FC = () => {
  const formik: FormikContextType<SubjectFormValues> = useFormikContext();

  return (
    <div className=" w-full max-w-sm">
      <Dropdown
        name="subjectField"
        label={"Subject"}
        options={subjectList}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.subjectField}
      />
    </div>
  );
};

export { SubjectSelector };
