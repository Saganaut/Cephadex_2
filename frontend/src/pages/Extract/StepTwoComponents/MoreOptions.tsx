import { Dropdown } from "@common/Form/Dropdown";
import type ExtractFormValues from "@extract/data/ExtractFormValues";
import { detail } from "@extract/StepTwoComponents/data/detail";
import { subjectList } from "@extract/StepTwoComponents/data/subjectList";
// import { SubjectOptions } from "@extract/StepTwoComponents/SubjectOptions";
import { useFormikContext } from "formik";
import React from "react";

const MoreOptions: React.FC = () => {
  const formik = useFormikContext<ExtractFormValues>();

  const handleDetailChange = (label: string): void => {
    void formik.setFieldValue("detailField", label);
  };

  const handleSubjectChange = (selectedOption: {
    value: number;
    label: string;
  }): void => {
    void formik.setFieldValue("subjectField", selectedOption.label);
  };

  const getSelectedSubject = (
    value: string
  ): {
    value: number;
    label: string;
  } => {
    const selectedSubject = subjectList.find(
      (subject) => subject.label === value
    ) ?? { value: 0, label: "Unspecified" };
    return selectedSubject;
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap">
      <div className="mt-2 min-w-[260px]   flex-1 space-x-2">
        <p
          className={
            "pb-2 text-[20px] font-medium text-tolopea dark:text-white"
          }
        >
          Choose a level of detail
        </p>
        {detail.map((item, index) => (
          <button
            key={index}
            type="button"
            className={`rounded-full px-4 py-2 ${
              formik.values.detailField === item.label
                ? " bg-tolopea text-aquamarine"
                : " bg-white text-tolopea"
            }`}
            onClick={() => {
              handleDetailChange(item.label);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="min-w-[260px] flex-1">
        <Dropdown
          label={"Select a subject"}
          options={subjectList}
          name="subjectField"
          style="select"
          onChange={handleSubjectChange}
          value={getSelectedSubject(formik.values.subjectField)}
        />
      </div>
    </div>
  );
};

export { MoreOptions };
