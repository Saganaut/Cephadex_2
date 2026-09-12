import { InputField } from "@common/Form/InputField";
import { TextAreaField } from "@common/Form/TextAreaField";
import type ExtractFormValues from "@extract/data/ExtractFormValues";
import { CustomErrorMessage } from "@source/common/Form/CustomErrorMessage";
import { useFormikContext } from "formik";
import React, { type ReactElement, useEffect } from "react";

const NewDeck = (): ReactElement => {
  const formik = useFormikContext<ExtractFormValues>();

  useEffect(() => {
    if (formik.values.nameField.trim() !== "") {
      if (formik.values.existingDeckField !== null) {
        void formik.setFieldValue("existingDeckField", null);
      }
    }
  }, [formik.values.existingDeckField, formik]);

  return (
    <div id="new-deck">
      <h5 className="mt-4 pb-2  text-tolopea dark:text-aquamarine">Name</h5>
      <InputField
        name="nameField"
        value={formik.values.nameField}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="e.g. The biology of Cephalopods "
        type="text"
        handleOnKeyDown={undefined}
      />{" "}
      <CustomErrorMessage name="nameField" />
      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 lg:w-[70%]">
          <h5 className="text-tolopea dark:text-aquamarine">Description</h5>

          <TextAreaField
            name="descriptionField"
            value={formik.values.descriptionField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="e.g. Testing my knowledge of Cephalopods"
            style="w-full" // Ensure the textarea takes the full width of its parent div
          />
          <CustomErrorMessage name="textAreaField" />
        </div>
        <div className="flex-1 lg:w-[30%]">
          <h5 className="pb-2 text-tolopea dark:text-aquamarine">Tags</h5>

          <InputField
            name="tagField"
            value={formik.values.tagField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g. Marine life, Biology"
            type="text"
            className="w-full"
            handleOnKeyDown={undefined}
          />
          <CustomErrorMessage name="tagField" />
        </div>
      </div>
    </div>
  );
};

export { NewDeck };
