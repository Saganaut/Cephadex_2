import React from "react";
import { Dropdown } from "@common/Form/Dropdown";
import { subjectList } from "@source/components/App/Features/Extract/data/SubjectList";

interface SubjectSelectorProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = () => {
  return (
    <div className=" w-full max-w-sm">
      <Dropdown name="subjectField" label={"Subject"} options={subjectList} />
    </div>
  );
};

export { SubjectSelector };
