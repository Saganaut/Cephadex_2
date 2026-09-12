import { Dropdown } from "@common/Form/Dropdown";
import type ExtractFormValues from "@extract/data/ExtractFormValues";
import { detail } from "@extract/StepTwoComponents/data/detail";
import { languages } from "@extract/StepTwoComponents/data/languages";
import { subjectList } from "@extract/StepTwoComponents/data/subjectList";
import { SubjectOptions } from "@extract/StepTwoComponents/SubjectOptions";
import { RadioGroup } from "@headlessui/react";
import { useFormikContext } from "formik";
import React, { type ReactElement } from "react";

interface DetailFormValues {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  detailField: string;
}
interface SubjectFormValues {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  subjectField: string;
}

const AdvancedOptions = (): ReactElement => {
  const formik = useFormikContext<ExtractFormValues>();
  const subject = formik.values.subjectField as SubjectType;
  const handleDetailChange = (label: string): void => {
    void formik.setFieldValue("detailField", label);
  };

  const handleLanguageChange = (selectedOption): void => {
    void formik.setFieldValue("languageField", selectedOption.value);
  };
  const getSelectedLanguage = (value) => {
    return (
      languages.find((lang) => lang.value === value) || {
        value: 0,
        label: "Choose a language",
      }
    );
  };

  return (
    <>
      <div className=" p-2 pb-4 text-aquamarine">
        Specifying a few more details can help get better results
      </div>
      <RadioGroup
        name="subjectField"
        value={subject}
        onChange={(value: SubjectType) => {
          formik.setFieldValue("subjectField", value);
        }}
        onBlur={formik.handleBlur}
      >
        <RadioGroup.Label>
          <div className="flex  p-2 pb-4">
            <div className=" text-aquamarine">
              Are you looking for a specific subject?
            </div>
          </div>
        </RadioGroup.Label>
        <div className="flex flex-wrap">
          {subjectList.map((subject, index) => (
            <div key={index} className="mx-auto mb-8 max-w-md   px-2">
              <SubjectOptions subject={subject} />
            </div>
          ))}
        </div>
      </RadioGroup>
      <div className="flex justify-between">
        <div>
          <div className=" text-aquamarine">
            How detailed do you want your cards?
          </div>
          <div className="mt-2 flex max-w-[300px] space-x-2">
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
        </div>
        <div className="max-w-[300px]">
          <Dropdown
            label="Language"
            options={languages}
            name="languageField"
            onChange={handleLanguageChange}
            value={getSelectedLanguage(formik.values.languageField)}
            style={"select"}
          />
        </div>
      </div>
    </>
  );
};

export { AdvancedOptions };
