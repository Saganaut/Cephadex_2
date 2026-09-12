import { cardTypes } from "@common/Form/CardTypeSelector/cardTypes";
import { Dropdown } from "@common/Form/Dropdown";
import { InputField } from "@common/Form/InputField";
import type ExtractFormValues from "@extract/data/ExtractFormValues";
import { CardTypeSelector } from "@source/common/Form/CardTypeSelector";
import { languages } from "@source/pages/Extract/StepOneComponents/languages";
import { useFormikContext } from "formik";
import React, { type ReactElement, useEffect, useRef } from "react";

interface CardTypeOptionsProps {
  langDropDownRef?: React.RefObject<HTMLInputElement>;
}

const CardTypeOptions: React.FC<CardTypeOptionsProps> = (
  langDropDownRef
): ReactElement => {
  const formik = useFormikContext<ExtractFormValues>();
  const card = formik.values.cardTypeField;

  const getSelectedLanguage = (
    value: string
  ): { value: number; label: string } => {
    const foundLanguage = languages.find((lang) => lang.label === value);
    if (foundLanguage !== undefined) {
      return foundLanguage;
    } else {
      return { value: 0, label: "Choose a language" };
    }
  };
  const handleLanguageChange = (selectedOption: { value: any }): void => {
    void formik.setFieldValue("translationField", selectedOption.value);
  };
  const selectedCardTypeValue = formik.values.cardTypeField;
  const dropdownRef = useRef<HTMLInputElement>(null);
  const customRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedCardTypeValue === "Translate" && dropdownRef.current != null) {
      dropdownRef.current?.focus();
    }
    if (selectedCardTypeValue === "Custom" && dropdownRef.current != null) {
      customRef.current?.focus();
    }
  }, [selectedCardTypeValue]);
  return (
    <div>
      <h3 className="p-2 text-lg text-tolopea dark:text-white sm:text-xl">
        {" "}
        Type of cards to create: {formik.values.cardTypeField}
      </h3>
      <CardTypeSelector
        name="cardTypeField"
        card={card}
        onChange={(value) => {
          void formik.setFieldValue("cardTypeField", value);
        }}
        onBlur={formik.handleBlur}
        size="small"
        cardTypes={cardTypes}
      />

      {selectedCardTypeValue === "Custom" && (
        <div className="py-1">
          <h4 className=" p-2 text-tolopea dark:text-aquamarine">
            {" "}
            How should we customize your cards?
          </h4>
          <div className=" mb-2">
            <InputField
              inputFieldRef={customRef}
              name="customTermField"
              value={formik.values.customTermField}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="What do you want to get out of it?"
              type="text"
              handleOnKeyDown={undefined}
            />
          </div>
          <div className="">
            <InputField
              name="customContentField"
              value={formik.values.customContentField}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="What do you want us to do with it?"
              type="text"
              handleOnKeyDown={undefined}
            />
          </div>
        </div>
      )}
      {langDropDownRef === undefined &&
        (selectedCardTypeValue === "Translate" ||
          selectedCardTypeValue === "Transcribe") && (
          <Dropdown
            dropdownRef={dropdownRef}
            label="Language"
            options={languages}
            name="translationField"
            onChange={handleLanguageChange}
            value={getSelectedLanguage(formik.values.translationField)}
            style={"select"}
          />
        )}
    </div>
  );
};

export { CardTypeOptions };
