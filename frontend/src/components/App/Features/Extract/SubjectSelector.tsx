import React from "react";
import { SelectField } from "@app/Shared/SelectField";

const subjectList: string[] = [
  "Math",
  "English",
  "Science",
  "History",
  "Geography",
  "Art",
  "Music",
  "Physical Education",
  "Social Studies",
];

interface SelectFieldProps {
  name: string;
  list: string[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

const SubjectSelector: React.FC = () => {
  return (
    <div>
      Choose a subject
      <SelectField
        name="SubjectSelect"
        // value={formik.values.existingDeckField}
        // onChange={formik.handleChange}
        // onBlur={formik.handleBlur}
        list={subjectList}
      />
    </div>
  );
};

export { SubjectSelector };
