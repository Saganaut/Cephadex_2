import { Dropdown } from "@common/Form/Dropdown";
import { useFormikContext } from "formik";
import React, { useRef } from "react";

import type ExtractFormValues from "../../data/ExtractFormValues";
import { languages } from "../languages";
import { CardTypeOptions } from "./CardTypeOptions";
import { ExtrasOptions } from "./ExtrasOptions";

const RightSide: React.FC = () => {
  const formik = useFormikContext<ExtractFormValues>();

  const dropdownRef = useRef<HTMLInputElement>(null);
  const handleLanguageChange = (selectedOption: {
    value: number;
    label: string;
  }): void => {
    void formik.setFieldValue("languageField", selectedOption.label);
    void formik.setFieldValue("translationField", selectedOption.label);
  };

  const getSelectedLanguage = (
    value: string
  ): {
    value: number;
    label: string;
  } => {
    const selectedLanguage = languages.find(
      (languages) => languages.label === value
    ) ?? {
      value: 1,
      label: "English",
    };

    return selectedLanguage;
  };
  return (
    <>
      <div className="stretch flex h-full w-full min-w-[280px] grow flex-col rounded-xl border-4 border-electric-violet-700 bg-electric-violet-200/50 p-2 dark:border-mariana-blue dark:bg-tolopea sm:p-4 md:min-w-[400px] lg:min-h-[50vh] lg:justify-between">
        <div id="card-type">
          <CardTypeOptions langDropDownRef={dropdownRef} />
        </div>
        <div
          id="extras"
          className="rounded-2xl bg-electric-violet-500 p-2 dark:bg-transparent"
        >
          <ExtrasOptions />
        </div>
        <div id="language-select">
          <Dropdown
            dropdownRef={dropdownRef}
            label={"Language"}
            name="languageField"
            style="select"
            options={languages}
            onChange={handleLanguageChange}
            value={getSelectedLanguage(formik.values.languageField)}
          />
        </div>
      </div>
    </>
  );
};

export { RightSide };
